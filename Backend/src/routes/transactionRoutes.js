const express = require('express');
const { listTransactions, getStatistics,getBarChartData,getPieChartData,getCombinedData } = require('../controllers/transactionController');
const router = express.Router();

router.get('/', listTransactions);
router.get('/statistics', getStatistics);
router.get('/Barchart',getBarChartData);
router.get('/Piechart',getPieChartData);
router.get('/combined',getCombinedData);

module.exports = router;