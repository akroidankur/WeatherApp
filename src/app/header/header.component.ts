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
    effect(() => {
      this.widthService.width();
    });
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

  //auto complete location request
  onQueryChange(query: string): void {
    this.locationService.fetchLocations(query, (results) => {
      this.filteredLocations = results;
    });
  }

  //on selection of a location from options
  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    this.weatherService.fetchForecast(event.option.value);
  }

  isSmallWidth(): boolean {
    return parseInt(this.widthService.width()) < 768
  }
}
