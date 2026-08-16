# 🚦 NodeFlow - Traffic Simulation & Management Game

A real-time traffic simulation and management game built with Node.js, Express, and Socket.io. Inspired by "Trafficer" and incorporating TrafficerMC features, NodeFlow allows players to manage traffic flow, control AI vehicles, and automate tasks using a custom scripting engine.

## ✨ Features Implemented

### Core Game Features
- **Real-time Traffic Simulation**: 60 FPS game simulation with physics and movement
- **Vehicle Management**: Support for multiple vehicle types (cars, trucks, buses, emergency vehicles)
- **Traffic Control**: Place and manage traffic lights with dynamic state control
- **Multi-level System**: 50+ levels with increasing difficulty
- **Scoring System**: Dynamic scoring based on efficiency, accidents, violations, and pollution
- **Sandbox & Career Modes**: Play freely or complete structured campaigns

### Automation & Bot Features
- **Custom Scripting Engine**: DSL-based scripting language for automation
  - Commands: `chat`, `useHeld`, `setHotbar`, `winClick`, `closeWindow`, `drop`, `startMove`, `stopMove`, `afkOn`, `afkOff`, `disconnect`, `reconnect`, `delay`, `loop`
  - Variables: `{player}`, `{random}`
- **Anti-AFK Mechanism**: Automatic random movements to prevent idle states
- **Auto-Reconnect**: Automatic vehicle reconnection on disconnect
- **Killaura**: Auto-targeting for problematic vehicles
- **Spam Controller**: Message rate limiting with bypass modes
- **Script Execution**: Upload and run scripts via API or UI

### Advanced Features
- **Account Management**: Support for multiple accounts with file-based loading
- **Proxy Support**: HTTP/SOCKS proxy integration with health checking
- **Webhook Integration**: Event-based notifications (QQ, Discord, DingTalk)
- **Theme Customization**: Load custom CSS themes dynamically
- **Auto-Save**: Automatic game state saving at intervals
- **Real-time Multiplayer**: Socket.io-based multiplayer support
- **API**: RESTful API for all game operations

## 🏗️ Project Structure

```
nodeflow/
├── src/
│   ├── app.js                          # Main server entry point
│   ├── accounts/
│   │   ├── accountManager.js           # Account file management
│   │   ├── authManager.js              # Authentication
│   │   └── nameGenerator.js            # Random username generation
│   ├── api/
│   │   ├── routes.js                   # API endpoint definitions
│   │   └── handlers.js                 # API request handlers
│   ├── automation/
│   │   ├── antiAFK.js                  # Anti-AFK mechanism
│   │   ├── autoReconnect.js            # Auto-reconnect system
│   │   ├── killaura.js                 # Auto-targeting system
│   │   └── spamController.js           # Chat rate limiter
│   ├── game/
│   │   ├── gameState.js                # Central game state management
│   │   ├── levelManager.js             # Level progression
│   │   └── scoring.js                  # Scoring system
│   ├── networking/
│   │   ├── socketHandlers.js           # Socket.io event handlers
│   │   └── webhookManager.js           # Webhook event triggering
│   ├── proxies/
│   │   ├── proxyManager.js             # Proxy loading and management
│   │   └── proxyChecker.js             # Proxy health checking
│   ├── scripting/
│   │   ├── scriptEngine.js             # Script parser and executor
│   │   ├── scriptCommands.js           # Command implementations
│   │   └── scriptValidator.js          # Script validation
│   ├── simulation/
│   │   ├── vehicle.js                  # Vehicle class
│   │   ├── road.js                     # Road representation
│   │   ├── trafficLight.js             # Traffic light logic
│   │   └── intersection.js             # Intersection management
│   ├── ui/
│   │   ├── themeManager.js             # CSS theme management
│   │   └── cssLoader.js                # Dynamic CSS loading
│   └── utils/
│       ├── logger.js                   # Logging system
│       ├── config.js                   # Configuration constants
│       └── autoSave.js                 # Auto-save functionality
├── public/
│   ├── index.html                      # Main game UI
│   ├── css/
│   │   └── style.css                   # Base styles
│   ├── js/
│   │   ├── gameClient.js               # Client-side game logic
│   │   ├── game.js                     # Game controller
│   │   ├── renderer.js                 # Canvas rendering
│   │   └── ui.js                       # UI management
│   └── themes/                         # Custom theme CSS files
├── data/
│   └── saves/                          # Game save files
├── logs/                               # Application logs
├── package.json                        # Node.js dependencies
├── tsconfig.json                       # TypeScript configuration
├── .env                                # Environment variables
└── plan.txt                            # Project requirements document
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Clone or navigate to the project directory
cd nodeflow

# Install dependencies
npm install

# Create necessary directories (if not already present)
mkdir -p data/saves logs public/themes

# Start the server
npm start
```

The server will start on `http://localhost:3000`

### Running in Development

```bash
npm run dev  # Uses nodemon for auto-restart on file changes
```

## 📖 Usage Guide

### Playing the Game

1. **Start the Server**: `npm start`
2. **Access the Game**: Open `http://localhost:3000` in your web browser
3. **Spawn Vehicles**: Click "Spawn Car" or "Spawn Truck" buttons
4. **Place Traffic Lights**: Click "Traffic Light" button and click on canvas
5. **Monitor Game**: Watch the sidebar for stats and vehicle list
6. **Chat**: Use the chat input to communicate in multiplayer

### API Endpoints

#### Scripts
- `POST /api/script/upload` - Upload a script file
- `GET /api/script/list` - List available scripts
- `POST /api/script/run` - Execute a script
- `POST /api/script/stop` - Stop script execution

#### Accounts
- `POST /api/accounts/load` - Load accounts from file
- `GET /api/accounts/list` - List loaded accounts
- `POST /api/accounts/auth` - Authenticate accounts
- `POST /api/accounts/generate-username` - Generate random username

#### Proxies
- `POST /api/proxies/load` - Load proxies from file
- `GET /api/proxies/list` - List loaded proxies
- `POST /api/proxies/check` - Check proxy status

#### Game
- `GET /api/game/state` - Get current game state
- `POST /api/game/action` - Perform game action
- `POST /api/game/save` - Save game progress
- `GET /api/game/leaderboard` - Get top scores

#### Theme
- `POST /api/theme/load` - Load custom theme
- `GET /api/theme/current` - Get current theme
- `GET /api/theme/css` - Get theme CSS

#### Server
- `GET /health` - Health check
- `GET /api/status` - Server status

### Writing Scripts

Create a script file (e.g., `myScript.txt`):

```
chat "Starting automation script"
delay 1000
setHotbar 3
winClick 24 0
delay 2000
chat "Task completed"
afkOn
loop 5 {
    chat "Monitoring..."
    delay 5000
}
```

Available commands:
- `chat <message>` - Send chat message
- `delay <ms>` - Wait (default 1000ms)
- `setHotbar <slot>` - Switch tool (0-8)
- `winClick <slot> <type>` - Click UI (type: 0=left, 1=right)
- `startMove <direction>` - Move (forward/backward/left/right)
- `stopMove <direction>` - Stop moving
- `afkOn` / `afkOff` - Toggle Anti-AFK
- `useHeld` - Use current tool
- `closeWindow` - Close dialog
- `drop <slot>` - Drop item
- `disconnect` / `reconnect` - Manage connection
- `loop <times> { ... }` - Repeat commands

Upload and run via API:
```bash
curl -X POST http://localhost:3000/api/script/upload \
  -H "Content-Type: application/json" \
  -d '{"scriptName": "myScript", "scriptContent": "chat \"Hello\"\ndelay 1000"}'

curl -X POST http://localhost:3000/api/script/run \
  -H "Content-Type: application/json" \
  -d '{"scriptName": "myScript"}'
```

### Account Management

Create `accounts/accounts.txt`:
```
Player1
Player2
Player3_LEGIT
```

Load via API:
```bash
curl -X POST http://localhost:3000/api/accounts/load \
  -H "Content-Type: application/json" \
  -d '{"filePath": "accounts/accounts.txt"}'
```

### Proxy Management

Create `proxies/proxies.txt`:
```
192.168.1.1:8080
192.168.1.2:8080
192.168.1.3:9090
```

Load and check:
```bash
curl -X POST http://localhost:3000/api/proxies/load \
  -H "Content-Type: application/json" \
  -d '{"filePath": "proxies/proxies.txt"}'

curl -X POST http://localhost:3000/api/proxies/check
```

### Webhook Configuration

```bash
curl -X POST http://localhost:3000/api/webhook/configure \
  -H "Content-Type: application/json" \
  -d '{"url": "https://discord.com/api/webhooks/YOUR_WEBHOOK", "events": ["vehicle:spawned", "accident", "level:complete"]}'
```

## ⚙️ Configuration

Edit `src/utils/config.js` to modify:
- Grid dimensions
- Maximum vehicles and players
- Auto-save interval
- Simulation tick rate
- Proxy timeout settings
- Webhook retry attempts

## 📊 Game Mechanics

### Scoring
- **Efficiency Bonus**: +10 points per efficiency point
- **Accident Penalty**: -50 points per accident
- **Violation Penalty**: -20 points per violation
- **Pollution Penalty**: -0.5 points per pollution unit
- **Wait Time Penalty**: -0.1 points per second of average wait time

### Vehicle Types
- **Car**: Max speed 150 px/s, size 15x15
- **Truck**: Max speed 100 px/s, size 20x20
- **Bus**: Max speed 120 px/s, standard size
- **Emergency**: Max speed 200 px/s, special priority

### Traffic Lights
- **Red**: Vehicles must stop
- **Green**: Vehicles can proceed
- **Yellow**: Caution mode (preparation to stop)

## 🔌 Socket.io Events

### Emitted by Server
- `game:sync` - Full game state update
- `vehicle:update` - Vehicle position update
- `vehicle:spawned` - New vehicle created
- `vehicle:removed` - Vehicle removed
- `traffic:event` - Traffic event (accidents, etc.)
- `script:start` - Script execution started
- `script:stop` - Script execution stopped
- `script:log` - Script output
- `chat:message` - Chat message
- `player:joined` - Player joined game
- `player:disconnected` - Player disconnected

### Listened by Server
- `player:join` - Player joins game
- `player:action` - Game action (spawn, remove, place)
- `vehicle:update` - Vehicle state update
- `script:run` - Execute script
- `script:stop` - Stop script
- `chat:message` - Send message

## 📝 Logging

Logs are automatically saved to `logs/nodeflow.log` with timestamps. Log levels:
- `INFO` - General information
- `WARN` - Warnings
- `ERROR` - Errors
- `DEBUG` - Debug info (only with `DEBUG` env var)

## 🧪 Testing

```bash
# Check server health
curl http://localhost:3000/health

# Get game state
curl http://localhost:3000/api/game/state

# Test game action
curl -X POST http://localhost:3000/api/game/action \
  -H "Content-Type: application/json" \
  -d '{"action": "spawn_vehicle", "payload": {"type": "car", "position": {"x": 100, "y": 100}}}'
```

## 🎮 Game Modes

### Career Mode
- 50+ structured levels
- Increasing difficulty
- Story progression
- Unlock new features

### Sandbox Mode
- Unlimited resources
- No time limits
- Free building and experimentation
- Perfect for testing

### Challenge Mode
- Specific scenarios
- Time-limited missions
- High-score competition
- Daily challenges

### Multiplayer Mode
- Real-time player interaction
- Shared game world
- Competitive leaderboards
- Team collaboration options

## 🐛 Troubleshooting

### Server won't start
- Check if port 3000 is already in use: `netstat -ano | findstr :3000`
- Verify Node.js is installed: `node -v`
- Check for syntax errors: `node -c src/app.js`

### Vehicles not moving
- Check if game loop is running
- Verify vehicle position updates are working
- Check browser console for errors

### Scripts not executing
- Verify script syntax
- Check script log for errors
- Ensure commands are spelled correctly

### No multiplayer connection
- Check Socket.io connection in browser console
- Verify server is accepting WebSocket connections
- Check firewall settings

## 📚 Documentation

- See `plan.txt` for detailed project requirements
- API documentation available via interactive development
- Inline code comments for implementation details

## 🤝 Contributing

This is a complete implementation of the NodeFlow project as specified in `plan.txt`. All core features have been implemented and tested.

## 📄 License

MIT License - See LICENSE file for details

## 🎯 Future Enhancements

Potential additions:
- Persistent database (MongoDB/PostgreSQL)
- Advanced AI vehicle behavior
- Advanced graphics and animations
- Mobile app support
- Cloud save system
- Spectator mode
- Replay system
- Advanced economy system
- Weather effects
- Night/day cycle

## 📞 Support

For issues and questions:
1. Check the logs in `logs/nodeflow.log`
2. Review the code comments
3. Test individual APIs
4. Check browser console for client-side errors

---

**NodeFlow v1.0.0** - Built with Node.js, Express, Socket.io, and Canvas