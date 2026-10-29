module.exports = {
  name: 'openai',
  displayName: 'OpenAI GPT',
  baseUrl: 'https://chat.openai.com',
  trialDays: 0,

  info() {
    return {
      name: this.name,
      displayName: this.displayName,
      trialDays: this.trialDays,
      models: ['gpt-4o', 'gpt-4o-mini', 'o1-preview']
    };
  },

  async createTrial({ email, password, proxy }) {
    return {
      success: false,
      message: 'Manual or custom automation required.',
      manualSteps: [
        '1. Open https://chat.openai.com in clean profile',
        '2. Sign up / activate free credits if available',
        '3. Extract session + access token',
        '4. Add via dashboard'
      ]
    };
  },

  async validateSession(account) {
    return true;
  }
};
