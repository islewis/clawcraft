const mineflayer = require('mineflayer')
const repl = require('repl')
const Vec3 = require('vec3')
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
const { Authflow } = require('prismarine-auth')
const helpers = require('./helpers')

const host = process.argv[2] || 'localhost'
const port = parseInt(process.argv[3]) || 43663
const username = process.argv[4] || 'Bot'
const auth = process.argv[5] || 'offline'  // 'offline', 'microsoft', 'mojang'
const password = process.argv[6]  // Only needed for mojang auth

console.log('=== Bot Configuration ===')
console.log(`Host: ${host}`)
console.log(`Port: ${port}`)
console.log(`Username: ${username}`)
console.log(`Auth: ${auth}`)
console.log('Connecting...\n')

const botOptions = {
  host,
  port,
  username,
  version: '1.21.11'
}

// Setup and create bot
;(async () => {
  // Add auth based on type
  if (auth === 'microsoft') {
    try {
      console.log('Using Microsoft authentication (prismarine-auth)')
      console.log('[AUTH] Getting Minecraft token...')
      const authflow = new Authflow(username, './.minecraft-auth')
      const { token } = await authflow.getMinecraftJavaToken({ fetchProfile: true })
      botOptions.auth = 'microsoft'
      botOptions.accessToken = token
      console.log('Tokens cached in .minecraft-auth/ for future logins')
    } catch (e) {
      console.error('[AUTH ERROR]', e.message)
      process.exit(1)
    }
  } else if (auth === 'mojang') {
    if (!password) {
      console.error('\n[ERROR] Mojang auth requires a password!')
      console.error('Usage: npm start <host> <port> <email> mojang <password>')
      process.exit(1)
    }
    botOptions.password = password
    console.log('Using Mojang authentication (legacy)')
  } else {
    console.log('Using offline mode (no authentication)')
  }

  const bot = mineflayer.createBot(botOptions)

bot.loadPlugin(pathfinder)

bot.on('login', () => {
  console.log('[LOGIN] Bot logged in successfully')
})

bot.on('spawn', () => {
  console.log('[SPAWN] Bot spawned in the world')

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
  console.error('[ERROR]', err.message || err)
})

bot.on('end', () => {
  console.log('[DISCONNECT] Bot disconnected')
  process.exit()
})

bot.on('kicked', (reason) => {
  console.log('[KICKED]', reason)
})
})() // Close async IIFE
