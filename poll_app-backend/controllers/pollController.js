const Poll = require('../models/Poll');

// ✅ Create Poll (Admin Only)
const createPoll = async (req, res) => {
  const { question, options, closingDate } = req.body;

  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only admins can create polls' });
  }

  if (!question || !Array.isArray(options) || options.length < 2 || !closingDate) {
    return res.status(400).json({ message: 'Question, at least 2 options, and closing date are required.' });
  }

  try {
    const newPoll = new Poll({
      question,
      options,
      closingDate,
      createdBy: req.user.id,
    });

    // Initialize vote count
    options.forEach(option => {
      newPoll.votes.set(option, 0);
    });

    await newPoll.save();
    res.status(201).json({ message: 'Poll created successfully', poll: newPoll });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create poll', error: err.message });
  }
};

// ✅ Get All Polls (Admin & User)
const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.status(200).json(polls);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch polls', error: err.message });
  }
};

// ✅ Get Poll by ID (Admin & User)
const getPollById = async (req, res) => {
  console.log("🟢 getPollById HIT:", req.params.id);

  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    const hasVoted = poll.votedUsers.includes(req.user.id);
    res.status(200).json({ poll, hasVoted });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching poll', error: err.message });
  }
};

// ✅ Delete Poll (Admin Only)
const deletePoll = async (req, res) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only admins can delete polls' });
  }

  try {
    const deleted = await Poll.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Poll not found' });

    res.status(200).json({ message: 'Poll deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete poll', error: err.message });
  }
};

// ✅ Vote on a Poll (User Only)
const votePoll = async (req, res) => {
  const { selectedOption } = req.body;
  const pollId = req.params.id;

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    if (poll.isClosed || new Date(poll.closingDate) < new Date()) {
      return res.status(400).json({ message: 'Poll is closed' });
    }

    if (poll.votedUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already voted on this poll' });
    }

    if (!poll.options.includes(selectedOption)) {
      return res.status(400).json({ message: 'Invalid option selected' });
    }

    const currentVotes = poll.votes.get(selectedOption) || 0;
    poll.votes.set(selectedOption, currentVotes + 1);
    poll.votedUsers.push(req.user.id);

    await poll.save();
    res.status(200).json({ message: 'Vote submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to vote', error: err.message });
  }
};

// ✅ Close Poll Manually (Admin Only)
const closePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Only admins can close polls' });
    }

    poll.isClosed = true;
    await poll.save();

    res.status(200).json({ message: 'Poll closed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to close poll', error: err.message });
  }
};

// ✅ Export Controllers
module.exports = {
  createPoll,
  getAllPolls,
  getPollById,
  deletePoll,
  votePoll,
  closePoll // ⬅️ Exported here
};
