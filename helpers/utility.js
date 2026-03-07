function help(bot) {
  const output = ['', 'Mineflayer API Reference', '========================', '']
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
  const grouped = {}

  members.forEach(member => {
    const topLevel = member.name.split('.')[0]
    if (!grouped[topLevel]) grouped[topLevel] = []
    grouped[topLevel].push(member)
  })

  Object.keys(grouped).sort().forEach(group => {
    output.push(`${group}:`)
    grouped[group].forEach(m => {
      const suffix = m.type === 'function' ? '()' : ` [${m.type}]`
      output.push(`  ${m.name}${suffix}`)
    })
    output.push('')
  })

  console.log(output.join('\n'))
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

module.exports = { help, recipe }
