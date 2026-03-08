async function place(bot, x, y, z, itemName, signal) {
  const Vec3 = require('vec3')
  const helpers = require('./index')

  // Check if block already exists
  const existingBlock = helpers.getBlock(bot, x, y, z)
  if (existingBlock) {
    return false
  }

  const item = bot.inventory.items().find(i => i.name === itemName)
  if (!item) {
    console.log(`${itemName} not found in inventory`)
    return false
  }

  try {
    const targetPos = new Vec3(x, y, z)
    const { goals } = require('mineflayer-pathfinder')

    // Check if bot is standing on target block and move away if so
    let botPos = bot.entity.position.floor()
    if (botPos.x === x && botPos.y === y && botPos.z === z) {
      console.log('Bot is on target block, moving away...')
      const adjacent = [new Vec3(x+1, y, z), new Vec3(x-1, y, z), new Vec3(x, y, z+1), new Vec3(x, y, z-1)]
      for (const pos of adjacent) {
        try {
          await bot.pathfinder.goto(new goals.GoalBlock(pos.x, pos.y, pos.z))
          break
        } catch (e) {}
      }
    }

    await bot.equip(item)
    console.log(`Equipped ${itemName}, attempting placement...`)
    const blockBelow = bot.blockAt(targetPos.offset(0, -1, 0))

    if (!blockBelow || blockBelow.type === 0) {
      console.log(`No solid block below target to place on`)
      return false
    }

    console.log(`Found block below: ${blockBelow.name}`)
    const blockCenter = blockBelow.position.offset(0.5, 0.5, 0.5)
    await bot.lookAt(blockCenter)

    console.log(`Calling placeBlock with direction (0, 1, 0)...`)
    await bot.placeBlock(blockBelow, new Vec3(0, 1, 0))

    console.log(`Placed ${itemName} at ${x}, ${y}, ${z}`)
    return true
  } catch (e) {
    console.log(`Failed: ${e.message}`)
    return false
  }
}

module.exports = { place }
