const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// SIGN UP
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'user'] // default role is 'user'
    );

    res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userID: user.userID, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      msg: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET ALL USERS (for admin)
const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  try {
    // Search filter
    const searchQuery = `%${search}%`;

    // Get filtered users with pagination
    const [users] = await db.query(
      'SELECT userID, username, email, role FROM users WHERE username LIKE ? LIMIT ? OFFSET ?',
      [searchQuery, limit, offset]
    );

    // Get total count of filtered users
    const [countResult] = await db.query(
      'SELECT COUNT(*) AS total FROM users WHERE username LIKE ?',
      [searchQuery]
    );

    const total = countResult[0].total;

    res.json({ users, total });
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};


// GET USER BY ID (username & email)
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.query('SELECT username, email FROM users WHERE userID = ?', [userId]);

    if (result.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Fetch user by ID error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, role } = req.body;

  try {
    await db.execute('UPDATE users SET username = ?, role = ? WHERE userID = ?', [
      username,
      role,
      userId
    ]);
    res.json({ msg: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// DELETE - Remove user
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    await db.execute('DELETE FROM users WHERE userID = ?', [userId]);
    res.json({ msg: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};