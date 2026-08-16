/**
 * NodeFlow Game Client
 * Frontend game logic and Socket.io communication
 */

class GameClient {
    constructor() {
        this.socket = null;
        this.gameState = {};
        this.canvas = null;
        this.ctx = null;
        this.playerName = `Player_${Math.random().toString(36).substr(2, 9)}`;
        this.isConnected = false;
        this.isPaused = false;
        this.score = 0;
        this.vehicles = new Map();
        this.isRunning = false;
    }

    async init() {
        console.log('Initializing GameClient...');
        
        // Setup canvas
        this.canvas = document.getElementById('canvas');
        if (!this.canvas) {
            console.warn('Canvas not found, creating one');
            const container = document.getElementById('gameContainer');
            if (container) {
                this.canvas = document.createElement('canvas');
                this.canvas.id = 'canvas';
                this.canvas.width = container.offsetWidth - 300;
                this.canvas.height = container.offsetHeight;
                container.insertBefore(this.canvas, container.firstChild);
            }
        }
        
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.setupCanvasSize();
            window.addEventListener('resize', () => this.setupCanvasSize());
        }

        // Connect to server
        this.connectToServer();

        // Setup event listeners
        this.setupEventListeners();

        // Start game loop
        this.startGameLoop();

        // Fetch initial game state
        try {
            const response = await fetch('/api/game/state');
            const data = await response.json();
            this.gameState = data;
            this.updateUI();
        } catch (error) {
            console.error('Error fetching game state:', error);
        }
    }

    setupCanvasSize() {
        if (!this.canvas) return;
        const container = document.getElementById('gameContainer');
        if (container) {
            this.canvas.width = container.offsetWidth - 300;
            this.canvas.height = container.offsetHeight - 40; // Account for status bar
        }
    }

    connectToServer() {
        this.socket = io();

        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.isConnected = true;
            document.getElementById('serverStatus').textContent = 'Connected';
            document.getElementById('serverStatus').style.color = '#00ff00';

            // Emit join event
            this.socket.emit('player:join', { username: this.playerName });
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.isConnected = false;
            document.getElementById('serverStatus').textContent = 'Disconnected';
            document.getElementById('serverStatus').style.color = '#ff0000';
        });

        // Listen for game state updates
        this.socket.on('game:sync', (state) => {
            this.gameState = state;
            this.updateUI();
        });

        this.socket.on('vehicle:update', (data) => {
            this.vehicles.set(data.vehicleId, data);
        });

        this.socket.on('vehicle:spawned', (data) => {
            this.vehicles.set(data.vehicleId, data.vehicle);
            this.addVehicleToList(data.vehicleId, data.vehicle);
        });

        this.socket.on('vehicle:removed', (data) => {
            this.vehicles.delete(data.vehicleId);
            this.removeVehicleFromList(data.vehicleId);
        });

        this.socket.on('chat:message', (data) => {
            this.addChatMessage(data.username, data.message);
        });

        this.socket.on('script:log', (data) => {
            this.addChatMessage('[SCRIPT]', data.message);
        });

        this.socket.on('traffic:event', (data) => {
            console.log('Traffic event:', data);
        });
    }

    setupEventListeners() {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendChatMessage(chatInput.value);
                    chatInput.value = '';
                }
            });
        }
    }

    startGameLoop() {
        if (this.isRunning) return;
        this.isRunning = true;

        const gameLoop = () => {
            this.update();
            this.render();
            requestAnimationFrame(gameLoop);
        };

        gameLoop();
    }

    update() {
        if (this.isPaused) return;

        // Update game state
        for (const [vehicleId, vehicle] of this.vehicles) {
            if (vehicle.isMoving) {
                vehicle.position.x += vehicle.speed * 0.016; // Assuming 60 FPS
                vehicle.position.y += vehicle.speed * 0.016;
            }
        }
    }

    render() {
        if (!this.ctx || !this.canvas) return;

        // Clear canvas
        this.ctx.fillStyle = '#2d3436';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.drawGrid();

        // Draw traffic lights
        this.drawTrafficLights();

        // Draw vehicles
        this.drawVehicles();

        // Draw FPS
        this.drawFPS();
    }

    drawGrid() {
        this.ctx.strokeStyle = '#444';
        this.ctx.lineWidth = 1;

        const gridSize = 50;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawVehicles() {
        for (const [vehicleId, vehicle] of this.vehicles) {
            if (!vehicle.position) continue;

            const x = vehicle.position.x;
            const y = vehicle.position.y;
            const size = vehicle.type === 'truck' ? 20 : 15;

            // Draw vehicle
            this.ctx.fillStyle = vehicle.isMoving ? '#00ff00' : '#ff0000';
            this.ctx.fillRect(x - size/2, y - size/2, size, size);

            // Draw vehicle ID
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(vehicleId.substr(-4), x - 10, y + 15);
        }
    }

    drawTrafficLights() {
        if (!this.gameState.trafficLights) return;

        for (const light of this.gameState.trafficLights) {
            const x = light.position.x;
            const y = light.position.y;

            this.ctx.fillStyle = light.state === 'green' ? '#00ff00' : light.state === 'red' ? '#ff0000' : '#ffff00';
            this.ctx.fillRect(x - 10, y - 10, 20, 20);
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x - 10, y - 10, 20, 20);
        }
    }

    drawFPS() {
        const fps = Math.round(1000 / 16.67); // Approximate FPS
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillText(`FPS: ${fps}`, 10, this.canvas.height - 10);
    }

    spawnVehicle(type) {
        if (!this.isConnected) {
            alert('Not connected to server');
            return;
        }

        const position = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height
        };

        this.socket.emit('player:action', {
            action: 'spawn_vehicle',
            payload: { type, position }
        });
    }

    placeTrafficLight() {
        if (!this.isConnected) {
            alert('Not connected to server');
            return;
        }

        const position = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height
        };

        this.socket.emit('player:action', {
            action: 'place_traffic_light',
            payload: { position }
        });
    }

    pauseGame() {
        this.isPaused = !this.isPaused;
        console.log(this.isPaused ? 'Game paused' : 'Game resumed');
    }

    resetGame() {
        this.vehicles.clear();
        this.score = 0;
        this.updateUI();
    }

    sendChatMessage(message) {
        if (this.isConnected) {
            this.socket.emit('chat:message', { message });
            this.addChatMessage('You', message);
        }
    }

    async runScript() {
        const editor = document.getElementById('scriptEditor');
        if (editor && editor.value) {
            try {
                const response = await fetch('/api/script/run', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ scriptContent: editor.value })
                });
                const data = await response.json();
                console.log('Script result:', data);
                this.addChatMessage('[SYSTEM]', data.success ? 'Script executed successfully' : 'Script failed');
            } catch (error) {
                console.error('Error running script:', error);
                this.addChatMessage('[SYSTEM]', 'Error running script');
            }
        }
    }

    addChatMessage(username, message) {
        const chatLog = document.getElementById('chatLog');
        if (chatLog) {
            const div = document.createElement('div');
            div.className = 'chat-message';
            div.textContent = `${username}: ${message}`;
            chatLog.appendChild(div);
            chatLog.scrollTop = chatLog.scrollHeight;

            // Keep only last 50 messages
            while (chatLog.children.length > 50) {
                chatLog.removeChild(chatLog.firstChild);
            }
        }
    }

    addVehicleToList(vehicleId, vehicle) {
        const list = document.getElementById('vehicleList');
        if (list) {
            const div = document.createElement('div');
            div.className = 'vehicle-item';
            div.id = `vehicle_${vehicleId}`;
            div.textContent = `${vehicle.type}: ${vehicleId.substr(-8)}`;
            list.appendChild(div);
        }
    }

    removeVehicleFromList(vehicleId) {
        const element = document.getElementById(`vehicle_${vehicleId}`);
        if (element) {
            element.remove();
        }
    }

    updateUI() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('vehicleCountValue').textContent = this.vehicles.size;
        document.getElementById('levelValue').textContent = this.gameState.currentLevel || 1;

        if (this.gameState.efficiency !== undefined) {
            document.getElementById('efficiencyValue').textContent = Math.round(this.gameState.efficiency) + '%';
        }
    }
}

// Initialize global game client
const gameClient = new GameClient();
