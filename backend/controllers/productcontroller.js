const db = require('../db');


// Add Product
const addProduct = async (req, res) => {
  const { name, description, price, image_url, f1, f2, f3, quantity } = req.body;
  try {
    await db.execute(
      'INSERT INTO products (name, description, price, image_url, f1, f2, f3, quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, image_url, f1, f2, f3, quantity]
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

const getAllWithoutPagination = async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
    res.json({ products });
  } catch (err) {
    console.error('Error fetching all products:', err);
    res.status(500).json({ msg: 'Server error fetching all products' });
  }
};



// Update Product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, image_url, f1, f2, f3, quantity } = req.body;

    const [result] = await db.execute(
      `UPDATE products SET 
        name = ?, 
        description = ?, 
        price = ?, 
        image_url = ?, 
        f1 = ?, 
        f2 = ?, 
        f3 = ?, 
        quantity = ?
      WHERE id = ?`,
      [name, description, price, image_url, f1, f2, f3, quantity, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ msg: 'Product updated successfully' });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ msg: 'Failed to update product' });
  }
};



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

const getLowStockProducts = async (req, res) => {
  try {
    const [products] = await db.execute(
      'SELECT * FROM products WHERE quantity < 5 ORDER BY quantity ASC'
    );
    res.json({ lowStock: products });
  } catch (err) {
    console.error('Low Stock Error:', err);
    res.status(500).json({ msg: 'Error fetching low stock products' });
  }
};

const updateProductQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE products SET quantity = ? WHERE id = ?',
      [quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json({ msg: 'Quantity updated successfully' });
  } catch (err) {
    console.error('Quantity update error:', err);
    res.status(500).json({ msg: 'Error updating quantity' });
  }
};



module.exports = {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,getAllWithoutPagination,getLowStockProducts, updateProductQuantity
};

