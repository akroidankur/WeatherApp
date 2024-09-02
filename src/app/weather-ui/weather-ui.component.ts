import { Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MaterialModule } from '../helper/material.module';
import { CurrentDefaultLocation, CurrentWeatherInterface, ForecastDay, ForecastWeatherInterface, Hour, MainCities } from '../interfaces/weatherapi';
import { WeatherService } from '../services/weather.service';
import { TempUnitService } from '../services/tempunit.service';
import { WidthService } from '../services/width.service';
import { LocationService } from '../services/location.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-weather-ui',
  standalone: true,
  imports: [MaterialModule],
  providers: [DatePipe],
  templateUrl: './weather-ui.component.html',
  styleUrl: './weather-ui.component.scss'
})
export class WeatherUiComponent implements OnInit {
  private readonly platformId: Object = inject(PLATFORM_ID)
  readonly weatherService: WeatherService = inject(WeatherService);
  readonly tempUnitService: TempUnitService = inject(TempUnitService);
  private readonly widthService: WidthService = inject(WidthService);
  private readonly locationService: LocationService = inject(LocationService);
  private readonly datePipe: DatePipe = inject(DatePipe);

  locationQuery: string = ''; // Bound to ngModel
  filteredLocations: Array<google.maps.places.AutocompletePrediction> = [];  //autocomplete location list

  location!: CurrentDefaultLocation;
  defaultLocationForecast!: ForecastWeatherInterface | null;

  mainCitiesList: Array<string> = ['guwahati', 'mumbai', 'bengaluru', 'hyderabad', 'delhi', 'kolkata', 'chennai', 'ahmedabad', 'gurgaon', 'jaipur', 'chandigarh']
  mainCities!: MainCities;

  forecastDayTabIndex: number = 0;
  forecastHourlyTabIndex: number = 0;

  constructor() {
    // Reactively watch for changes
    effect(() => {
      this.defaultLocationForecast = this.weatherService.forecastWeather();
      this.widthService.width();
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.assignHourlyTabIndex();
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

  //hourly tab adjust to current time
  private assignHourlyTabIndex(): void {
    const currentTime: number = new Date().getHours();
    this.forecastHourlyTabIndex = currentTime;
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
      if (isPlatformBrowser(this.platformId)) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const location: CurrentDefaultLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            resolve(location);
          },
          error => {
            this.weatherService.fetchForecast(`${this.mainCitiesList[0]}`);
            console.error(`This is ssr error or Unable to retrieve location ${error}`);
            reject(error);
          }
        );
      } else {
        this.weatherService.fetchForecast(`${this.mainCitiesList[0]}`);
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

  //major cities clicked render in html
  citiesClicked(city: string): void {
    this.weatherService.fetchForecast(city);
  }

  //render location in html
  getLocationString(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.location.name}, ${this.defaultLocationForecast.location.region}, ${this.defaultLocationForecast.location.country}`
    }
    else {
      return ''
    }
  }

  //render date string in html
  getDateString(): string {
    if (this.defaultLocationForecast) {
      return `${new Date(this.defaultLocationForecast.location.localtime)}`
    }
    else {
      return `${new Date()}`
    }
  }

  //render icon url in html
  getIconUrl(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.condition.icon}`
    }
    else {
      return ''
    }
  }

  //render temp in html
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

  //render feels like temp in html
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

  //render weather condition in html
  getCondition(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.condition.text}`
    }
    else {
      return ''
    }
  }

  //render wind speed in html
  getWindSpeed(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.wind_kph} km/h`
    }
    else {
      return ''
    }
  }

  //render humidity in html
  getHumidity(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.humidity} %`
    }
    else {
      return ''
    }
  }

  //render cloud % in html
  getCloud(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.cloud} %`
    }
    else {
      return ''
    }
  }

  //render uv in html
  getUV(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.uv}`
    }
    else {
      return ''
    }
  }

  //render prep in html
  getPrecipitation(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.precip_mm} mm`
    }
    else {
      return ''
    }
  }

  //render pressure in html
  getPressure(): string {
    if (this.defaultLocationForecast) {
      return `${this.defaultLocationForecast.current.pressure_mb} mb`
    }
    else {
      return ''
    }
  }

  //render heat index in html
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

  //return forecast days to for loop in html for rendering
  getForeCast14Days(): Array<ForecastDay> {
    if (this.defaultLocationForecast) {
      return this.defaultLocationForecast.forecast.forecastday;
    }
    else {
      return [];
    }
  }

  //return boolean for run time screen width change
  isSmallWidth(): boolean {
    return parseInt(this.widthService.width()) < 768;
  }

  //render date string in html
  getForecastDateString(date: string): string {
    return `${this.datePipe.transform(new Date(date), 'mediumDate')}`;
  }

  //render max temp in html
  getForecastMaxTemp(tempInC: number, tempInF: number, unit: string): string {
    if (unit === 'cel') {
      return `${tempInC} °C`
    }
    else {
      return `${tempInF} °F`
    }
  }

  //render wind speed in html
  getForecastWindSpeed(speed: number): string {
    return `${speed} km/h`
  }

  //render prep in html
  getForecastPrecipitation(prep: number): string {
    return `${prep} mm`
  }

  //render humidity in html
  getForecastHumidity(humidty: number): string {
    return `${humidty} %`
  }

  //render rain possibility in html
  getForecastRainChance(rain: number): string {
    return `${rain} %`
  }

  //forecast days tab change event capture
  onDaysTabChange(event: MatTabChangeEvent): void {
    this.forecastDayTabIndex = event.index;
  }

  onHourlyTabChange(event: MatTabChangeEvent): void {
    // this.forecastDayTabIndex = event.index;
  }

  //render hourly data of each forecast days in html
  getHourlyData(): Array<Hour> {
    if (this.defaultLocationForecast) {
      return this.defaultLocationForecast?.forecast.forecastday[this.forecastDayTabIndex].hour;
    }
    else {
      return [];
    }
  }

  //render time in html
  getForecastHourlyDateString(date: string): string {
    return `${this.datePipe.transform(new Date(date), 'shortTime')}`;
  }

  getForecastHourlyFullDateString(date: string): string {
    return `${this.datePipe.transform(new Date(date), 'medium')}`;
  }
}