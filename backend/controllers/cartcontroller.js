const db = require('../db');

const postcartorder = async (req, res) => {
  const userID = req.userID;
  const { productID, quantity = 1 } = req.body;

  if (!userID || !productID) {
    return res.status(400).json({ error: 'Missing userID or productID' });
  }

  try {
    // Check if already in cart
    const [existing] = await db.execute(
      'SELECT * FROM cart WHERE userID = ? AND productID = ?',
      [userID, productID]
    );

    if (existing.length > 0) {
      await db.execute(
        'UPDATE cart SET quantity = quantity + ? WHERE userID = ? AND productID = ?',
        [quantity, userID, productID]
      );
    } else {
      await db.execute(
        'INSERT INTO cart (userID, productID, quantity) VALUES (?, ?, ?)',
        [userID, productID, quantity]
      );
    }

    res.json({ message: 'Item added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

const getcartorder = async (req, res) => {
  const userID = req.userID;

  try {
    const [items] = await db.execute(
      `SELECT c.cartID, c.quantity AS qty,
              p.id AS productID, p.name, p.price, p.description, p.image_url
       FROM cart c
       JOIN products p ON c.productID = p.id
       WHERE c.userID = ?`,
      [userID]
    );

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};
const updateCartItemQty = async (req, res) => {
  const userID = req.userID;
  const { productID, quantity } = req.body;

  if (!userID || !productID || typeof quantity !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  try {
    // If quantity is 0 or less, remove the item
    if (quantity <= 0) {
      await db.execute(
        'DELETE FROM cart WHERE userID = ? AND productID = ?',
        [userID, productID]
      );
      return res.json({ message: 'Item removed from cart' });
    }

    // Otherwise, update the quantity
    await db.execute(
      'UPDATE cart SET quantity = ? WHERE userID = ? AND productID = ?',
      [quantity, userID, productID]
    );

    res.json({ message: 'Cart item updated successfully' });
  } catch (err) {
    console.error('Update Cart Error:', err);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};



module.exports = {
  postcartorder,
  getcartorder,
  updateCartItemQty
}