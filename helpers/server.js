function status(bot, params) {
  const players = Object.keys(bot.players).length
  const difficulty = bot.game.difficulty
  const gamemode = bot.game.gamemode
  const hardcore = bot.game.hardcore
  const version = bot.version

  console.log(`Version: ${version}`)
  console.log(`Players: ${players}`)
  console.log(`Difficulty: ${difficulty} | Gamemode: ${gamemode} | Hardcore: ${hardcore}`)
}

module.exports = { status }
