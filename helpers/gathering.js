function findAndEquipTool(bot, blockId) {
  const mcData = require('minecraft-data')(bot.version)
  const block = mcData.blocks[blockId]
  if (!block || !block.harvestTools) return

  for (const toolId of block.harvestTools) {
    const toolItem = bot.inventory.items().find(item => item.type === toolId)
    if (toolItem) {
      bot.equip(toolItem)
      return true
    }
  }
  return false
}

async function mineNearby(bot, { blockName, count = 5, useTools = true }, signal) {
  const mcData = require('minecraft-data')(bot.version)
  const { goals } = require('mineflayer-pathfinder')
  const blockId = mcData.blocksByName[blockName]?.id
  if (!blockId) {
    console.log(`Unknown block: ${blockName}`)
    return
  }

  const getItemCount = (name) => {
    return bot.inventory.items().filter(item => item.name === blockName).reduce((sum, item) => sum + item.count, 0)
  }

  const initialCount = getItemCount(blockName)
  let mined = 0
  let collected = 0

  while (mined < count) {
    if (signal?.aborted) {
      const finalCount = getItemCount(blockName)
      const collectedNow = finalCount - initialCount
      console.log(`\nInterrupted. Broken ${mined}/${count} | Collected ${collectedNow}`)
      return
    }

    const block = bot.findBlock({ matching: blockId, maxDistance: 64 })
    if (!block) {
      console.log(`No more ${blockName} found nearby`)
      break
    }

    try {
      await bot.pathfinder.goto(new goals.GoalBlock(block.position.x, block.position.y, block.position.z))

      const blockQueue = [block]
      const visited = new Set([`${block.position}`])

      while (blockQueue.length > 0 && mined < count) {
        if (signal?.aborted) {
          const finalCount = getItemCount(blockName)
          const collectedNow = finalCount - initialCount
          console.log(`\nInterrupted. Broken ${mined}/${count} | Collected ${collectedNow}`)
          return
        }

        const currentBlock = blockQueue.shift()
        if (!currentBlock) break

        try {
          if (useTools) findAndEquipTool(bot, blockId)
          await bot.dig(currentBlock)
          mined++

          await new Promise(resolve => setTimeout(resolve, 100))

          const currentCollected = getItemCount(blockName) - initialCount
          console.log(`Broken ${mined}/${count} | Collected ${currentCollected}`)

          const adjacent = [
            currentBlock.position.offset(1, 0, 0),
            currentBlock.position.offset(-1, 0, 0),
            currentBlock.position.offset(0, 1, 0),
            currentBlock.position.offset(0, -1, 0),
            currentBlock.position.offset(0, 0, 1),
            currentBlock.position.offset(0, 0, -1)
          ]

          for (const pos of adjacent) {
            const key = `${pos}`
            if (!visited.has(key)) {
              visited.add(key)
              const adj = bot.blockAt(pos)
              if (adj && adj.type === blockId && mined < count) {
                blockQueue.push(adj)
              }
            }
          }
        } catch (e) {}
      }
    } catch (e) {
      console.log(`Failed to reach block: ${e.message}`)
      break
    }
  }
  const finalCount = getItemCount(blockName)
  const totalCollected = finalCount - initialCount
  console.log(`Done! Broken ${mined} | Collected ${totalCollected}`)
}

async function clearArea(bot, { x1, y1, z1, x2, y2, z2, blockNames, useTools = true, quiet = false }, signal) {
  const mcData = require('minecraft-data')(bot.version)
  const { goals } = require('mineflayer-pathfinder')
  const Vec3 = require('vec3')

  if (typeof blockNames === 'string') {
    blockNames = [blockNames]
  }

  const blockIds = blockNames
    .map(name => mcData.blocksByName[name]?.id)
    .filter(id => id !== undefined)

  if (blockIds.length === 0) {
    console.log(`Unknown blocks: ${blockNames.join(', ')}`)
    return
  }

  const minX = Math.min(x1, x2)
  const maxX = Math.max(x1, x2)
  const minY = Math.min(y1, y2)
  const maxY = Math.max(y1, y2)
  const minZ = Math.min(z1, z2)
  const maxZ = Math.max(z1, z2)

  let broken = 0
  let collected = 0
  const initialInventory = bot.inventory.items().length

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      for (let z = minZ; z <= maxZ; z++) {
        if (signal?.aborted) {
          console.log(`\nInterrupted. Broken ${broken} | Collected ${collected}`)
          return
        }

        const block = bot.blockAt(new Vec3(x, y, z))
        if (!block || !blockIds.includes(block.type)) continue

        try {
          if (signal?.aborted) {
            console.log(`\nInterrupted. Broken ${broken} | Collected ${collected}`)
            return
          }
          const pathPromise = bot.pathfinder.goto(new goals.GoalBlock(x, y, z))
          await pathPromise
          if (signal?.aborted) {
            console.log(`\nInterrupted. Broken ${broken} | Collected ${collected}`)
            return
          }
          if (useTools) findAndEquipTool(bot, block.type)
          const digPromise = bot.dig(block)
          await digPromise
          if (signal?.aborted) {
            console.log(`\nInterrupted. Broken ${broken} | Collected ${collected}`)
            return
          }
          broken++
          await new Promise(resolve => setTimeout(resolve, 50))
          const currentInventory = bot.inventory.items().length
          collected = currentInventory - initialInventory
          if (!quiet) console.log(`Broken ${broken} | Collected ${collected}`)
        } catch (e) {}
      }
    }
  }

  const finalInventory = bot.inventory.items().length
  collected = finalInventory - initialInventory
  console.log(`Done! Broken ${broken} | Collected ${collected}`)
}

module.exports = { mineNearby, clearArea }
