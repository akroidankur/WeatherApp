import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WidthService {
  width: WritableSignal<string> = signal(''); // Default value for SSR
  private readonly platformId: Object = inject(PLATFORM_ID)

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Only run in the browser
      this.width.set(window.innerWidth.toString());

      const resizeObserver = new ResizeObserver(() => {
        this.width.set(window.innerWidth.toString());
      });

      resizeObserver.observe(document.body);
    }
  }
}
