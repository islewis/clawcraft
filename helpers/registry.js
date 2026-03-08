module.exports = {
  status: {
    description: 'Print server/game info (version, players, difficulty, gamemode)',
    params: [],
    examples: ['status()']
  },
  help: {
    description: 'Show all commands, or detailed info for one command. Use help("api") to expose all lower-level Mineflayer API functionality',
    params: [
      { name: 'commandName', type: 'string', optional: true, description: 'Name of command to inspect' }
    ],
    examples: ['help()', "help('mineNearby')", "help('api')"]
  },
  recipe: {
    description: 'Show crafting recipe(s) for an item',
    params: [
      { name: 'itemName', type: 'string', optional: false, description: 'Minecraft item name (e.g. "oak_planks")' }
    ],
    examples: ["recipe('oak_planks')", "recipe('stone_pickaxe')"]
  },
  walk: {
    description: 'Pathfind to a location',
    params: [
      { name: 'x', type: 'number', optional: false, description: 'Target X coordinate' },
      { name: 'y', type: 'number', optional: false, description: 'Target Y coordinate' },
      { name: 'z', type: 'number', optional: false, description: 'Target Z coordinate' }
    ],
    examples: ["walk(100, 64, 200)", "walk(0, 60, 0)"]
  },
  look: {
    description: 'Look in a direction (rotate head)',
    params: [
      { name: 'yaw', type: 'number', optional: false, description: 'Yaw angle in radians' },
      { name: 'pitch', type: 'number', optional: false, description: 'Pitch angle in radians' }
    ],
    examples: ["look(0, 0)", "look(Math.PI, -Math.PI/4)"]
  },
  getInventory: {
    description: 'List all items in inventory',
    params: [],
    examples: ['getInventory()']
  },
  getBlock: {
    description: 'Get the block at specific coordinates',
    params: [
      { name: 'x', type: 'number', optional: false, description: 'Block X coordinate' },
      { name: 'y', type: 'number', optional: false, description: 'Block Y coordinate' },
      { name: 'z', type: 'number', optional: false, description: 'Block Z coordinate' },
      { name: 'verbose', type: 'boolean', optional: true, default: false, description: 'Show detailed block info (hardness, diggable, harvest tools)' }
    ],
    examples: ['getBlock(100, 64, 200)', 'getBlock(0, 60, 0, true)']
  },
  equip: {
    description: 'Equip an item from inventory by name',
    params: [
      { name: 'itemName', type: 'string', optional: false, description: 'Item name to equip' }
    ],
    examples: ["equip('diamond_pickaxe')", "equip('oak_planks')"]
  },
  chat: {
    description: 'Send a chat message to the server',
    params: [
      { name: 'message', type: 'string', optional: false, description: 'Message to send' }
    ],
    examples: ["chat('Hello!')", "chat('Looking for diamonds')"]
  },
  dig: {
    description: 'Dig a block at specific coordinates',
    params: [
      { name: 'x', type: 'number', optional: false, description: 'Block X coordinate' },
      { name: 'y', type: 'number', optional: false, description: 'Block Y coordinate' },
      { name: 'z', type: 'number', optional: false, description: 'Block Z coordinate' },
      { name: 'useTools', type: 'boolean', optional: true, default: true, description: 'Auto-equip best tool before digging' }
    ],
    examples: ["dig(100, 64, 200)", "dig(0, 60, 0, false)"]
  },
  place: {
    description: 'Place a block at specific coordinates',
    params: [
      { name: 'x', type: 'number', optional: false, description: 'Block X coordinate' },
      { name: 'y', type: 'number', optional: false, description: 'Block Y coordinate' },
      { name: 'z', type: 'number', optional: false, description: 'Block Z coordinate' },
      { name: 'itemName', type: 'string', optional: false, description: 'Item name to place (must be in inventory)' }
    ],
    examples: ["place(100, 64, 200, 'dirt')", "place(0, 60, 0, 'oak_planks')"]
  },
  mineNearby: {
    description: 'Mine nearby blocks of a given type, pathfinding to each one',
    params: [
      { name: 'blockName', type: 'string',  optional: false,                description: 'Block name (e.g. "oak_log")' },
      { name: 'count',     type: 'number',  optional: true,  default: 5,    description: 'Number of blocks to mine' },
      { name: 'useTools',  type: 'boolean', optional: true,  default: true, description: 'Auto-equip best tool before digging' }
    ],
    examples: ["mineNearby('oak_log')", "mineNearby('stone', 20)", "mineNearby('iron_ore', 10, false)"]
  },
  clearArea: {
    description: 'Mine all matching blocks within a rectangular region',
    params: [
      { name: 'x1',         type: 'number',          optional: false, description: 'First corner X' },
      { name: 'y1',         type: 'number',          optional: false, description: 'First corner Y' },
      { name: 'z1',         type: 'number',          optional: false, description: 'First corner Z' },
      { name: 'x2',         type: 'number',          optional: false, description: 'Second corner X' },
      { name: 'y2',         type: 'number',          optional: false, description: 'Second corner Y' },
      { name: 'z2',         type: 'number',          optional: false, description: 'Second corner Z' },
      { name: 'blockNames', type: 'string|string[]', optional: false, description: 'Block name or array of names to clear' },
      { name: 'useTools',   type: 'boolean',         optional: true,  default: true, description: 'Auto-equip best tool before digging' },
      { name: 'quiet',      type: 'boolean',         optional: true,  default: false, description: 'Suppress progress logs' }
    ],
    examples: [
      "clearArea(0,60,0, 10,65,10, 'dirt')",
      "clearArea(0,60,0, 10,65,10, ['dirt','grass_block'], true, false)"
    ]
  }
}
