// Additional rendering utilities
class Renderer {
  static drawRoad(ctx, road, canvasWidth, canvasHeight, gridSize) {
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo((road.startX / gridSize) * canvasWidth, (road.startY / gridSize) * canvasHeight);
    ctx.lineTo((road.endX / gridSize) * canvasWidth, (road.endY / gridSize) * canvasHeight);
    ctx.stroke();
  }

  static drawIntersection(ctx, intersection, canvasWidth, canvasHeight, gridSize) {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(
      (intersection.x / gridSize) * canvasWidth,
      (intersection.y / gridSize) * canvasHeight,
      5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  static drawTrafficLight(ctx, light, canvasWidth, canvasHeight, gridSize) {
    const colors = { red: '#f44336', yellow: '#FFC107', green: '#4caf50' };
    ctx.fillStyle = colors[light.state] || '#999';
    ctx.beginPath();
    ctx.arc(
      (light.x / gridSize) * canvasWidth,
      (light.y / gridSize) * canvasHeight,
      8,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  static drawGrid(ctx, canvasWidth, canvasHeight, gridSize) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;

    for (let x = 0; x < canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    for (let y = 0; y < canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  }
}