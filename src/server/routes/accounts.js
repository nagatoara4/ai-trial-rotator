const express = require('express');
const router = express.Router();
const accountManager = require('../../core/accountManager');

// List all accounts
router.get('/', (req, res) => {
  try {
    const accounts = accountManager.list();
    res.json({ success: true, data: accounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add a new account manually
router.post('/', async (req, res) => {
  try {
    const { provider, email, password, token, cookies, notes } = req.body;
    if (!provider) return res.status(400).json({ success: false, error: 'provider required' });
    const account = await accountManager.add({ provider, email, password, token, cookies, notes });
    res.json({ success: true, data: account });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete account
router.delete('/:id', (req, res) => {
  try {
    accountManager.remove(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single account (decrypted for use)
router.get('/:id', (req, res) => {
  try {
    const account = accountManager.get(req.params.id);
    if (!account) return res.status(404).json({ success: false, error: 'not found' });
    res.json({ success: true, data: account });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
