# 🚀 NodeFlow Quick Start Guide

## 1. Start the Server

```bash
cd nodeflow
npm start
```

You should see output like:
```
[2026-08-16T13:51:42.567Z] INFO: NodeFlow server running on port 3000
[2026-08-16T13:51:42.567Z] INFO: Visit http://localhost:3000 to play
[2026-08-16T13:51:42.568Z] INFO: All systems initialized
```

## 2. Open the Game

Open your browser and navigate to: **http://localhost:3000**

You should see:
- Game canvas in the center
- Sidebar with controls on the right
- Stats panel showing score, level, vehicles, etc.

## 3. Play the Game

### Basic Controls
- **Spawn Car**: Click "Spawn Car" button to add a vehicle
- **Spawn Truck**: Click "Spawn Truck" for a larger vehicle
- **Place Traffic Light**: Click "Traffic Light", then click on the canvas
- **Chat**: Type in the chat box and press Enter
- **Pause**: Click "Pause" to pause the game

### What to Do
1. Spawn 3-5 vehicles
2. Place traffic lights to manage traffic
3. Watch the vehicles move around the canvas
4. Monitor your score in the stats panel
5. Try to prevent accidents

## 4. Run Scripts

### Create a Script
1. Create a file named `myScript.txt`:
```
chat "Starting automation"
delay 1000
afkOn
loop 3 {
    chat "Script is running..."
    delay 2000
}
```

### Upload & Run
```bash
# Upload the script
curl -X POST http://localhost:3000/api/script/upload \
  -H "Content-Type: application/json" \
  -d '{"scriptName": "myScript", "scriptContent": "chat \"Hello\"\ndelay 1000\nafkOn"}'

# Run the script
curl -X POST http://localhost:3000/api/script/run \
  -H "Content-Type: application/json" \
  -d '{"scriptName": "myScript"}'
```

## 5. Check API Status

```bash
# Health check
curl http://localhost:3000/health

# Game state
curl http://localhost:3000/api/game/state

# Server status
curl http://localhost:3000/api/status
```

## 6. Load Accounts & Proxies

### Create Accounts File
Create `accounts/accounts.txt`:
```
Player1
Player2
Player3
```

Load it:
```bash
curl -X POST http://localhost:3000/api/accounts/load \
  -H "Content-Type: application/json" \
  -d '{"filePath": "accounts/accounts.txt"}'
```

### Create Proxies File
Create `proxies/proxies.txt`:
```
192.168.1.1:8080
10.0.0.1:9090
```

Load it:
```bash
curl -X POST http://localhost:3000/api/proxies/load \
  -H "Content-Type: application/json" \
  -d '{"filePath": "proxies/proxies.txt"}'
```

## 7. Available Commands

### Chat
```
chat "Your message here"
```

### Movement
```
startMove forward    # Start moving forward
stopMove forward     # Stop moving
startMove left
startMove right
startMove backward
```

### Tools
```
setHotbar 0         # Switch to tool slot 0
useHeld             # Use current tool
winClick 24 0       # Click UI element (24 = slot, 0 = left click)
```

### Anti-AFK
```
afkOn               # Enable Anti-AFK
afkOff              # Disable Anti-AFK
```

### Connection
```
disconnect          # Disconnect vehicle
reconnect           # Reconnect vehicle
```

### Control Flow
```
delay 1000          # Wait 1000ms
loop 5 {
    chat "Hello"
    delay 500
}                   # Repeat 5 times
```

## 8. Script Variables

```
{player}    # Current player name
{random}    # Random string (e.g., for unique names)
```

Example:
```
chat "My name is {player}"
setHotbar {random}   # Not recommended, for demonstration
```

## 9. Multiplayer

1. Open the game URL in multiple browser windows
2. Each window is a different player
3. All players share the same game world
4. Send chat messages to communicate

## 10. Configuration

Edit `src/utils/config.js` to change:
- `maxVehicles`: Maximum vehicles allowed (default: 200)
- `autoSaveInterval`: How often to save (default: 30000ms)
- `simulationTickRate`: Game update frequency (default: 60 FPS)

## Troubleshooting

### Port 3000 Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Server Won't Start
```bash
# Check for errors
node -c src/app.js

# Run with debug output
DEBUG=* npm start
```

### Vehicles Not Showing
1. Check browser console (F12)
2. Verify game state: `curl http://localhost:3000/api/game/state`
3. Refresh the page

### Can't Connect to Server
1. Ensure server is running: Check terminal
2. Verify URL is correct: `http://localhost:3000`
3. Check firewall settings
4. Try `http://127.0.0.1:3000`

## Tips & Tricks

1. **Multiple Vehicles**: Spawn at least 3-5 vehicles to see traffic dynamics
2. **Traffic Lights**: Place them at intersections to manage flow
3. **Scripts**: Automate repetitive tasks with scripts
4. **Proxies**: Load proxies to distribute requests
5. **Anti-AFK**: Enable for idle vehicles to keep them moving
6. **Auto-Save**: Check `data/saves/latest.json` for latest save

## Next Steps

- Explore the full API documentation in README.md
- Create more complex scripts
- Try multiplayer with friends
- Load custom themes
- Configure webhooks for notifications

## Support

For detailed information, see:
- `README.md` - Full documentation
- `plan.txt` - Project requirements
- `logs/nodeflow.log` - Server logs
- Browser console (F12) - Client-side errors

---

**Happy gaming! 🎮**
