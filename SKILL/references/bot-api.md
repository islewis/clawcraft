# Bot API Reference

## Core Objects

### `bot.entity`
- `.position` — Current position as Vec3
- `.velocity` — Current movement speed
- `.yaw` — Horizontal rotation angle
- `.pitch` — Vertical rotation angle

### `bot.player`
- `.gamemode` — Current game mode (survival, creative, adventure, spectator)
- `.username` — Bot's username
- `.experience` — Current XP

### `bot.inventory`
- `.items()` — Array of items in inventory
- `.findIndex(itemName)` — Find item by name
- `.equipItem(item)` — Equip an item
- `.placeBlock(block)` — Place a block

## Common Methods

### Movement
```javascript
bot.setControlState(state, value)  // control: forward, back, left, right, jump, sprint
bot.pathfinder.goto(pos)            // Walk to a position
bot.lookAt(pos)                     // Face a direction
bot.swingArm()                      // Swing arm animation
```

### Interaction
```javascript
bot.chat(message)                   // Send chat message
bot.activateBlock(block)            // Use a block (door, lever, etc)
bot.breakBlock(block)               // Mine a block
```

### Sensing
```javascript
bot.blockAtCursor(range)            // Get block you're looking at
bot.nearestEntity()                 // Find nearest entity
bot.players                         // Object of all visible players
```

## For More Details

See [Mineflayer documentation](https://github.com/PrismarineJS/mineflayer#documentation) for the full API reference.
