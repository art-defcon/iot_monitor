# 🏡 IoT Home Monitor (Personal Project)

This is my personal IoT monitoring system that I've been building to track sensors around my house. Here's the quick rundown:

![IoT Monitor Dashboard Screenshot](https://github.com/art-defcon/iot_monitor/blob/main/public/screenshot_iot.png)

### Features
- Real-time temperature/humidity monitoring
- Device status tracking (battery levels, connectivity)
- Historical data charts 
- Custom alert system 
- DIY dashboard built with Angular 

### 🚀 Quick Start
1. **Backend** (Java/Spring Boot):
```bash
cd backend/iot-service
mvn spring-boot:run -Dspring-boot.run.main-class=com.company.iotmonitor.ingestion.DataIngestionApplication
```

2. **Frontend** (Angular):
```bash
cd frontend/angular-dashboard
npm install
ng serve
```

3. **Generate test data** (optional):
```bash
node test-data-generator.js
```

### 🔧 Tech Stack
```yaml
Backend: 
  - Java 21
  - Spring Boot 3.4.4
  - PostgreSQL
  - Flyway

Frontend:
  - Angular 19
  - Chart.js 4.4
  - Angular Material 19.2

Tools:
  - Maven
  - Node.js 18
```

### 📂 Project Structure
```
/backend       # Spring Boot services
/frontend      # Angular dashboard
/docs          # API documentation
```
