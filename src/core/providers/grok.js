/**
 * xAI Grok provider adapter
 * Handles free-trial account creation & session extraction
 */
module.exports = {
  name: 'grok',
  displayName: 'xAI Grok',
  baseUrl: 'https://grok.x.ai',
  trialDays: 7,

  info() {
    return {
      name: this.name,
      displayName: this.displayName,
      trialDays: this.trialDays,
      models: ['grok-2', 'grok-2-mini', 'grok-beta']
    };
  },

  async createTrial({ email, password, proxy }) {
    // Production implementation uses Playwright to:
    // 1. Open signup page with clean fingerprint
    // 2. Fill email / password
    // 3. Complete any captcha / verification
    // 4. Activate free trial if offered
    // 5. Extract session cookies + bearer token
    // This is the real automation surface — left as the extension point
    // so operators can plug their own anti-detect browser + captcha solver.

    return {
      success: false,
      message: 'Automated trial creation requires anti-detect browser + captcha solver. Use manual add or plug your own runner.',
      manualSteps: [
        '1. Open https://grok.x.ai in a clean browser / anti-detect profile',
        '2. Sign up with a fresh email',
        '3. Activate free trial if offered',
        '4. Open DevTools → Application → Cookies / Local Storage',
        '5. Copy session cookies and any auth token',
        '6. Paste into the dashboard “Add Account” form'
      ]
    };
  },

  async validateSession(account) {
    // Ping a lightweight endpoint with the stored token/cookies
    // Return true if still valid
    return true;
  }
};
