module.exports = {
  status: {
    description: 'Print server/game info (version, players, difficulty, gamemode)',
    params: [],
    examples: ['status()']
  },
  help: {
    description: 'Show all commands, or detailed info for one command. Use help({command:"api"}) to expose all lower-level Mineflayer API functionality',
    params: [
      { name: 'command', type: 'string', optional: true, description: 'Name of command to inspect' }
    ],
    examples: ['help()', "help({command:'mineNearby'})", "help({command:'api'})"]
  },
  recipe: {
    description: 'Show crafting recipe(s) for an item',
    params: [
      { name: 'item', type: 'string', optional: false, description: 'Minecraft item name (e.g. "oak_planks")' }
    ],
    examples: ["recipe({item:'oak_planks'})", "recipe({item:'stone_pickaxe'})"]
  },
  walk: {
    description: 'Pathfind to a location',
    params: [
      { name: 'x', type: 'number', optional: false, description: 'Target X coordinate' },
      { name: 'y', type: 'number', optional: false, description: 'Target Y coordinate' },
      { name: 'z', type: 'number', optional: false, description: 'Target Z coordinate' }
    ],
    examples: ["walk({x:100, y:64, z:200})", "walk({x:0, y:60, z:0})"]
  },
  look: {
    description: 'Look in a direction (rotate head)',
    params: [
      { name: 'yaw', type: 'number', optional: false, description: 'Yaw angle in radians' },
      { name: 'pitch', type: 'number', optional: false, description: 'Pitch angle in radians' }
    ],
    examples: ["look({yaw:0, pitch:0})", "look({yaw:Math.PI, pitch:-Math.PI/4})"]
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
      { name: 'verbose', type: 'boolean', optional: true, default: false, description: 'Show detailed block info' }
    ],
    examples: ['getBlock({x:100, y:64, z:200})', 'getBlock({x:0, y:60, z:0, verbose:true})']
  },
  equip: {
    description: 'Equip an item from inventory by name',
    params: [
      { name: 'item', type: 'string', optional: false, description: 'Item name to equip' }
    ],
    examples: ["equip({item:'diamond_pickaxe'})", "equip({item:'oak_planks'})"]
  },
  chat: {
    description: 'Send a chat message to the server',
    params: [
      { name: 'message', type: 'string', optional: false, description: 'Message to send' }
    ],
    examples: ["chat({message:'Hello!'})", "chat({message:'Looking for diamonds'})"]
  },
  dig: {
    description: 'Dig a block at specific coordinates',
    params: [
      { name: 'x', type: 'number', optional: false, description: 'Block X coordinate' },
      { name: 'y', type: 'number', optional: false, description: 'Block Y coordinate' },
      { name: 'z', type: 'number', optional: false, description: 'Block Z coordinate' },
      { name: 'useTools', type: 'boolean', optional: true, default: true, description: 'Auto-equip best tool' }
    ],
    examples: ['dig({x:100, y:64, z:200})', 'dig({x:0, y:60, z:0, useTools:false})']
  },
  place: {
    description: 'Place a block at specific coordinates',
    params: [
      { name: 'x', type: 'number', optional: false, description: 'Block X coordinate' },
      { name: 'y', type: 'number', optional: false, description: 'Block Y coordinate' },
      { name: 'z', type: 'number', optional: false, description: 'Block Z coordinate' },
      { name: 'block', type: 'string', optional: false, description: 'Item name to place' },
      { name: 'walk', type: 'boolean', optional: true, default: false, description: 'Pathfind if too far' }
    ],
    examples: ["place({x:100, y:64, z:200, block:'dirt'})", "place({x:0, y:60, z:0, block:'oak_planks', walk:true})"]
  },
  placeBlocks: {
    description: 'Place multiple blocks from a list of instructions',
    params: [
      { name: 'blocks', type: 'array', optional: false, description: 'Array of {x, y, z, block} objects' },
      { name: 'debug', type: 'boolean', optional: true, default: false, description: 'Show detailed placement info' }
    ],
    examples: ["placeBlocks({blocks:[{x:0,y:0,z:0,block:'stone'}, {x:1,y:0,z:0,block:'dirt'}]})", "placeBlocks({blocks:[...], debug:true})"]
  },
  mineNearby: {
    description: 'Mine nearby blocks of a given type, pathfinding to each one',
    params: [
      { name: 'block', type: 'string', optional: false, description: 'Block name (e.g. "oak_log")' },
      { name: 'count', type: 'number', optional: true, default: 5, description: 'Number of blocks to mine' },
      { name: 'useTools', type: 'boolean', optional: true, default: true, description: 'Auto-equip best tool' }
    ],
    examples: ["mineNearby({block:'oak_log'})", "mineNearby({block:'stone', count:20})", "mineNearby({block:'iron_ore', count:10, useTools:false})"]
  },
  clearArea: {
    description: 'Mine all matching blocks within a rectangular region',
    params: [
      { name: 'x1', type: 'number', optional: false, description: 'First corner X' },
      { name: 'y1', type: 'number', optional: false, description: 'First corner Y' },
      { name: 'z1', type: 'number', optional: false, description: 'First corner Z' },
      { name: 'x2', type: 'number', optional: false, description: 'Second corner X' },
      { name: 'y2', type: 'number', optional: false, description: 'Second corner Y' },
      { name: 'z2', type: 'number', optional: false, description: 'Second corner Z' },
      { name: 'blocks', type: 'string|string[]', optional: false, description: 'Block name or array of names to clear' },
      { name: 'useTools', type: 'boolean', optional: true, default: true, description: 'Auto-equip best tool' },
      { name: 'quiet', type: 'boolean', optional: true, default: false, description: 'Suppress progress logs' }
    ],
    examples: [
      "clearArea({x1:0, y1:60, z1:0, x2:10, y2:65, z2:10, blocks:'dirt'})",
      "clearArea({x1:0, y1:60, z1:0, x2:10, y2:65, z2:10, blocks:['dirt','grass_block'], useTools:true, quiet:false})"
    ]
  }
}
