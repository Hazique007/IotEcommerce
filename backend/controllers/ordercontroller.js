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

const getUserOrdersWithDateFilter = async (req, res) => {
  const userID = req.userID; // from token middleware
  // const { from, to } = req.query;

  console.log(userID);
  

  let query = `
    SELECT o.id AS orderID, o.totalAmount, o.paymentMethod, o.created_at,
           oi.productID, p.name, oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.id = oi.orderID
    JOIN products p ON oi.productID = p.id
    WHERE o.userID = ?
  `;
  const params = [userID];

  // if (from) {
  //   query += " AND DATE(o.created_at) >= ?";
  //   params.push(from);
  // }
  // if (to) {
  //   query += " AND DATE(o.created_at) <= ?";
  //   params.push(to);
  // }

  // query += " ORDER BY o.created_at DESC";

  try {
    const [rows] = await db.execute(query, params);
    // group by orderID
    const grouped = rows.reduce((acc, row) => {
      if (!acc[row.orderID]) acc[row.orderID] = {
        orderID: row.orderID,
        totalAmount: row.totalAmount,
        paymentMethod: row.paymentMethod,
        created_at: row.created_at,
        items: []
      };
      acc[row.orderID].items.push({
        productID: row.productID,
        name: row.name,
        quantity: row.quantity,
        price: row.price
      });
      return acc;
    }, {});
    res.json(Object.values(grouped));
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching orders" });
  }
};

const getUserOrders = async (req, res) => {
  const userID = req.userID;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    // Step 1: Get total number of orders first
    const [totalCount] = await db.execute(
      `SELECT COUNT(*) AS total FROM orders WHERE userID = ?`,
      [userID]
    );

    const totalOrders = totalCount[0].total;

    // If no orders exist, return early
    if (totalOrders === 0) {
      return res.json({ 
        orders: [], 
        total: 0, 
        currentPage: page,
        totalPages: 0,
        hasMore: false 
      });
    }

    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / limit);

    // If requesting a page beyond available data, return empty
    if (page > totalPages) {
      return res.json({ 
        orders: [], 
        total: totalOrders, 
        currentPage: page,
        totalPages: totalPages,
        hasMore: false 
      });
    }

    // Step 2: Get paginated order IDs (latest first)
    const [orderIDsResult] = await db.execute(
      `SELECT id, created_at FROM orders WHERE userID = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userID, limit, offset]
    );

    const orderIDs = orderIDsResult.map(order => order.id);

    // Step 3: Fetch full order details for only these order IDs
    const [orderDetails] = await db.execute(
      `SELECT o.id AS orderID, o.totalAmount, o.paymentMethod, o.created_at,
              oi.productID, p.name, oi.quantity, oi.price
       FROM orders o
       JOIN order_items oi ON o.id = oi.orderID
       JOIN products p ON oi.productID = p.id
       WHERE o.id IN (${orderIDs.map(() => '?').join(',')})
       ORDER BY o.created_at DESC`,
      orderIDs
    );

    // Step 4: Group by orderID
    const grouped = orderDetails.reduce((acc, row) => {
      if (!acc[row.orderID]) {
        acc[row.orderID] = {
          orderID: row.orderID,
          totalAmount: row.totalAmount,
          paymentMethod: row.paymentMethod,
          created_at: row.created_at,
          items: []
        };
      }
      acc[row.orderID].items.push({
        productID: row.productID,
        name: row.name,
        quantity: row.quantity,
        price: row.price
      });
      return acc;
    }, {});

    // Determine if there are more pages
    const hasMore = page < totalPages;

    res.json({
      orders: Object.values(grouped),
      total: totalOrders,
      currentPage: page,
      totalPages: totalPages,
      hasMore: hasMore,
      limit: limit
    });

  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ 
      msg: 'Error fetching orders',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const getAllOrdersForAdminPaginated = async (req, res) => {
  const noPagination = req.query.noPagination === 'true';
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const { email, paymentMethod, date, status, productName } = req.query;

  try {
    let conditions = [];
    let values = [];

    if (email) {
      conditions.push('u.email LIKE ?');
      values.push(`%${email}%`);
    }
    if (paymentMethod) {
      conditions.push('o.paymentMethod LIKE ?');
      values.push(`%${paymentMethod}%`);
    }
    if (status) {
      conditions.push('o.status LIKE ?');
      values.push(`%${status}%`);
    }
    if (productName) {
      conditions.push('p.name LIKE ?');
      values.push(`%${productName}%`);
    }
    if (date) {
      conditions.push('DATE(o.created_at) = ?');
      values.push(date);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Skip count if noPagination is true
    let total = 0;
    if (!noPagination) {
      const [totalResult] = await db.execute(
        `SELECT COUNT(*) AS total
         FROM orders o
         JOIN users u ON o.userID = u.userID
         JOIN order_items oi ON o.id = oi.orderID
         JOIN products p ON p.id = oi.productID
         ${whereClause}`,
        values
      );
      total = totalResult[0].total;
    }

    // Main data query
    const query = `
      SELECT 
        o.id AS orderID,
        o.userID,
        u.email AS userEmail,
        o.totalAmount,
        o.paymentMethod,
        o.status,
        o.created_at,
        oi.productID,
        p.name AS productName
      FROM orders o
      JOIN users u ON o.userID = u.userID
      JOIN order_items oi ON o.id = oi.orderID
      JOIN products p ON p.id = oi.productID
      ${whereClause}
      ORDER BY o.created_at DESC
      ${!noPagination ? 'LIMIT ? OFFSET ?' : ''}
    `;

    const finalValues = !noPagination ? [...values, limit, offset] : values;
    const [rows] = await db.execute(query, finalValues);

    if (noPagination) {
      return res.json({ orders: rows }); // for CSV
    }

    const totalPages = Math.ceil(total / limit);
    res.json({
      orders: rows,
      total,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages
    });

  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ msg: 'Failed to fetch orders' });
  }
};



const getOrdersOverview = async (req, res) => {
  try {
    const [[{ count }]] = await db.execute('SELECT COUNT(*) AS count FROM orders');
    const [[{ monthly }]] = await db.execute(`
      SELECT COUNT(*) AS monthly FROM orders 
      WHERE MONTH(created_at)=MONTH(CURRENT_DATE()) 
        AND YEAR(created_at)=YEAR(CURRENT_DATE())
    `);

    const [byMonth] = await db.execute(`
      SELECT MONTH(created_at) AS month, SUM(totalAmount) AS sales
      FROM orders
      WHERE YEAR(created_at)=YEAR(CURRENT_DATE())
      GROUP BY MONTH(created_at)
      ORDER BY month
    `);

    const [[{ totalSales }]] = await db.execute(`SELECT SUM(totalAmount) AS totalSales FROM orders`);

    const [[topProduct]] = await db.execute(`
      SELECT p.name, SUM(oi.quantity) AS totalOrdered
      FROM order_items oi
      JOIN products p ON p.id = oi.productID
      GROUP BY oi.productID
      ORDER BY totalOrdered DESC
      LIMIT 1
    `);

    res.json({
      totalOrders: count,
      ordersThisMonth: monthly,
      monthlySales: byMonth,
      totalSales,
      topProduct: topProduct?.name || 'N/A'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching overview' });
  }
};





module.exports = {getAllOrdersForAdminPaginated,getOrdersOverview,
  placeOrder,buyNowOrder,getUserOrders,getBuyNowItems,getTempOrder,getOrderSummary ,deleteOrderItem,getUserOrdersWithDateFilter}
