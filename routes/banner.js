const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM banner LIMIT 1');
    console.log(rows, 'rows');
    res.json(rows[0] || { isVisible: false, description: 'hello', timer: 0, link: '' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banner data', error });
  }
});

router.post('/', async (req, res) => {
  const { isVisible, description, timer, link } = req.body;
  try {
    // First, check if a banner record exists
    const [existingRows] = await pool.query('SELECT id FROM banner LIMIT 1');
    
    if (existingRows.length > 0) {
      // If a record exists, update it
      await pool.query(
        'UPDATE banner SET isVisible = ?, description = ?, timer = ?, link = ? WHERE id = ?',
        [isVisible, description, timer, link, existingRows[0].id]
      );
    } else {
      // If no record exists, insert a new one
      await pool.query(
        'INSERT INTO banner (isVisible, description, timer, link) VALUES (?, ?, ?, ?)',
        [isVisible, description, timer, link]
      );
    }
    
    res.json({ message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ message: 'Error updating banner', error });
  }
});

module.exports = router;