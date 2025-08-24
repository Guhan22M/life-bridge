const express = require('express');
const router = express.Router();
const { generateFirstAid, getFirstAidHistory, deleteFirstAidEntry } = require('../controllers/firstAidController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, generateFirstAid);
router.get('/history', protect, getFirstAidHistory);
router.delete('/:id',protect, deleteFirstAidEntry);

module.exports = router;
