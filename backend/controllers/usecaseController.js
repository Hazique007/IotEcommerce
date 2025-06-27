const db = require('../db');

const addUseCase = async (req, res) =>  {
  const { company, logo_url, quote, name, position } = req.body;
  try {
    await db.execute(
      'INSERT INTO use_cases (company, logo_url, quote, name, position) VALUES (?, ?, ?, ?, ?)',
      [company, logo_url, quote, name, position]
    );
    res.status(201).json({ msg: 'Use case added' });
  } catch (err) {
    console.error('Add Use Case Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
}

const getAllUseCases = async (req, res) => {
  try {
    const [cases] = await db.execute('SELECT * FROM use_cases ORDER BY created_at DESC');
    res.json(cases);
  } catch (err) {
    console.error('Get Use Cases Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const deleteUseCase = async (req, res) =>  {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM use_cases WHERE id = ?', [id]);
    res.json({ msg: 'Use case deleted' });
  } catch (err) {
    console.error('Delete Use Case Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateUseCase = async (req, res) =>{
  const { id } = req.params;
  const { company, logo_url, quote, name, position } = req.body;
  try {
    await db.execute(
      'UPDATE use_cases SET company = ?, logo_url = ?, quote = ?, name = ?, position = ? WHERE id = ?',
      [company, logo_url, quote, name, position, id]
    );
    res.json({ msg: 'Use case updated' });
  } catch (err) {
    console.error('Update Use Case Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getPaginatedUseCases = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 4;
  const offset = (page - 1) * limit;

  try {
    const [data] = await db.query(
      'SELECT * FROM use_cases ORDER BY id DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const [totalCountResult] = await db.query('SELECT COUNT(*) as count FROM use_cases');
    const total = totalCountResult[0].count;
    res.json({ data, total });
  } catch (err) {
    console.error('Pagination Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};




module.exports = {
  addUseCase,
  getAllUseCases,
  deleteUseCase,
  updateUseCase,
  getPaginatedUseCases
};