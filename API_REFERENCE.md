# 📡 NodeFlow API Reference

## Base URL
```
http://localhost:3000
```

## Health & Status

### Health Check
```
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-08-16T13:52:02.780Z"
}
```

### Server Status
```
GET /api/status
```

**Response (200):**
```json
{
  "success": true,
  "status": "online",
  "timestamp": "2026-08-16T13:52:02.780Z",
  "version": "1.0.0",
  "vehicleCount": 5,
  "playerCount": 2
}
```

---

## Scripts

### Upload Script
```
POST /api/script/upload
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "scriptName": "myScript",
  "scriptContent": "chat \"Hello\"\ndelay 1000\nafkOn"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Script uploaded",
  "scriptName": "myScript"
}
```

### List Scripts
```
GET /api/script/list
```

**Response (200):**
```json
{
  "success": true,
  "scripts": ["myScript.txt", "autoMove.txt"],
  "count": 2
}
```

### Run Script
```
POST /api/script/run
```

**Body (option 1 - by name):**
```json
{
  "scriptName": "myScript"
}
```

**Body (option 2 - inline):**
```json
{
  "scriptContent": "chat \"Direct execution\"\ndelay 1000"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Script executed"
}
```

### Stop Script
```
POST /api/script/stop
```

**Response (200):**
```json
{
  "success": true,
  "message": "Script stopped"
}
```

---

## Accounts

### Load Accounts
```
POST /api/accounts/load
```

**Body:**
```json
{
  "filePath": "accounts/accounts.txt"
}
```

**Response (200):**
```json
{
  "success": true,
  "accounts": ["Player1", "Player2", "Player3"],
  "count": 3
}
```

### List Accounts
```
GET /api/accounts/list
```

**Response (200):**
```json
{
  "success": true,
  "accounts": ["Player1", "Player2", "Player3"],
  "count": 3
}
```

### Authenticate Accounts
```
POST /api/accounts/auth
```

**Body:**
```json
{
  "accounts": ["Player1", "Player2"]
}
```

**Response (200):**
```json
{
  "success": true,
  "results": [
    {
      "account": "Player1",
      "status": "authenticated",
      "timestamp": "2026-08-16T13:52:02.780Z"
    },
    {
      "account": "Player2",
      "status": "authenticated",
      "timestamp": "2026-08-16T13:52:02.780Z"
    }
  ],
  "count": 2
}
```

### Generate Username
```
POST /api/accounts/generate-username
```

**Body (optional):**
```json
{
  "salt": true,      // Add random number suffix
  "legit": false     // Add "_LEGIT" suffix
}
```

**Response (200):**
```json
{
  "success": true,
  "username": "BravePilot427"
}
```

---

## Proxies

### Load Proxies
```
POST /api/proxies/load
```

**Body:**
```json
{
  "filePath": "proxies/proxies.txt"
}
```

**Response (200):**
```json
{
  "success": true,
  "proxies": ["192.168.1.1:8080", "10.0.0.1:9090"],
  "count": 2
}
```

### List Proxies
```
GET /api/proxies/list
```

**Response (200):**
```json
{
  "success": true,
  "proxies": ["192.168.1.1:8080", "10.0.0.1:9090"],
  "count": 2
}
```

### Check Proxy Status
```
POST /api/proxies/check
```

**Body (optional):**
```json
{
  "proxies": ["192.168.1.1:8080", "10.0.0.1:9090"]
}
```

**Response (200):**
```json
{
  "success": true,
  "results": [
    {
      "proxy": "192.168.1.1:8080",
      "status": "active",
      "responseTime": "45ms",
      "lastChecked": "2026-08-16T13:52:02.780Z"
    },
    {
      "proxy": "10.0.0.1:9090",
      "status": "inactive",
      "error": "Connection timeout",
      "lastChecked": "2026-08-16T13:52:02.780Z"
    }
  ],
  "count": 2
}
```

---

## Game

### Get Game State
```
GET /api/game/state
```

**Response (200):**
```json
{
  "success": true,
  "vehicles": [
    {
      "id": "vehicle_abc123",
      "type": "car",
      "position": {"x": 100, "y": 150},
      "speed": 50,
      "isMoving": true
    }
  ],
  "roads": [],
  "intersections": [],
  "trafficLights": [
    {
      "id": "light_xyz789",
      "position": {"x": 200, "y": 200},
      "state": "red"
    }
  ],
  "scores": {},
  "gameMode": "sandbox",
  "isPaused": false,
  "currentLevel": 1
}
```

### Perform Game Action
```
POST /api/game/action
```

**Spawn Vehicle:**
```json
{
  "action": "spawn_vehicle",
  "payload": {
    "type": "car",
    "position": {"x": 100, "y": 100}
  }
}
```

**Place Traffic Light:**
```json
{
  "action": "place_traffic_light",
  "payload": {
    "position": {"x": 200, "y": 200}
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Vehicle spawned",
  "vehicleId": "vehicle_abc123"
}
```

### Save Game
```
POST /api/game/save
```

**Response (200):**
```json
{
  "success": true,
  "message": "Game state saved",
  "timestamp": "2026-08-16T13:52:02.780Z"
}
```

### Get Leaderboard
```
GET /api/game/leaderboard
```

**Response (200):**
```json
{
  "success": true,
  "leaderboard": [
    {
      "player": "Player1",
      "score": 5000
    },
    {
      "player": "Player2",
      "score": 3500
    }
  ],
  "count": 2
}
```

---

## Multiplayer

### Join Multiplayer
```
POST /api/multiplayer/join
```

**Body:**
```json
{
  "username": "MyPlayer"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Joined multiplayer",
  "username": "MyPlayer"
}
```

---

## Webhooks

### Configure Webhook
```
POST /api/webhook/configure
```

**Body:**
```json
{
  "url": "https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN",
  "events": ["vehicle:spawned", "accident", "level:complete"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Webhook configured",
  "url": "https://discord.com/api/webhooks/..."
}
```

---

## Themes

### Load Theme
```
POST /api/theme/load
```

**Body:**
```json
{
  "themePath": "public/themes/dark.css"
}
```

**Response (200):**
```json
{
  "success": true,
  "css": "/* CSS content here */"
}
```

### Get Current Theme
```
GET /api/theme/current
```

**Response (200):**
```json
{
  "success": true,
  "theme": "default"
}
```

### Get Theme CSS
```
GET /api/theme/css
```

**Response (200):**
```
Content-Type: text/css
/* CSS content */
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Required parameter missing: filePath"
}
```

### 404 Not Found
```json
{
  "error": "Script not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (missing/invalid parameters) |
| 404 | Not Found (resource doesn't exist) |
| 500 | Server Error |

---

## cURL Examples

```bash
# Health check
curl http://localhost:3000/health

# Get game state
curl http://localhost:3000/api/game/state

# Spawn a vehicle
curl -X POST http://localhost:3000/api/game/action \
  -H "Content-Type: application/json" \
  -d '{"action":"spawn_vehicle","payload":{"type":"car","position":{"x":100,"y":100}}}'

# Upload and run script
curl -X POST http://localhost:3000/api/script/upload \
  -H "Content-Type: application/json" \
  -d '{"scriptName":"test","scriptContent":"chat \"Hello\"\ndelay 1000"}'

curl -X POST http://localhost:3000/api/script/run \
  -H "Content-Type: application/json" \
  -d '{"scriptName":"test"}'

# Load accounts
curl -X POST http://localhost:3000/api/accounts/load \
  -H "Content-Type: application/json" \
  -d '{"filePath":"accounts/accounts.txt"}'

# Check proxies
curl -X POST http://localhost:3000/api/proxies/check
```

---

## Rate Limiting

No built-in rate limiting by default. Configure based on your needs in `src/utils/config.js`.

## Authentication

Currently no authentication. Consider adding JWT or API keys for production use.

## CORS

CORS is enabled for all origins by default. Modify in `src/app.js` for security:
```javascript
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // Restrict to your domain
    methods: ["GET", "POST"]
  }
});
```

---

For more information, see README.md
