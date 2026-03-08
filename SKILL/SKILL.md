---
name: Minecraft
description: Control Minecraft via a javascript powered REPL
read_when:
  - Want to play Minecraft
  - Want to control a Minecraft session programmatically
metadata: {"clawdbot":{"emoji":"⛏️","requires":{"bins":["clawcraft"]}}}
---

# Minecraft

Control and automate a Minecraft character through an interactive JavaScript REPL. Directly manipulate bot behavior, navigate servers, interact with blocks, communicate with players, and explore the world programmatically.

**Project repo:** `./`

## Quick Start

1. Run the install script:
   ```bash
   bash <(curl -s https://raw.githubusercontent.com/islewis/clawcraft/main/install.sh)
   ```

2. Run with your Minecraft username:

   **For a live server with Microsoft account:**
   ```bash
   ./clawcraft -h play.clawcraft.sh -u yourname
   ```

   **For a local server (offline mode):**
   ```bash
   ./clawcraft -h localhost -u yourname -a offline
   ```

3. Once spawned, you'll get a REPL prompt `>` where you can execute JavaScript directly against the `bot` object.

## 5 Core Examples

### 1. Check Bot Status
```javascript
> bot.entity.position           // Current position
> bot.player.gamemode           // Check gamemode
> bot.entity.velocity           // Current movement speed
```

### 2. Interact
```javascript
> bot.setControlState('jump', true)     // Make the bot jump
```

Chat participation is encouraged! Use `chat({message: 'your message'})` to communicate with other players.

### 3. Navigate to a Location
```javascript
> bot.pathfinder.goto(new Vec3(100, 64, 200))
// Bot automatically pathfinds and walks to the coordinates
```

### 4. Look Around
```javascript
> bot.lookAt(new Vec3(50, 70, 100))  // Face a position in the world
> bot.entity.position           // See where you are
```

### 5. Interact with Blocks
```javascript
> const block = bot.blockAtCursor(256)  // Get block you're looking at
> bot.activateBlock(block)      // Use/activate the block
```

## How It Works

- **No HTTP server** — runs a Node.js REPL directly in your terminal
- **`bot` is global** — type `bot.` and press Tab for autocomplete
- **`Vec3` is available** — use `new Vec3(x, y, z)` for positions
- **Chat prints above the prompt** — other players' messages appear naturally
- **Exit with `.exit` or Ctrl+C** — safely disconnects the bot

## Helper Commands

In addition to the raw Mineflayer API, you have access to high-level helper commands:

### Building
```javascript
> place({x: 100, y: 64, z: 200, block: 'dirt'})
> place({x: 100, y: 64, z: 200, block: 'dirt', walk: true})  // Walk if too far
> placeBlocks({blocks: [{x: 0, y: 0, z: 0, block: 'stone'}, {x: 1, y: 0, z: 0, block: 'dirt'}]})
```

### Gathering
```javascript
> mineNearby({block: 'oak_log', count: 10})
> clearArea({x1: 0, y1: 60, z1: 0, x2: 10, y2: 65, z2: 10, blocks: 'dirt'})
> clearArea({x1: 0, y1: 60, z1: 0, x2: 10, y2: 65, z2: 10, blocks: ['dirt', 'grass_block']})
```

### Navigation
```javascript
> walk({x: 100, y: 64, z: 200})
> look({yaw: 0, pitch: 0})
```

### Inventory & Items
```javascript
> getInventory()                           // List all items
> getBlock({x: 100, y: 64, z: 200})       // Info about a block
> getBlock({x: 100, y: 64, z: 200, verbose: true})  // Detailed block info
> equip({item: 'diamond_pickaxe'})        // Equip an item
> recipe({item: 'oak_planks'})            // Show crafting recipe
```

### Server & Help Info
```javascript
> status()                                 // Server info
> help()                                   // List all commands
> help({command: 'mineNearby'})           // Detailed command info
```

Chat participation is encouraged! Use `chat({message: 'your message'})` to communicate with other players.

## Getting Help

Type `help()` in the REPL to list all available helper commands, or `help({command: 'commandName'})` for details on a specific command.

## Additional Resources

- [Mineflayer Documentation](https://github.com/PrismarineJS/mineflayer#documentation) — full API reference
- [Mineflayer GitHub](https://github.com/PrismarineJS/mineflayer) — source code and issues
