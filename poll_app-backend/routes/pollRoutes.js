const express = require('express');
const router = express.Router();
const {
  createPoll,
  getAllPolls,
  deletePoll,
  votePoll,
  getPollById,
  closePoll // ✅ make sure it's imported
} = require('../controllers/pollController');
const protect = require('../middleware/authMiddleware');

// ✅ Specific routes first
router.post('/create', protect, createPoll);
router.get('/', protect, getAllPolls);
router.post('/vote/:id', protect, votePoll);
router.post('/close/:id', protect, closePoll); // ✅ this must be above `/:id`
router.delete('/:id', protect, deletePoll);

// ✅ This must be last
router.get('/:id', protect, getPollById);

module.exports = router;
