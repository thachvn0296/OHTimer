# OHTimer
Once Human Reset Timer Discord Bot

This repository runs a small Discord bot that provides a slash command `/timer` showing the remaining time until the next Once Human global loot reset (every 4 hours UTC). It also exposes a lightweight HTTP server for health checks and serves `index.html` on the root route.

**Prerequisites**
- Node.js (16.9+ recommended)
- A Discord application and Bot created in the Discord Developer Portal

**Setup — Discord Developer Portal**
1. Open the Discord Developer Portal: https://discord.com/developers/applications
2. Create a new Application, then go to the "Bot" section and click "Add Bot".
3. Copy the Bot Token — you'll add this to your `.env` file. Keep it secret.
4. Under "OAuth2" → "URL Generator" select scopes: `bot` and `applications.commands`. For permissions, at minimum enable: `Send Messages`, `Embed Links`, and any other permissions your server requires.
5. Use the generated invite URL to add the bot to a Discord server you control.

**Environment (.env)**
Create a `.env` file in the project root with the following variables:

```
DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
# Optional: change the port the HTTP server uses
PORT=10000
```

The bot loads `DISCORD_TOKEN` via `dotenv` and uses it to login and register slash commands.

**Install & Run**
1. Install dependencies:

```bash
npm install
```

2. Start the bot:

```bash
npm start
# or: node bot.js
```

The bot registers the `/timer` slash command on startup and listens for interactions. The repository's `package.json` includes a `start` script that runs `bot.js`.

**Health checks & Web**
- The bot serves `index.html` at `/`.
- Health check endpoint: `GET /status` returns a simple 200 response when alive. This is useful for hosting providers to verify the process is running.

**Hosting Suggestion**
- For a free option, consider small free hosts (example suggestion: Pella). If you use a free host ensure it supports background Node processes and exposes a public URL for Discord's interactions.

**Security & Notes**
- Never commit your `.env` or bot token to version control. If your token is leaked, reset it in the Developer Portal immediately.
- If you update or add commands, the bot registers application commands on startup (global registration may take time to propagate).
