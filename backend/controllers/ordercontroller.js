// controllers/orderController.js
const db = require('../db');
const axios = require('axios'); 

const placeOrder = async (req, res) => {
  const userID = req.userID;
  const { paymentMethod, source } = req.body;

  try {
    let allItems = [];

    if (source === 'buy_now') {
      const [tempItems] = await db.execute(
        `SELECT t.productID, p.name, p.description, p.price, t.quantity AS qty
         FROM temp_orders t
         JOIN products p ON t.productID = p.id
         WHERE t.userID = ?`,
        [userID]
      );
      allItems = tempItems;
    } else {
      const [cartItems] = await db.execute(
        `SELECT c.productID, p.name, p.description, p.price, c.quantity AS qty
         FROM cart c
         JOIN products p ON c.productID = p.id
         WHERE c.userID = ?`,
        [userID]
      );
      allItems = cartItems;
    }

    if (allItems.length === 0) {
      return res.status(400).json({ msg: 'No items to place order' });
    }

    const totalAmount = allItems.reduce((sum, item) => sum + item.qty * item.price, 0);

    const [orderResult] = await db.execute(
      'INSERT INTO orders (userID, totalAmount, paymentMethod) VALUES (?, ?, ?)',
      [userID, totalAmount, paymentMethod]
    );
    const orderID = orderResult.insertId;

    const conn = await db.getConnection();
    await conn.beginTransaction();

    const orderOps = allItems.map(async (item) => {
      await conn.execute(
        `INSERT INTO order_items (orderID, productID, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderID, item.productID, item.qty, item.price]
      );

      await conn.execute(
        `UPDATE products SET quantity = quantity - ? WHERE id = ?`,
        [item.qty, item.productID]
      );

      await conn.execute(
        `INSERT INTO inventory_movements 
         (product_id, change_type, quantity, quantity_received, received_by, received_date, invoice_number, note)
         VALUES (?, 'deduct', ?, NULL, ?, NOW(), NULL, ?)`,
        [
          item.productID,
          item.qty,
          'system',
          `Order #${orderID} by User ${userID}`
        ]
      );
    });

    await Promise.all(orderOps);

    if (source === 'buy_now') {
      await conn.execute('DELETE FROM temp_orders WHERE userID = ?', [userID]);
    } else {
      await conn.execute('DELETE FROM cart WHERE userID = ?', [userID]);
    }

    await conn.commit();
    conn.release();

    // ✅ Trigger low stock email after successful order placement
    const [lowStock] = await db.execute(
      'SELECT id, name, quantity FROM products WHERE quantity < 5'
    );

    if (lowStock.length > 0) {
      await axios.post('http://localhost:5000/api/inventory/notify-low-stock', {
        items: lowStock
      });
    }

    res.json({ msg: 'Order placed successfully', orderID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error while placing order' });
  }
};





const buyNowOrder = async (req, res) => {
  const userID = req.userID;
  const { productID } = req.body;

  try {
    // Clear previous buy now orders for this user
    await db.execute('DELETE FROM temp_orders WHERE userID = ?', [userID]);

    // Check if product exists
    const [[product]] = await db.execute('SELECT * FROM products WHERE id = ?', [productID]);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    // Insert the new one
    await db.execute(
      'INSERT INTO temp_orders (userID, productID, quantity) VALUES (?, ?, ?)',
      [userID, productID, 1]
    );

    res.json({ msg: 'Buy now order initiated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Buy now failed' });
  }
};

const getBuyNowItems = async (req, res) => {
  const userID = req.userID;

  try {
    const [items] = await db.execute(
      `SELECT t.productID, t.quantity AS qty,
              p.name, p.price, p.description, p.image_url
       FROM temp_orders t
       JOIN products p ON t.productID = p.id
       WHERE t.userID = ?`,
      [userID]
    );

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch buy now items' });
  }
};

const getTempOrder = async (req, res) => {
  const userID = req.userID;

  try {
    const [results] = await db.execute(
      `SELECT p.id as productID, p.name, p.description, p.price, p.image_url, t.quantity as qty
       FROM temp_orders t
       JOIN products p ON t.productID = p.id
       WHERE t.userID = ?`,
      [userID]
    );

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch Buy Now item' });
  }
};
// GET /api/orders/summary
const getOrderSummary = async (req, res) => {
  const userID = req.userID;

  try {
    // Fetch cart items
    const [cart] = await db.execute(
      `SELECT c.productID, p.name, p.description, p.price, c.quantity as qty
       FROM cart c
       JOIN products p ON c.productID = p.id
       WHERE c.userID = ?`,
      [userID]
    );

    // Fetch temp (Buy Now) item
    const [temp] = await db.execute(
      `SELECT t.productID, p.name, p.description, p.price, t.quantity as qty
       FROM temp_orders t
       JOIN products p ON t.productID = p.id
       WHERE t.userID = ?`,
      [userID]
    );

    res.json({
      cartItems: cart,
      tempOrder: temp.length ? temp[0] : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch order summary' });
  }
};
const deleteOrderItem = async (req, res) => {
  const userID = req.userID;
  const { source, productID } = req.params;

  let table;
  if (source === 'cart') table = 'cart';
  else if (source === 'temp') table = 'temp_orders';
  else return res.status(400).json({ msg: 'Invalid source type' });

  try {
    await db.execute(
      `DELETE FROM ${table} WHERE userID = ? AND productID = ?`,
      [userID, productID]
    );
    res.json({ msg: `${source === 'cart' ? 'Cart' : 'Buy Now'} item deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete item' });
  }
};




module.exports = {
  placeOrder,buyNowOrder,getBuyNowItems,getTempOrder,getOrderSummary ,deleteOrderItem}
