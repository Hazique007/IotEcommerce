const db = require('../db');
const nodemailer = require('nodemailer');

// Add a stock movement entry and update product stock accordingly
const addInventoryMovement = async (req, res) => {
  const {
    product_id,
    change_type, // 'add' or 'deduct'
    quantity,
    quantity_received, // for 'add'
    received_by,
    received_date,
    invoice_number,
    note,
  } = req.body;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Insert into inventory_movements
    await conn.execute(
      `INSERT INTO inventory_movements (
        product_id, change_type, quantity, quantity_received,
        received_by, received_date, invoice_number, note
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product_id,
        change_type,
        quantity,
        change_type === 'add' ? quantity_received || quantity : null,
        received_by,
        received_date,
        invoice_number,
        note,
      ]
    );

    // Update stock in products table
    const stockChange = change_type === 'add' ? quantity : -quantity;
    await conn.execute(
      'UPDATE products SET quantity = quantity + ? WHERE id = ?',
      [stockChange, product_id]
    );

    await conn.commit();
    res.status(201).json({ msg: 'Inventory movement recorded successfully' });
  } catch (err) {
    await conn.rollback();
    console.error('Inventory Movement Error:', err);
    res.status(500).json({ msg: 'Failed to record inventory movement' });
  } finally {
    conn.release();
  }
};

const getAllInventoryMovements = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10, type } = req.query;
    const offset = (page - 1) * limit;

    // Build conditional filter
    let typeCondition = '';
    if (type === 'add' || type === 'deduct') {
      typeCondition = `AND im.change_type = '${type}'`;
    }

    const [movements] = await db.execute(
      `
      SELECT im.*, p.name AS product_name
      FROM inventory_movements im
      JOIN products p ON im.product_id = p.id
      WHERE p.name LIKE ? ${typeCondition}
      ORDER BY im.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [`%${search}%`, Number(limit), Number(offset)]
    );

    const [[{ total }]] = await db.execute(
      `
      SELECT COUNT(*) AS total
      FROM inventory_movements im
      JOIN products p ON im.product_id = p.id
      WHERE p.name LIKE ? ${typeCondition}
    `,
      [`%${search}%`]
    );

    res.json({ movements, total });
  } catch (err) {
    console.error('Fetch Inventory Movements Error:', err);
    res.status(500).json({ msg: 'Failed to fetch inventory movements' });
  }
};


const getInventoryMovementById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT * FROM inventory_movements WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'Inventory movement not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Fetch Inventory Movement Error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


const deleteInventoryMovement = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      'DELETE FROM inventory_movements WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Inventory movement not found' });
    }

    res.json({ msg: 'Inventory movement deleted' });
  } catch (err) {
    console.error('Delete Inventory Movement Error:', err);
    res.status(500).json({ msg: 'Failed to delete inventory movement' });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT id, name, quantity
      FROM products
      WHERE quantity < 5
      ORDER BY quantity ASC
    `);

    res.json({ lowStock: rows });
  } catch (err) {
    console.error('Low stock fetch error:', err);
    res.status(500).json({ msg: 'Failed to fetch low stock products' });
  }
};

const getInventorySummary = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        change_type,
        SUM(quantity) as total_quantity
      FROM inventory_movements
      GROUP BY month, change_type
      ORDER BY month DESC
    `);

    // Format: [{ month: '2024-12', change_type: 'add', total_quantity: 200 }, ...]
    res.json(rows);
  } catch (err) {
    console.error('Inventory summary fetch error:', err);
    res.status(500).json({ msg: 'Failed to fetch inventory summary' });
  }
};

const getProductStockDistribution = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT name, quantity 
      FROM products
      WHERE quantity > 0
    `);

    // Optional: filter out zero-stock products if needed
    res.json({ data: rows });
  } catch (err) {
    console.error('Pie chart stock distribution error:', err);
    res.status(500).json({ msg: 'Failed to fetch stock distribution data' });
  }
};



const getPopularProducts = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        p.name AS product_name,
        COUNT(DISTINCT o.userID) AS user_count
      FROM 
        order_items oi
      JOIN 
        products p ON oi.productID = p.id
      JOIN 
        orders o ON oi.orderID = o.id
      GROUP BY 
        oi.productID
      ORDER BY 
        user_count DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching popular products:', err);
    res.status(500).json({ msg: 'Failed to fetch product popularity report' });
  }
};

const getMovementsByProduct = async (req, res) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const [movements] = await db.execute(`
      SELECT 
        id, change_type, quantity, received_by, received_date,
        invoice_number, note, created_at
      FROM inventory_movements
      WHERE product_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [productId, limit, offset]);

    const [[{ total }]] = await db.execute(
      'SELECT COUNT(*) as total FROM inventory_movements WHERE product_id = ?',
      [productId]
    );

    res.json({ movements, total });
  } catch (err) {
    console.error('Error fetching movement history:', err);
    res.status(500).json({ msg: 'Failed to fetch history' });
  }
};

const getFullProductHistory = async (req, res) => {
  const { productId } = req.params;

  try {
    const [rows] = await db.execute(`
      SELECT 
        im.id,
        im.change_type,
        im.quantity,
        im.received_by,
        im.received_date,
        im.invoice_number,
        im.note,
        im.created_at
      FROM inventory_movements im
      WHERE im.product_id = ?
      ORDER BY im.created_at DESC
    `, [productId]);

    res.json(rows);
  } catch (err) {
    console.error('Error fetching full movement history:', err);
    res.status(500).json({ msg: 'Failed to fetch full history' });
  }
};





const sendLowStockEmail = async (req, res) => {
  const { items } = req.body;

  const html = `
    <h2>⚠️ Low Stock Alert</h2>
    <p>The following products are low on stock:</p>
    <ul>
      ${items.map(i => `<li><strong>${i.name}</strong> - Qty: ${i.quantity}</li>`).join('')}
    </ul>
    <p>Please restock them as soon as possible.</p>
  `;

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass:  process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: '"IoT Inventory System" <${process.env.EMAIL_USER}>',
      to: 'khanhazique04@gmail.com',
      subject: 'Low Stock Alert',
      html
    });

    res.json({ msg: 'Email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to send email' });
  }
};





module.exports = {
  addInventoryMovement,
  getAllInventoryMovements,
  getInventoryMovementById,
  deleteInventoryMovement,
  getLowStockProducts,
   getInventorySummary,
   getPopularProducts,
    getProductStockDistribution,sendLowStockEmail,getMovementsByProduct,getFullProductHistory

};