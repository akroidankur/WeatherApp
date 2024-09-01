import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isThemeLight = signal<boolean>(false);

	setTheme(theme: boolean) {
		this.isThemeLight.set(theme);
	}
}
