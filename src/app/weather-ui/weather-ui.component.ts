import { Component, effect, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../helper/material.module';
import { CurrentDefaultLocation, CurrentWeatherInterface, ForecastDay, ForecastWeatherInterface, MainCities } from '../interfaces/weatherapi';
import { WeatherService } from '../services/weather.service';
import { TempUnitService } from '../services/tempunit.service';
import { WidthService } from '../services/width.service';
import { LocationService } from '../services/location.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-weather-ui',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './weather-ui.component.html',
  styleUrl: './weather-ui.component.scss'
})
export class WeatherUiComponent implements OnInit {
  readonly weatherService: WeatherService = inject(WeatherService);
  readonly tempUnitService: TempUnitService = inject(TempUnitService);
  private readonly widthService: WidthService = inject(WidthService);
  private readonly locationService: LocationService = inject(LocationService);

  locationQuery: string = ''; // Bound to ngModel
  filteredLocations: Array<google.maps.places.AutocompletePrediction> = [];  //autocomplete location list

  location!: CurrentDefaultLocation;
  defaultLocationForecast!: ForecastWeatherInterface | null;

  mainCitiesList: Array<string> = ['guwahati', 'delhi', 'mumbai', 'bengaluru', 'hyderabad', 'kolkata', 'chennai']
  mainCities!: MainCities;

  constructor() {
    effect(() => {
      this.defaultLocationForecast = this.weatherService.forecastWeather();
      this.widthService.width();
      console.log(this.defaultLocationForecast);
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.fetchMainCitiesCurrentWeather();
      this.location = await this.fetchCurrentLocation();
      if (this.location) {
        this.weatherService.fetchForecast(`${this.location.latitude}, ${this.location.longitude}`);
      }
    }
    catch (error) {
      const errorMsg = `Not supported in ssr or Unable to retrieve location: ${(error as Error).message}`;
      console.error(errorMsg);
    }
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

  //fetch geolaction current
  private fetchCurrentLocation(): Promise<CurrentDefaultLocation> {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && 'navigator' in window) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const location: CurrentDefaultLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            resolve(location);
          },
          error => {
            console.error(`This is ssr error or Unable to retrieve location ${error}`);
            reject(error);
          }
        );
      } else {
        console.error('Not supported in ssr or Geolocation is not supported by this browser');
        reject(new Error('Geolocation is not supported by this browser'));
      }
    });
  }

  //get req for main cities current weather
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

  //return main cities object values for render
  objectValuesMainCities(object: MainCities | null): Array<CurrentWeatherInterface> {
    if (object) {
      return Object.values(object);
    }
    else {
      return [];
    }
  }

  citiesClicked(city: string): void {
    this.weatherService.fetchForecast(city);
  }

  getLocationString(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.location.name}, ${this.defaultLocationForecast.location.region}, ${this.defaultLocationForecast.location.country}`
    }
    else {
      return ''
    }
  }

  getDateString(): string {
    if (this.defaultLocationForecast) {
      return `${new Date(this.defaultLocationForecast.location.localtime)}`
    }
    else {
      return `${new Date()}`
    }
  }

  getIconUrl(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.condition.icon}`
    }
    else {
      return ''
    }
  }

  getCurrentTemp(unit: string): string {
    if (this.defaultLocationForecast) {
      if (unit === 'cel') {
        return `${this.defaultLocationForecast.current.temp_c} °C`
      }
      else {
        return `${this.defaultLocationForecast.current.temp_f} °F`
      }
    }
    else {
      return ''
    }
  }

  getFeelsLikeTemp(unit: string): string {
    if (this.defaultLocationForecast) {
      if (unit === 'cel') {
        return `${this.defaultLocationForecast.current.feelslike_c} °C`
      }
      else {
        return `${this.defaultLocationForecast.current.feelslike_f} °F`
      }
    }
    else {
      return ''
    }
  }

  getCondition(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.condition.text}`
    }
    else {
      return ''
    }
  }

  getWindSpeed(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.wind_kph} km/h`
    }
    else {
      return ''
    }
  }

  getHumidity(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.humidity} %`
    }
    else {
      return ''
    }
  }

  getCloud(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.cloud} %`
    }
    else {
      return ''
    }
  }

  getUV(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.uv}`
    }
    else {
      return ''
    }
  }

  getPrecipitation(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.precip_mm} mm`
    }
    else {
      return ''
    }
  }

  getPressure(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.pressure_mb} mb`
    }
    else {
      return ''
    }
  }

  getHeatIndex(unit: string): string {
    if (this.defaultLocationForecast) {
      if (unit === 'cel') {
        return `${this.defaultLocationForecast.current.heatindex_c} °C`
      }
      else {
        return `${this.defaultLocationForecast.current.heatindex_f} °F`
      }
    }
    else {
      return ''
    }
  }

  getForeCast14Days(): Array<ForecastDay> {
    if (this.defaultLocationForecast) {
      return this.defaultLocationForecast.forecast.forecastday
    }
    else {
      return [];
    }
  }

  isSmallWidth(): boolean {
    return parseInt(this.widthService.width()) < 768
  }
}