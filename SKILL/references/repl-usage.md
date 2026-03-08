# REPL Usage Guide

## How It Works

- Type JavaScript directly at the `>` prompt
- `bot` is global — use `bot.` for the Mineflayer API
- Press Tab for autocomplete on `bot.` properties
- Type `.exit` or Ctrl+C to disconnect
- Chat from other players prints above the prompt
- Use `help()` to list available commands

## Basic Syntax

```javascript
> bot.entity.position           // Get current position
> chat({message: 'Hello!'})     // Send chat message
> walk({x: 100, y: 64, z: 200}) // Walk to coordinates
> help()                         // List all commands
> help({command: 'place'})      // Get command details
```
