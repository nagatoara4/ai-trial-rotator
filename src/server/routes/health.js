const express = require('express');
const router = express.Router();
const accountManager = require('../../core/accountManager');
const providers = require('../../core/providers');

router.get('/', (req, res) => {
  const accounts = accountManager.list();
  const byProvider = {};
  for (const a of accounts) {
    byProvider[a.provider] = byProvider[a.provider] || { total: 0, healthy: 0, exhausted: 0 };
    byProvider[a.provider].total++;
    if (a.status === 'healthy') byProvider[a.provider].healthy++;
    if (a.status === 'exhausted') byProvider[a.provider].exhausted++;
  }

  res.json({
    success: true,
    data: {
      totalAccounts: accounts.length,
      providers: providers.list().map(p => p.name),
      byProvider,
      uptime: process.uptime()
    }
  });
});

module.exports = router;
