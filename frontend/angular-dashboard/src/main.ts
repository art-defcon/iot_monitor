import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { 
  Chart, 
  LineController, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale,
  Tooltip, // Required for tooltips
  Legend   // Required for legend (even if hidden, often needed)
} from 'chart.js';

// Register necessary Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
