const mineflayer = require('mineflayer')
const repl = require('repl')
const Vec3 = require('vec3')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const helpers = require('./helpers')

const host = process.argv[2] || 'localhost'
const port = parseInt(process.argv[3]) || 43663
const username = process.argv[4] || 'Bot'

const bot = mineflayer.createBot({
  host,
  port,
  username,
  version: '1.21.11'
})

bot.loadPlugin(pathfinder)

bot.on('login', () => {
  console.log('Bot logged in')
})

bot.on('spawn', () => {
  console.log('Bot spawned in the world')

  // Set up pathfinder movements
  const mcData = require('minecraft-data')(bot.version)
  const defaultMove = new Movements(bot, mcData)
  bot.pathfinder.setMovements(defaultMove)

  const r = repl.start({
    prompt: '> ',
    useColors: true,
    completer: (line) => {
      const helperKeys = Object.keys(helpers)
      const contextKeys = Object.keys(r.context || {})
      const allSuggestions = [...helperKeys, ...contextKeys, 'bot', 'Vec3', 'goals', 'Movements']

      const lastWord = line.split(/[\s.()[\]{}]/g).pop()
      if (!lastWord) return [[], line]

      const matches = allSuggestions.filter(s => s.startsWith(lastWord))
      return [matches.length ? matches : [], line]
    }
  })

  r.context.bot = bot
  r.context.Vec3 = Vec3
  r.context.goals = goals
  r.context.Movements = Movements

  // Global stop flag for interrupting operations
  let stopFlag = false

  // Stop command
  r.context.stop = () => {
    stopFlag = true
    console.log('Stop requested')
  }

  // Wrapper to add stop support to all helper functions
  const wrapWithStop = (fn) => {
    return (...args) => {
      stopFlag = false
      const wrappedSignal = {
        get aborted() {
          return stopFlag
        }
      }
      return fn(bot, ...args, wrappedSignal)
    }
  }

  // Add helpers to context with interrupt support
  Object.entries(helpers).forEach(([name, fn]) => {
    r.context[name] = wrapWithStop(fn)
  })

  // Handle Ctrl+C interrupts gracefully at process level
  process.on('SIGINT', () => {
    if (currentAbortController && !currentAbortController.signal.aborted) {
      currentAbortController.abort()
      currentAbortController = null
    } else {
      // Exit if no operation is running
      process.exit(0)
    }
  })


  r.on('exit', () => {
    bot.quit()
    process.exit()
  })
})

bot.on('chat', (username, message) => {
  console.log(`${username}: ${message}`)
})

bot.on('error', (err) => {
  console.error('Error:', err)
})

bot.on('end', () => {
  console.log('Bot disconnected')
  process.exit()
})
