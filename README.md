# Clawcraft

A Minecraft bot interface designed to be controlled by LLMs and OpenClaw. Built with [Mineflayer](https://github.com/PrismarineJS/mineflayer), Clawcraft connects to any Minecraft server and exposes a simple JavaScript API for automation, exploration, and task execution. The goal is to enable LLMs and AI agents to learn and play Minecraft autonomously.

## Installation

### Easy Install (Recommended)

One command to download and install:

```bash
bash <(curl -s https://raw.githubusercontent.com/islewis/clawcraft/main/install.sh)
```

Then run with named arguments:

**Online server (Microsoft account):**
```bash
./clawcraft -h play.clawcraft.sh -u yourUsername
```

**Local LAN server (offline mode):**
```bash
./clawcraft -h localhost -u botName -a offline
```

### From Source

Prerequisites: [Node.js](https://nodejs.org/) (v14+)

```bash
git clone https://github.com/islewis/clawcraft.git
cd clawcraft
npm install
npm start -h <host> -u <username> [-a <auth>]
```

**Online:** `npm start -h play.clawcraft.sh -u yourname`

**Local LAN:** `npm start -h localhost -u yourname -a offline`

### Authentication

By default, the bot uses Microsoft authentication. The first time you connect, it will open a browser to log in with your Microsoft account. Your auth token is cached in `.minecraft-auth/` so subsequent logins are instant.

Use `-a offline` for local servers with offline mode enabled (no Microsoft account needed).

## API Overview

Once the bot spawns, you get a JavaScript REPL with access to helper commands and the raw Mineflayer API.

### Core Commands

**Navigation**
- `walk({x, y, z})` - Pathfind to coordinates
- `look({yaw, pitch})` - Look in direction

**Building**
- `place({x, y, z, block, walk})` - Place block
- `placeBlocks({blocks})` - Place multiple blocks

**Gathering**
- `dig({x, y, z, useTools})` - Mine block
- `mineNearby({block, count, useTools})` - Mine nearby blocks
- `clearArea({x1, y1, z1, x2, y2, z2, blocks, useTools})` - Clear region

**Inventory & Info**
- `getInventory()` - List items
- `getBlock({x, y, z, verbose})` - Block info
- `equip({item})` - Equip item
- `recipe({item})` - Show crafting recipe

**Communication**
- `chat({message})` - Send chat message
- `status()` - Server info

**Help**
- `help()` - List all commands
- `help({command: 'place'})` - Command details

### Raw API

Full Mineflayer API available:
- `bot` - Mineflayer bot instance
- `Vec3` - Vector math
- `goals` - Pathfinding goals
- `Movements` - Movement config

## Examples

```javascript
// Navigate and build
walk({x: 100, y: 64, z: 200})
place({x: 100, y: 64, z: 200, block: 'oak_planks'})

// Gather resources
mineNearby({block: 'oak_log', count: 10})
clearArea({x1: 0, y1: 60, z1: 0, x2: 10, y2: 65, z2: 10, blocks: 'dirt'})

// Chat with other players
chat({message: 'Hello!'})

// Check server status
status()
```

## Resources

- [Mineflayer Documentation](https://github.com/PrismarineJS/mineflayer#documentation)
- [OpenClaw Integration](./SKILL/)
