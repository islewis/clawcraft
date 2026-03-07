# Clawcraft - Minecraft Bot

A Minecraft bot built with [Mineflayer](https://github.com/PrismarineJS/mineflayer) for automating tasks and exploring Minecraft servers.

## Installation

### Option 1: Standalone Executable (Recommended)

Download the latest release for your operating system from [Releases](https://github.com/islewis/clawcraft/releases):
- **Windows**: `clawcraft.exe`
- **macOS (Intel)**: `clawcraft-macos`
- **macOS (Apple Silicon)**: `clawcraft-macos-arm64`
- **Linux**: `clawcraft-linux`

No Node.js installation required.

### Option 2: From Source

#### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

#### Setup

1. Clone the repository:
```bash
git clone https://github.com/islewis/clawcraft.git
cd clawcraft
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Standalone Executable

```bash
./clawcraft <host> <port> <username> <auth> [password]
```

Example connecting to local server:
```bash
./clawcraft localhost 25565 MyBot offline
```

Example with Microsoft authentication:
```bash
./clawcraft example.com 25565 MyBot microsoft
```

### From Source

Connect to local server:
```bash
npm start localhost 25565 MyBot offline
```

Or with custom server settings:
```bash
npm start <host> <port> <username> <auth> [password]
```

## Commands

Once the bot spawns, you'll be in an interactive REPL with access to these commands:

### Server
- `status()` - Show server info (version, player count, difficulty, gamemode)

### Utility
- `help()` - Display Mineflayer API reference
- `recipe(itemName)` - Show crafting recipes for an item
- `stop()` - Stop the current operation

### Gathering
- `mineNearby(blockName, count, useTools)` - Mine nearby blocks
- `findAndEquipTool(blockId)` - Find and equip the right tool from inventory
- `clearArea(x1, y1, z1, x2, y2, z2, blockNames, useTools)` - Clear a rectangular area

### Direct API
You also have access to:
- `bot` - Mineflayer bot instance
- `Vec3` - Vector3 math utilities
- `goals` - Pathfinding goals
- `Movements` - Movement configuration

## Authentication

The bot supports three authentication modes:
- **offline** - No authentication (default)
- **microsoft** - Microsoft/Xbox Live account (tokens cached in `.minecraft-auth/`)
- **mojang** - Legacy Mojang account (requires password)
