const socket = io();

class GameClient {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.gameState = {};
    this.isRunning = true;

    this.setupSocketListeners();
    this.setupEventListeners();
    this.gameLoop();
  }

  setupSocketListeners() {
    socket.on('game:sync', (state) => {
      this.gameState = state;
    });

    socket.on('script:log', (message) => {
      this.addLogEntry(message);
    });
  }

  setupEventListeners() {
    document.getElementById('spawnVehicle').addEventListener('click', () => this.spawnVehicle());
    document.getElementById('pauseGame').addEventListener('click', () => this.togglePause());
    document.getElementById('saveGame').addEventListener('click', () => this.saveGame());
    document.getElementById('runScript').addEventListener('click', () => this.runScript());
    document.getElementById('stopScript').addEventListener('click', () => this.stopScript());
  }

  spawnVehicle() {
    socket.emit('game:action', { action: 'spawn_vehicle', payload: {} });
  }

  togglePause() {
    socket.emit('game:action', { action: 'toggle_pause', payload: {} });
  }

  saveGame() {
    fetch('/api/save', { method: 'POST' })
      .then(res => res.json())
      .then(data => this.addLogEntry('Game saved!'));
  }

  runScript() {
    const scriptContent = document.getElementById('scriptEditor').value;
    socket.emit('script:run', { scriptContent });
  }

  stopScript() {
    socket.emit('script:stop');
  }

  addLogEntry(message) {
    const logContent = document.getElementById('logContent');
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContent.appendChild(entry);
    logContent.scrollTop = logContent.scrollHeight;
  }

  gameLoop() {
    this.render();
    if (this.isRunning) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  render() {
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.gameState.vehicles) {
      this.gameState.vehicles.forEach(vehicle => {
        this.drawVehicle(vehicle);
      });
    }

    document.getElementById('vehicleCount').textContent = this.gameState.vehicles ? this.gameState.vehicles.length : 0;
  }

  drawVehicle(vehicle) {
    const x = (vehicle.x / 50) * this.canvas.width;
    const y = (vehicle.y / 50) * this.canvas.height;

    const colors = { car: '#4db8ff', truck: '#ff9800', bus: '#4caf50', emergency: '#f44336' };
    this.ctx.fillStyle = colors[vehicle.type] || '#4db8ff';
    this.ctx.fillRect(x - 10, y - 5, 20, 10);

    this.ctx.fillStyle = '#fff';
    this.ctx.font = '8px Arial';
    this.ctx.fillText(vehicle.type, x - 5, y);
  }
}

const gameClient = new GameClient();