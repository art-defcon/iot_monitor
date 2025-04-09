const axios = require('axios');

async function generateTestData() {
  const apiBase = 'http://localhost:8082/api/ingestion'; // Added context path

  // Register gateway
  try {
    const gatewayResponse = await axios.post(`${apiBase}/gateways`, {
      name: "Test Gateway",
      location: "59.329323, 18.068581",
      model: "TestModel-GW1"
    });
    const gatewayId = gatewayResponse.headers.location.split('/').pop();
    
    // Submit readings
    await axios.post(`${apiBase}/readings/batch`, {
      gatewayId: gatewayId,
      data: [{
        sensor: "VOLTAGE",
        unit: "V",
        reading: 13.1,
        timestamp: new Date().toISOString()
      }]
    });
    console.log('Test data created successfully');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

generateTestData().catch(console.error);