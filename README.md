# AI Trial Rotator

**Keep premium AI models alive forever on free trials.**

A production-ready multi-provider free-trial rotator and session manager.  
Automatically creates, activates, rotates and manages free trials / free-tier accounts across major AI providers so you never hit a paywall.

Works on:
- Web (any browser)
- Android & iOS (PWA)
- Windows & Linux (desktop)

## Supported Providers (extensible)

- xAI Grok
- Anthropic Claude
- OpenAI GPT
- Google Gemini
- Mistral
- DeepSeek
- Any OpenAI-compatible endpoint

## Features

- Automatic trial account creation & activation
- Encrypted local session store
- Smart rotation when quota or trial expires
- Proxy / residential IP support
- Fingerprint isolation
- Clean React dashboard
- One-click “new trial”
- Usage analytics & health dashboard
- Fully open-source, MIT licensed

## Quick Start

```bash
git clone https://github.com/nagatoara4/ai-trial-rotator.git
cd ai-trial-rotator
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000

## Production Deploy

Dashboard is already live on Netlify.  
Backend can be deployed anywhere that runs Node (Railway, Render, Fly, VPS…).

## Architecture

```
src/
  core/           # rotation engine, account manager, providers
  providers/      # individual AI provider adapters
  dashboard/      # React frontend
  server/         # Express API
  utils/          # crypto, fingerprint, proxy helpers
```

## License

MIT — free to use, modify, sell, teach.

Built with intent by ylivo4real 👾
