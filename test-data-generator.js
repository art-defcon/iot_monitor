const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const apiBase = 'http://localhost:8082/api/ingestion'; // Matches application.properties port

// Gateway configurations
const gateways = [
  {
    name: "Summer House",
    location: "59.329323, 18.068581",
    model: "GW-2000",
    sensors: {
      voltage: ["battery 1", "battery 2"],
      temperature: ["house", "outdoor"],
      humidity: ["indoor", "shed"]
    }
  },
  {
    name: "Barn",
    location: "59.328714, 18.072196", 
    model: "GW-2000",
    sensors: {
      voltage: ["boat battery", "solar battery"],
      temperature: ["inhouse", "battery temperature"],
      humidity: ["garden", "flower bed"]
    }
  }
];

// Generate realistic sensor values
function generateReading(baseValue, variation) {
  return baseValue + (Math.random() * variation * 2) - variation;
}

async function createGateway(gatewayConfig) {
  try {
    const response = await axios.post(`${apiBase}/gateways/gateways`, {
      name: gatewayConfig.name,
      location: gatewayConfig.location,
      model: gatewayConfig.model
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.headers.location.split('/').pop();
  } catch (error) {
    console.error('Gateway creation failed:', error.response?.data);
    throw error;
  }
}

async function generateReadings(gatewayId, sensors) {
  const now = new Date();
  const readings = [];
  
  // Generate 7 days of data at 15 minute intervals
  for (let hours = -168; hours <= 0; hours += 0.25) {
    const timestamp = new Date(now.getTime() + hours * 60 * 60 * 1000);
    
    // Voltage readings
    sensors.voltage.forEach(label => {
      readings.push({
        sensor: label,
        unit: "volt",
        reading: generateReading(12.6, 0.5),
        timestamp: timestamp.toISOString()
      });
    });

    // Temperature readings
    sensors.temperature.forEach(label => {
      readings.push({
        sensor: label,
        unit: "celsius",
        reading: label.includes('battery') ? generateReading(25, 5) : generateReading(18, 10),
        timestamp: timestamp.toISOString()
      });
    });

    // Humidity readings
    sensors.humidity.forEach(label => {
      readings.push({
        sensor: label,
        unit: "percent",
        reading: generateReading(50, 30),
        timestamp: timestamp.toISOString()
      });
    });
  }

  // Split into batches of 100 readings
  for (let i = 0; i < readings.length; i += 100) {
    const batch = readings.slice(i, i + 100);
    try {
      await axios.post(`${apiBase}/readings/batch`, {
        gatewayId,
        data: batch
      });
    } catch (error) {
      console.error('Batch submission failed:', error.response?.data);
    }
  }
}

async function deleteAllGateways() {
  try {
    const response = await axios.get(`${apiBase}/gateways`);
    await Promise.all(response.data.map(gateway => 
      axios.delete(`${apiBase}/gateways/${gateway.gatewayId}`)
    ));
    console.log('Deleted', response.data.length, 'existing gateways');
  } catch (error) {
    console.error('Cleanup failed:', error.response?.data || error.message);
  }
}

async function main() {
  try {
    console.log('Cleaning up existing data...');
    await deleteAllGateways();
    
    for (const gatewayConfig of gateways) {
      console.log(`Creating ${gatewayConfig.name}...`);
      const gatewayId = await createGateway(gatewayConfig);
      console.log(`Generating readings for ${gatewayConfig.name}`);
      await generateReadings(gatewayId, gatewayConfig.sensors);
    }
    console.log('Test data generation complete');
  } catch (error) {
    console.error('Test data generation failed:', error);
    process.exit(1);
  }
}

main();
