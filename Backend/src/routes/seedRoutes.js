const express = require('express');
const { initializeDatabase } = require('../controllers/seedController');
const router = express.Router();

// Route to seed the database
router.get('/initialize', initializeDatabase);

module.exports = router;