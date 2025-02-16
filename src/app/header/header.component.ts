import { Component, effect, inject } from '@angular/core';
import { MaterialModule } from '../helper/material.module';
import { LocationService } from '../services/location.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ThemeService } from '../services/theme.service';
import { TempUnitService } from '../services/tempunit.service';
import { WeatherService } from '../services/weather.service';
import { WidthService } from '../services/width.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly locationService: LocationService = inject(LocationService);
  readonly themeService: ThemeService = inject(ThemeService);
  readonly tempUnitService: TempUnitService = inject(TempUnitService);
  private readonly weatherService: WeatherService = inject(WeatherService);
  private readonly widthService: WidthService = inject(WidthService);

  locationQuery: string = ''; // Bound to ngModel
  filteredLocations: Array<google.maps.places.AutocompletePrediction> = [];  //autocomplete location list

  constructor() {
    // Reactively watch for changes
    effect(() => {
      this.widthService.width();
    });
  }

  //reload page
  reloadPage(): void {
    window.location.reload();
  }

  //toggle temp unit
  onUnitChange(): void {
    if (this.tempUnitService.unitSignal() === 'cel') {
      this.tempUnitService.setUnit('far');
    }
    else {
      this.tempUnitService.setUnit('cel');
    }
  }

  //toggle theme
  toggleTheme(): void {
    this.themeService.setTheme(!this.themeService.isThemeLight());
  }

  //return boolean for run time screen width change
  isSmallWidth(): boolean {
    return parseInt(this.widthService.width()) < 768
  }

    onQueryChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      this.locationQuery = input.value.trim().toLowerCase();
    }


    fetchForecast(): void {
      this.weatherService.fetchForecast(this.locationQuery);
    }
}
