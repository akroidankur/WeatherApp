import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

if (environment.PRODUCTION) {
  enableProdMode();
}

function bootstrapApp() {
  bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    // Wait for the DOMContentLoaded event if the document is still loading
    document.addEventListener('DOMContentLoaded', () => {
      bootstrapApp();
    });
  } else {
    // If the document is already loaded, bootstrap the app immediately
    bootstrapApp();
  }
} else {
  console.error('This code is running in a non-browser environment');
}
