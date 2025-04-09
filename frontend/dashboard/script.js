// API base URL
const API_BASE_URL = 'http://localhost:8080/api/ingestion';

// Polling interval in milliseconds (5 seconds)
const POLL_INTERVAL = 5000;

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    fetchAndRenderDashboard();
    setInterval(fetchAndRenderDashboard, POLL_INTERVAL);
});

// Fetch data and render dashboard
async function fetchAndRenderDashboard() {
    try {
        const devices = await fetchDevices();
        const readings = await fetchLatestReadings(devices);
        renderDeviceStatus(devices);
        initializeChart(readings);
        populateMetricsTable(devices, readings);
    } catch (error) {
        console.error('Dashboard update failed:', error);
        showError('Failed to update dashboard. Will retry...');
    }
}

// Fetch all devices from API
async function fetchDevices() {
    const response = await fetch(`${API_BASE_URL}/devices`);
    if (!response.ok) {
        throw new Error(`Failed to fetch devices: ${response.status}`);
    }
    return await response.json();
}

// Fetch latest readings for all devices
async function fetchLatestReadings(devices) {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000).toISOString();
    
    const readingsPromises = devices.map(async device => {
        const response = await fetch(
            `${API_BASE_URL}/devices/${device.deviceId}/readings?start=${oneHourAgo}&end=${now.toISOString()}`
        );
        if (!response.ok) {
            console.error(`Failed to fetch readings for device ${device.deviceId}: ${response.status}`);
            return [];
        }
        return await response.json();
    });
    
    return await Promise.all(readingsPromises);
}

// Render device status cards
function renderDeviceStatus(devices) {
    const statusContainer = document.getElementById('device-status');
    statusContainer.innerHTML = ''; // Clear previous content
    
    devices.forEach(device => {
        const statusItem = document.createElement('div');
        statusItem.className = 'status-item';
        
        const statusIndicator = document.createElement('span');
        statusIndicator.className = `status-indicator ${device.status.toLowerCase()}`;
        
        const deviceInfo = document.createElement('span');
        deviceInfo.textContent = `${device.name} (${device.deviceId})`;
        
        const deviceStatus = document.createElement('span');
        deviceStatus.textContent = device.status === 'ONLINE' ? 'Online' : 'Offline';
        deviceStatus.style.color = device.status === 'ONLINE' ? '#2ecc71' : '#e74c3c';
        
        statusItem.appendChild(statusIndicator);
        statusItem.appendChild(deviceInfo);
        statusItem.appendChild(deviceStatus);
        
        statusContainer.appendChild(statusItem);
    });
}

// Initialize the sensor readings chart with latest data
function initializeChart(readings) {
    const ctx = document.getElementById('sensorChart').getContext('2d');
    
    // Process readings to extract timestamps and values
    const allReadings = readings.flat();
    const timestamps = [...new Set(allReadings.map(r => new Date(r.timestamp).toLocaleTimeString()))].sort();
    
    const powerData = timestamps.map(t => {
        const reading = allReadings.find(r => new Date(r.timestamp).toLocaleTimeString() === t);
        return reading ? reading.powerKw : null;
    });
    
    const voltageData = timestamps.map(t => {
        const reading = allReadings.find(r => new Date(r.timestamp).toLocaleTimeString() === t);
        return reading ? reading.voltage : null;
    });
    
    // Destroy previous chart if exists
    if (window.sensorChart) {
        window.sensorChart.destroy();
    }
    
    window.sensorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [
                {
                    label: 'Power (kW)',
                    data: powerData,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: 'Voltage (V)',
                    data: voltageData,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Power (kW)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Voltage (V)'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

// Populate the metrics table with device and reading data
function populateMetricsTable(devices, readings) {
    const tableBody = document.querySelector('#metrics tbody');
    tableBody.innerHTML = ''; // Clear previous content
    
    devices.forEach((device, index) => {
        const deviceReadings = readings[index] || [];
        const latestReading = deviceReadings[deviceReadings.length - 1] || {};
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${device.deviceId}</td>
            <td>${device.location}</td>
            <td>${latestReading.powerKw || 'N/A'}</td>
            <td>${latestReading.voltage || 'N/A'}</td>
            <td>${deviceReadings.length > 0 ? new Date(latestReading.timestamp).toLocaleString() : 'N/A'}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Show error message to user
function showError(message) {
    const errorElement = document.getElementById('error-message') || createErrorElement();
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => errorElement.style.display = 'none', 5000);
}

// Create error message element if it doesn't exist
function createErrorElement() {
    const errorElement = document.createElement('div');
    errorElement.id = 'error-message';
    errorElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px;
        background-color: #e74c3c;
        color: white;
        border-radius: 5px;
        display: none;
        z-index: 1000;
    `;
    document.body.appendChild(errorElement);
    return errorElement;
}