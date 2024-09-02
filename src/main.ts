import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

if (environment.PRODUCTION) {
  enableProdMode();
}

// Function to bootstrap the Angular application
function bootstrapApp() {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error('Error bootstrapping the app:', err));
}

if (typeof window !== 'undefined') {
  // If the window object is available, we are running in a browser environment
  if (document.readyState === 'loading') {
    // The DOM is still loading, so wait for it to finish before bootstrapping
    document.addEventListener('DOMContentLoaded', bootstrapApp);
  } else {
    // The DOM is fully loaded, bootstrap the app immediately
    bootstrapApp();
  }
} else {
  // If window is undefined, this is not a browser environment
  console.error('SSR: Not bootstrapping as this is a server environment');
}
