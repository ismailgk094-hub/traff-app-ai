document.getElementById('accountFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const content = event.target.result;
      const accounts = content.split('\n').filter(line => line.trim());
      const accountsList = document.getElementById('accountsList');
      accountsList.innerHTML = `<div style="font-size: 12px; color: #4db8ff;">${accounts.length} accounts loaded</div>`;
    };
    reader.readAsText(file);
  }
});

document.getElementById('proxyFile').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const content = event.target.result;
      const proxies = content.split('\n').filter(line => line.trim());
      const proxiesList = document.getElementById('proxiesList');
      proxiesList.innerHTML = `<div style="font-size: 12px; color: #4db8ff;">${proxies.length} proxies loaded</div>`;
    };
    reader.readAsText(file);
  }
});

// Function to start the simulation
function startSimulation() {
    // Logic to start the simulation
    scriptConsole.innerHTML += '<p>Simulation started.</p>';
}

// Function to stop the simulation
function stopSimulation() {
    // Logic to stop the simulation
    scriptConsole.innerHTML += '<p>Simulation stopped.</p>';
}

// Function to reset the simulation
function resetSimulation() {
    // Logic to reset the simulation
    scriptConsole.innerHTML += '<p>Simulation reset.</p>';
}