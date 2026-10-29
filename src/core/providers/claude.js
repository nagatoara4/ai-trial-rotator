module.exports = {
  name: 'claude',
  displayName: 'Anthropic Claude',
  baseUrl: 'https://claude.ai',
  trialDays: 0, // free tier / pro trial varies

  info() {
    return {
      name: this.name,
      displayName: this.displayName,
      trialDays: this.trialDays,
      models: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-haiku']
    };
  },

  async createTrial({ email, password, proxy }) {
    return {
      success: false,
      message: 'Manual or custom automation required.',
      manualSteps: [
        '1. Open https://claude.ai in clean profile',
        '2. Sign up / start free trial',
        '3. Extract session cookies',
        '4. Add via dashboard'
      ]
    };
  },

  async validateSession(account) {
    return true;
  }
};
