# Argentina Mobile App

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/smarterbotcl/v0-argentina-mobile-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/ZpFdKjxUHBd)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## 🔐 Authentication with Clerk MCP

This application uses Clerk for corporate login with a Model Context Protocol (MCP) system for easy configuration.

### Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Get your Clerk keys:**
   - Go to https://dashboard.clerk.com/
   - Create or select your application
   - Copy your `Publishable Key` and `Secret Key`

3. **Configure environment variables:**
   Edit `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ```

4. **Test the configuration:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/api/mcp/clerk-config to verify
   ```

### MCP Endpoints

- **`GET /api/mcp/clerk-config`** - Check Clerk configuration status
- **`POST /api/mcp/clerk-config`** - Validate Clerk keys format

### Testing

Run the automated test suite:
```bash
./test-mcp-clerk.sh
```

### Documentation

For detailed setup instructions, see:
- **[MCP-CLERK-GUIDE.md](./MCP-CLERK-GUIDE.md)** - Complete MCP configuration guide
- **[CLERK-SETUP.md](./CLERK-SETUP.md)** - Step-by-step Clerk setup
- **[KEYS-REQUIRED.md](./KEYS-REQUIRED.md)** - Required API keys

## Deployment

Your project is live at:

**[https://vercel.com/smarterbotcl/v0-argentina-mobile-app](https://vercel.com/smarterbotcl/v0-argentina-mobile-app)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/ZpFdKjxUHBd](https://v0.dev/chat/projects/ZpFdKjxUHBd)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository