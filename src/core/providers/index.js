const grok = require('./grok');
const claude = require('./claude');
const openai = require('./openai');
const gemini = require('./gemini');

const registry = {
  grok,
  claude,
  openai,
  gemini
};

module.exports = {
  list() {
    return Object.values(registry).map(p => p.info());
  },
  get(name) {
    return registry[name.toLowerCase()] || null;
  },
  register(name, adapter) {
    registry[name.toLowerCase()] = adapter;
  }
};
