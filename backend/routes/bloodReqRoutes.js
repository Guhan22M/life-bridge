const express = require('express');
const router = express.Router();

const{ sendBloodRequest, getBloodRequestHistory, deleteBloodRequest } = require('../controllers/bloodReqController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendBloodRequest);
router.get('/history',protect, getBloodRequestHistory);
router.delete('/:id',protect, deleteBloodRequest);

module.exports =router;
