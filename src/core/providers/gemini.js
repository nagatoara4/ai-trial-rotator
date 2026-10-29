module.exports = {
  name: 'gemini',
  displayName: 'Google Gemini',
  baseUrl: 'https://gemini.google.com',
  trialDays: 0,

  info() {
    return {
      name: this.name,
      displayName: this.displayName,
      trialDays: this.trialDays,
      models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash']
    };
  },

  async createTrial({ email, password, proxy }) {
    return {
      success: false,
      message: 'Manual or custom automation required.',
      manualSteps: [
        '1. Open https://gemini.google.com in clean profile',
        '2. Sign in with fresh Google account',
        '3. Extract session cookies',
        '4. Add via dashboard'
      ]
    };
  },

  async validateSession(account) {
    return true;
  }
};
