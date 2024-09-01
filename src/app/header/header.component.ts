import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../helper/material.module';
import { LocationService } from '../services/location.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ThemeService } from '../services/theme.service';
import { TempUnitService } from '../services/tempunit.service';
import { WeatherService } from '../services/weather.service';
import { CurrentWeatherInterface, MainCities } from '../interfaces/weatherapi';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private readonly locationService: LocationService = inject(LocationService);
  readonly themeService: ThemeService = inject(ThemeService);
  readonly tempUnitService: TempUnitService = inject(TempUnitService);
  private readonly weatherService: WeatherService = inject(WeatherService)

  locationQuery: string = ''; // Bound to ngModel
  filteredLocations: Array<google.maps.places.AutocompletePrediction> = [];  //autocomplete location list

  mainCitiesList: Array<string> = ['guwahati', 'delhi', 'mumbai', 'bengaluru', 'hyderabad']
  mainCities!: MainCities;

  constructor() { }

  ngOnInit(): void {
    this.fetchMainCitiesCurrentWeather();
    console.log(this.mainCities);
  }

  onUnitChange(): void {
    if (this.tempUnitService.unitSignal() === 'cel') {
      this.tempUnitService.setUnit('far');
    }
    else {
      this.tempUnitService.setUnit('cel');
    }
  }

  toggleTheme(): void {
    this.themeService.setTheme(!this.themeService.isThemeLight());
  }

  onQueryChange(query: string): void {
    this.locationService.fetchLocations(query, (results) => {
      this.filteredLocations = results;
      console.log(this.filteredLocations);
    });
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    console.log('Selected location:', event.option.value);
    this.weatherService.fetchForecast(event.option.value);
    console.log(this.weatherService.forecastWeather());
  }

  private fetchMainCitiesCurrentWeather(): void {
    this.mainCitiesList.forEach(city => {
      this.weatherService.fetchCurrent(city);

      const weatherData = this.weatherService.currentWeather();
      const error = this.weatherService.currentWeatherError();

      if (weatherData && !error) {
        this.mainCities = {
          ...this.mainCities,
          [city]: weatherData
        };
      }
      else if (error) {
        console.error(`Error fetching weather for ${city}:`, error);
      }
    })
  }

  objectValues(object: MainCities | null): Array<CurrentWeatherInterface> {
    if (object) {
      return Object.values(object);
    }
    else {
      return [];
    }
  }

}
