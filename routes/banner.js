const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM banner LIMIT 1');
    res.json(rows[0] || { isVisible: false, description: 'hello', timer: 0, link: '' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banner data', error });
  }
});

router.post('/', async (req, res) => {
  const { isVisible, description, timer, link } = req.body;
  try {
    await pool.query(
      'UPDATE banner SET isVisible = ?, description = ?, timer = ?, link = ? WHERE id = 1',
      [isVisible, description, timer, link]
    );
    res.json({ message: 'Banner updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner', error });
  }
});

module.exports = router;