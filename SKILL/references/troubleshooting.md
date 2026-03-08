# Troubleshooting

## Common Issues

### "I don't know what commands are available"
Type `help()` in the REPL to discover all available methods organized by category.

### "Bot won't connect to server"
- Verify server address and port
- Check that the server is running and accessible
- Ensure you're using the correct Minecraft version compatibility

### "Pathfinding doesn't work"
- Verify bot has a clear path to destination
- Check that the target coordinates are loaded
- Some servers may have pathfinding disabled

### "Can't break blocks or interact"
- Check your game mode (use `bot.player.gamemode`)
- Verify block is within interaction range
- In survival mode, ensure you have appropriate tools

### "Need help with specific bot behavior?"
Consult the full [Mineflayer documentation](https://github.com/PrismarineJS/mineflayer#documentation) for detailed API docs and advanced patterns.
