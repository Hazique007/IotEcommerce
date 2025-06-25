const db = require('../db');

// Add Product
const addProduct = async (req, res) => {
  const { name, description, price, image_url, f1, f2, f3 } = req.body;
  try {
    await db.execute(
      'INSERT INTO products (name, description, price, image_url, f1, f2, f3) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, image_url, f1, f2, f3]
    );
    res.status(201).json({ msg: 'Product added successfully' });
  } catch (err) {
    console.error('Add Product Error:', err);
    res.status(500).json({ msg: 'Server error while adding product' });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    // For filtering by name using LIKE
    const searchQuery = `%${search}%`;

    const [products] = await db.execute(
      'SELECT * FROM products WHERE name LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [searchQuery, limit, offset]
    );

    const [[{ total }]] = await db.execute(
      'SELECT COUNT(*) as total FROM products WHERE name LIKE ?',
      [searchQuery]
    );

    res.json({ products, total });
  } catch (err) {
    console.error('Fetch Products Error:', err);
    res.status(500).json({ msg: 'Server error fetching products' });
  }
};


// Update Product
const updateProduct = async (req, res) =>{
  try {
    const userID = req.user.id;
    const cartItems = req.body; // full updated cart

    // Clear and re-insert (or update existing)
    await db.execute('DELETE FROM cart WHERE userID = ?', [userID]);

    for (let item of cartItems) {
      await db.execute(
        'INSERT INTO cart (userID, productID, qty) VALUES (?, ?, ?)',
        [userID, item.id, item.qty]
      );
    }

    res.json({ msg: 'Cart updated' });
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ msg: 'Failed to update cart' });
  }
}

// Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ msg: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete Product Error:', err);
    res.status(500).json({ msg: 'Server error deleting product' });
  }
};

// Get Single Product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);

    if (product.length === 0) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(product[0]);
  } catch (err) {
    console.error('Fetch Single Product Error:', err);
    res.status(500).json({ msg: 'Server error fetching product' });
  }
};


module.exports = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById
};

