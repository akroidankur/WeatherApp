import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TempUnitService {
  unitSignal = signal<string>('cel');

	setUnit(theme: string) {
		this.unitSignal.set(theme);
	}
}
