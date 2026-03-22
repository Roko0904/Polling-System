const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

// Create poll
router.post('/', async (req, res) => {
  try {
    const { question, options, expiresAt } = req.body;

    if (!question || !options || options.length < 2 || !expiresAt) {
      return res.status(400).json({ error: 'Question, minimum 2 options, and expiry required' });
    }

    const poll = new Poll({
      question,
      options: options.map(o => ({ text: o, votes: 0 })),
      expiresAt: new Date(expiresAt)
    });

    await poll.save();
    console.log('✅ Poll created:', poll.question);
    res.status(201).json(poll);
  } catch (err) {
    console.error('❌ Create poll error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

//  optional filter
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    const { filter } = req.query;
    const now = new Date();

    let result = polls;
    if (filter === 'active') result = polls.filter(p => new Date(p.expiresAt) > now);
    if (filter === 'expired') result = polls.filter(p => new Date(p.expiresAt) <= now);

    res.json(result);
  } catch (err) {
    console.error('❌ Fetch polls error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// vote
router.post('/:id/vote', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    if (new Date() > new Date(poll.expiresAt)) {
      return res.status(403).json({ error: 'Poll has expired. Voting is closed.' });
    }

    const { optionIndex } = req.body;
    if (optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ error: 'Invalid option selected' });
    }

    
    poll.options[optionIndex].votes += 1;
    poll.markModified('options');
    await poll.save();

    console.log(`✅ Vote cast on: "${poll.question}" → Option ${optionIndex}`);
    res.json(poll);
  } catch (err) {
    console.error('Vote error:', err.message);
    res.status(500).json({ error: err.message });
  }
});
//  Delete poll
router.delete('/:id', async (req, res) => {
  try {
    await Poll.findByIdAndDelete(req.params.id);
    await Vote.deleteMany({ pollId: req.params.id });
    res.json({ message: 'Poll deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;