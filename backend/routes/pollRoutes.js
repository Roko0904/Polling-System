const express = require('express')
const router = express.Router()
const Poll = require('../models/Poll')
const Vote = require('../models/Vote')
const auth = require('../middleware/auth')

// Get all polls — public
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 })
    const { filter } = req.query
    const now = new Date()
    let result = polls
    if (filter === 'active') result = polls.filter(p => new Date(p.expiresAt) > now)
    if (filter === 'expired') result = polls.filter(p => new Date(p.expiresAt) <= now)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single poll — public
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
    if (!poll) return res.status(404).json({ error: 'Poll not found' })
    res.json(poll)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get MY polls
router.get('/user/mypolls', auth, async (req, res) => {
  try {
    const polls = await Poll.find({ createdBy: req.user.id }).sort({ createdAt: -1 })
    res.json(polls)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create
router.post('/', auth, async (req, res) => {
  try {
    const { question, options, expiresAt } = req.body
    if (!question || !options || options.length < 2 || !expiresAt)
      return res.status(400).json({ error: 'Please fill the all Field' })

    const poll = new Poll({
      question,
      options: options.map(o => ({ text: o, votes: 0 })),
      expiresAt: new Date(expiresAt),
      createdBy: req.user.id,
      createdByName: req.user.name
    })
    await poll.save()
    res.status(201).json(poll)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Vote
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
    if (!poll) return res.status(404).json({ error: 'Poll not found' })
    if (new Date() > new Date(poll.expiresAt))
      return res.status(403).json({ error: 'Poll expired' })

    const { optionIndex } = req.body
    if (optionIndex === undefined || optionIndex < 0 || optionIndex >= poll.options.length)
      return res.status(400).json({ error: 'Invalid option' })

    const alreadyVoted = await Vote.findOne({ pollId: poll._id, userId: req.user.id })
    if (alreadyVoted) return res.status(403).json({ error: 'You have already voted' })

    poll.options[optionIndex].votes += 1
    poll.markModified('options')
    await poll.save()

    await Vote.create({ pollId: poll._id, optionIndex, userId: req.user.id })
    res.json(poll)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id)
    if (!poll) return res.status(404).json({ error: 'Poll not found' })

    if (!poll.createdBy) return res.status(403).json({ error: 'You can only delete your own poll!' })

    if (poll.createdBy.toString() !== req.user.id)
      return res.status(403).json({ error: 'You can only delete your own poll!' })

    await Poll.findByIdAndDelete(req.params.id)
    await Vote.deleteMany({ pollId: req.params.id })
    res.json({ message: 'Poll deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router