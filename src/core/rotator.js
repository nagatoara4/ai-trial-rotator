const accountManager = require('./accountManager');
const providers = require('./providers');

module.exports = {
  async next(providerName) {
    const healthy = accountManager.getHealthy(providerName);
    if (healthy.length === 0) {
      throw new Error(`No healthy accounts for ${providerName}. Add or create a new trial.`);
    }
    // Round-robin by last_used
    const account = healthy[0];
    accountManager.touch(account.id);
    return account;
  },

  async createFresh(providerName) {
    const provider = providers.get(providerName);
    if (!provider) throw new Error(`Unknown provider: ${providerName}`);

    // In production this calls provider.createTrial with anti-detect browser
    // For now we return the manual guidance so the operator can still use the system
    const result = await provider.createTrial({});
    return result;
  },

  markExhausted(id) {
    accountManager.markExhausted(id);
  }
};
