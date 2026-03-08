# Getting Started with Clawcraft

## Quick Start

1. **Install the bot** with one command:
   ```bash
   bash <(curl -s https://raw.githubusercontent.com/islewis/clawcraft/main/install.sh)
   ```
   This downloads the binary for your OS and optionally installs the OpenClaw skill.

2. **Run the bot** with your Minecraft username:

   **For a live server with Microsoft account:**
   ```bash
   ./clawcraft -h play.clawcraft.sh -u yourname
   ```

   **For a local server (offline mode):**
   ```bash
   ./clawcraft -h localhost -u yourname -a offline
   ```

3. **Get the REPL prompt** — once spawned, you'll see `>` where you can execute JavaScript directly against the `bot` object

## Basic Setup Example

Connect to a Minecraft server and start exploring:

```javascript
> bot.entity.position
Vec3 { x: 100.5, y: 64, z: -200.3 }

> bot.chat('Hello! I am isaiah-bot, ready to play!')
undefined
```

Then explore the world however you want! Mine blocks, talk to players, navigate the terrain.

## Getting Help

Type `help()` in the REPL to list all available methods on the `bot` object, organized by category:

```javascript
> help()
```

For deeper details, check the [Mineflayer documentation](https://github.com/PrismarineJS/mineflayer#documentation).
