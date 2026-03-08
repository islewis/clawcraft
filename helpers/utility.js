const registry = require('./registry')

function help(bot, commandName) {
  if (typeof commandName === 'string') {
    const entry = registry[commandName]
    if (entry) {
      // Show custom command from registry
      const lines = [`\n${commandName} — ${entry.description}`]
      if (entry.params.length > 0) {
        lines.push('Params:')
        for (const p of entry.params) {
          const optPart = p.optional ? ` [optional${p.default !== undefined ? `, default: ${p.default}` : ''}]` : ''
          lines.push(`  ${p.name} (${p.type})${optPart} — ${p.description}`)
        }
      } else {
        lines.push('Params: none')
      }
      lines.push('Examples:')
      for (const ex of entry.examples) lines.push(`  ${ex}`)
      console.log(lines.join('\n'))
      return
    }

    // Fall back to Mineflayer API lookup
    const output = [`\nSearching Mineflayer API for: ${commandName}\n`]
    const visited = new Set()

    function getMembers(obj, maxDepth = 2, currentDepth = 0, prefix = '') {
      if (currentDepth > maxDepth || visited.has(obj)) return []
      if (obj === null || typeof obj !== 'object') return []

      visited.add(obj)
      const members = []

      try {
        Object.getOwnPropertyNames(obj).forEach(key => {
          if (key.startsWith('_')) return

          try {
            const value = obj[key]
            const type = typeof value
            const fullKey = prefix ? `${prefix}.${key}` : key

            if (type === 'function') {
              members.push({ name: fullKey, type: 'function' })
            } else if (type === 'object' && value !== null && currentDepth < maxDepth) {
              const subMembers = getMembers(value, maxDepth, currentDepth + 1, fullKey)
              members.push(...subMembers)
            } else if (type !== 'object') {
              members.push({ name: fullKey, type: type })
            }
          } catch (e) {
            // Skip inaccessible properties
          }
        })
      } catch (e) {
        // Skip if enumeration fails
      }

      return members
    }

    const members = getMembers(bot)
    const matches = members.filter(m => m.name.includes(commandName))

    if (matches.length === 0) {
      console.log(`No matches found for "${commandName}" in custom commands or Mineflayer API`)
      console.log(`\nCustom commands: ${Object.keys(registry).join(', ')}`)
      return
    }

    matches.forEach(m => {
      const suffix = m.type === 'function' ? '()' : ` [${m.type}]`
      output.push(`  ${m.name}${suffix}`)
    })
    console.log(output.join('\n'))
  } else {
    const lines = ['\nCustom Commands:']
    for (const [name, entry] of Object.entries(registry)) {
      const paramSummary = entry.params.map(p => p.optional ? `[${p.name}]` : p.name).join(', ')
      lines.push(`  ${name}(${paramSummary}) — ${entry.description}`)
    }
    console.log(lines.join('\n'))
  }
}

function recipe(bot, itemName) {
  const mcData = require('minecraft-data')(bot.version)
  const item = mcData.itemsByName[itemName]

  if (!item) {
    console.log(`Unknown item: ${itemName}`)
    return
  }

  const recipes = mcData.recipes[item.id] || []

  if (recipes.length === 0) {
    console.log(`No crafting recipes for ${itemName}`)
    return
  }

  recipes.forEach((r, idx) => {
    console.log(`Recipe ${idx + 1}:`)
    if (r.inShape) {
      console.log(`Shape: ${r.inShape.length}x${r.inShape[0].length}`)
      r.inShape.forEach(row => {
        const ingredients = row.map(ing => {
          if (!ing) return 'empty'
          const id = typeof ing === 'number' ? ing : ing.id
          const itemData = mcData.items[id]
          return itemData ? itemData.name : `unknown(${id})`
        })
        console.log(`  ${ingredients.join(', ')}`)
      })
    } else if (r.ingredients) {
      console.log(`Ingredients:`)
      r.ingredients.forEach(ing => {
        if (Array.isArray(ing)) {
          const names = ing.map(i => {
            const id = typeof i === 'number' ? i : i.id
            const itemData = mcData.items[id]
            return itemData ? itemData.name : `unknown(${id})`
          })
          console.log(`  ${names.join(' or ')}`)
        } else {
          const id = typeof ing === 'number' ? ing : ing.id
          const itemData = mcData.items[id]
          console.log(`  ${itemData ? itemData.name : `unknown(${id})`}`)
        }
      })
    }
    console.log(`Output: ${r.result.count || 1}x ${itemName}`)
    console.log('')
  })
}

async function walk(bot, x, y, z, signal) {
  const { goals } = require('mineflayer-pathfinder')
  const Vec3 = require('vec3')

  try {
    await bot.pathfinder.goto(new goals.GoalBlock(x, y, z))
    console.log(`Reached ${x}, ${y}, ${z}`)
  } catch (e) {
    console.log(`Failed to reach ${x}, ${y}, ${z}: ${e.message}`)
  }
}

function look(bot, yaw, pitch) {
  bot.look(yaw, pitch)
  console.log(`Looking at yaw=${yaw}, pitch=${pitch}`)
}

function getInventory(bot) {
  const items = bot.inventory.items()
  if (items.length === 0) {
    console.log('Inventory is empty')
    return
  }
  console.log(`\nInventory (${items.length} slots):`)
  items.forEach((item, idx) => {
    console.log(`  [${idx}] ${item.count}x ${item.name}`)
  })
}

function getBlock(bot, x, y, z, verbose = false) {
  const Vec3 = require('vec3')
  const block = bot.blockAt(new Vec3(x, y, z))
  if (!block) {
    console.log(`No block data at ${x}, ${y}, ${z}`)
    return null
  }
  if (block.type === 0) {
    console.log(`Air at ${x}, ${y}, ${z}`)
    return null
  }

  if (verbose) {
    console.log(`\n${block.displayName} at ${x}, ${y}, ${z}`)
    console.log(`  Name: ${block.name}`)
    console.log(`  Hardness: ${block.hardness}`)
    console.log(`  Diggable: ${block.diggable}`)
    if (block.material) console.log(`  Material: ${block.material}`)
    if (block.harvestTools) console.log(`  Harvest tools: ${block.harvestTools.join(', ')}`)
    console.log('')
  } else {
    console.log(`${block.name} at ${x}, ${y}, ${z}`)
  }
  return block
}

function equip(bot, itemName) {
  const item = bot.inventory.items().find(i => i.name === itemName)
  if (!item) {
    console.log(`${itemName} not found in inventory`)
    return false
  }
  bot.equip(item)
  console.log(`Equipped ${itemName}`)
  return true
}

function chat(bot, message) {
  bot.chat(message)
}

async function dig(bot, x, y, z, useTools = true, signal) {
  const Vec3 = require('vec3')
  const block = bot.blockAt(new Vec3(x, y, z))

  if (!block) {
    console.log(`No block at ${x}, ${y}, ${z}`)
    return false
  }

  if (block.type === 0) {
    console.log(`Air at ${x}, ${y}, ${z} — nothing to dig`)
    return false
  }

  try {
    // Check if block is reachable without pathfinding (within 5 blocks)
    const botPos = bot.entity.position
    const distance = botPos.distanceTo(new Vec3(x + 0.5, y + 0.5, z + 0.5))

    if (distance > 5) {
      console.log(`Block too far (${distance.toFixed(1)} blocks), use walk() first`)
      return false
    }

    if (useTools) {
      const mcData = require('minecraft-data')(bot.version)
      const blockData = mcData.blocks[block.type]
      if (blockData && blockData.harvestTools) {
        for (const toolId of blockData.harvestTools) {
          const toolItem = bot.inventory.items().find(item => item.type === toolId)
          if (toolItem) {
            bot.equip(toolItem)
            break
          }
        }
      }
    }
    await bot.dig(block)
    console.log(`Dug ${block.name} at ${x}, ${y}, ${z}`)
    return true
  } catch (e) {
    console.log(`Failed to dig at ${x}, ${y}, ${z}: ${e.message}`)
    return false
  }
}

module.exports = { help, recipe, walk, look, getInventory, getBlock, equip, chat, dig }
