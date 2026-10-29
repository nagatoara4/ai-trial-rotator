const express = require('express');
const router = express.Router();
const providers = require('../../core/providers');

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: providers.list()
  });
});

router.get('/:name', (req, res) => {
  const p = providers.get(req.params.name);
  if (!p) return res.status(404).json({ success: false, error: 'provider not found' });
  res.json({ success: true, data: p.info() });
});

module.exports = router;
