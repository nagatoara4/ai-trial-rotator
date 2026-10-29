const express = require('express');
const router = express.Router();
const rotator = require('../../core/rotator');

// Get next healthy account for a provider
router.post('/next', async (req, res) => {
  try {
    const { provider } = req.body;
    if (!provider) return res.status(400).json({ success: false, error: 'provider required' });
    const account = await rotator.next(provider);
    res.json({ success: true, data: account });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Force create a fresh trial account
router.post('/create', async (req, res) => {
  try {
    const { provider } = req.body;
    if (!provider) return res.status(400).json({ success: false, error: 'provider required' });
    const account = await rotator.createFresh(provider);
    res.json({ success: true, data: account });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mark account as exhausted / dead
router.post('/exhaust/:id', (req, res) => {
  try {
    rotator.markExhausted(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
