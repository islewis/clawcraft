async function place(bot, { x, y, z, block, walk = false }, signal) {
  const Vec3 = require('vec3')
  const helpers = require('./index')

  const existingBlock = helpers.getBlock(bot, { x, y, z })
  if (existingBlock) {
    // If block already exists and matches, treat as success
    if (existingBlock.name === block) {
      return true
    }
    // Different block exists, can't place
    return false
  }

  const item = bot.inventory.items().find(i => i.name === block)
  if (!item) {
    console.log(`${block} not found in inventory`)
    return false
  }

  try {
    const targetPos = new Vec3(x, y, z)
    const botPos = bot.entity.position
    const distance = botPos.distanceTo(new Vec3(x + 0.5, y + 0.5, z + 0.5))

    let botPosFloor = bot.entity.position.floor()
    if (botPosFloor.x === x && botPosFloor.y === y && botPosFloor.z === z) {
      const { goals } = require('mineflayer-pathfinder')
      const adjacent = [new Vec3(x+1, y, z), new Vec3(x-1, y, z), new Vec3(x, y, z+1), new Vec3(x, y, z-1)]
      let moved = false
      for (const pos of adjacent) {
        try {
          await bot.pathfinder.goto(new goals.GoalBlock(pos.x, pos.y, pos.z))
          moved = true
          break
        } catch (e) {}
      }
      if (!moved) {
        console.log(`Cannot move away from ${x}, ${y}, ${z}`)
        return false
      }
    } else if (distance > 5) {
      if (walk) {
        const { goals } = require('mineflayer-pathfinder')
        const adjacent = [new Vec3(x+1, y, z), new Vec3(x-1, y, z), new Vec3(x, y, z+1), new Vec3(x, y, z-1)]
        let reachable = false
        for (const adj of adjacent) {
          try {
            await bot.pathfinder.goto(new goals.GoalBlock(adj.x, adj.y, adj.z))
            reachable = true
            break
          } catch (e) {}
        }
        if (!reachable) {
          console.log(`Cannot reach ${x}, ${y}, ${z}`)
          return false
        }
      } else {
        console.log(`Block too far (${distance.toFixed(1)} blocks), use walk() first`)
        return false
      }
    }

    await bot.equip(item)

    // Find any adjacent solid block to place on
    const directions = [
      new Vec3(1, 0, 0), new Vec3(-1, 0, 0),
      new Vec3(0, 1, 0), new Vec3(0, -1, 0),
      new Vec3(0, 0, 1), new Vec3(0, 0, -1)
    ]

    let refBlock = null
    let direction = null

    for (const dir of directions) {
      const checkPos = targetPos.plus(dir)
      const block = bot.blockAt(checkPos)
      if (block && block.type !== 0) {
        refBlock = block
        direction = dir.scaled(-1)
        break
      }
    }

    if (!refBlock) {
      console.log(`No adjacent block to place on at ${x}, ${y}, ${z}`)
      return false
    }

    const blockCenter = refBlock.position.offset(0.5, 0.5, 0.5)
    await bot.lookAt(blockCenter)
    await bot.placeBlock(refBlock, direction)

    console.log(`Placed ${block} at ${x}, ${y}, ${z}`)
    return true
  } catch (e) {
    console.log(`Failed: ${e.message}`)
    return false
  }
}

async function placeBlocks(bot, { blocks }, signal) {
  let placed = 0
  console.log(`Placing ${blocks.length} blocks...`)

  for (const instruction of blocks) {
    if (signal?.aborted) {
      console.log(`\nInterrupted. Placed ${placed}/${blocks.length}`)
      return
    }

    const { x, y, z, block } = instruction
    if (!block) {
      console.log(`Invalid instruction at ${x}, ${y}, ${z}`)
      return false
    }

    const result = await place(bot, { x, y, z, block, walk: true }, signal)
    if (result) {
      placed++
    } else {
      // Check what went wrong
      const item = bot.inventory.items().find(i => i.name === instruction.block)
      if (!item) {
        console.log(`\n❌ Out of ${instruction.block}! Need ${blocks.length - placed} more blocks.`)
      }
      console.log(`Stopped at block ${placed + 1}/${blocks.length}`)
      return false
    }
  }

  console.log(`Done! Placed ${placed}/${blocks.length}`)
  return true
}

module.exports = { place, placeBlocks }
