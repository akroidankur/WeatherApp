import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CurrentWeatherInterface, ForecastWeatherInterface, SearchLocationInterface } from '../interfaces/weatherapi';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiKey: string = environment.API_KEY;

  // Signals for storing responses
  readonly searchResult = signal<SearchLocationInterface | null>(null);
  readonly currentWeather = signal<CurrentWeatherInterface | null>(null);
  readonly forecastWeather = signal<ForecastWeatherInterface | null>(null);

  // Error signals
  readonly searchError = signal<string | null>(null);
  readonly currentWeatherError = signal<string | null>(null);
  readonly forecastWeatherError = signal<string | null>(null);

  //fetch location search
  fetchSearch(location: string): void {
    this.http.get<SearchLocationInterface>(`/api/search.json?key=${this.apiKey}&q=${location}`)
      .pipe(
        catchError(error => {
          this.searchError.set(`Failed to fetch search results. Error: ${error}`);
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe(response => {
        if (response) {
          this.searchResult.set(response);
          this.searchError.set(null); // Clear any previous error
        }
      });
  }

  //fetch current weather with given location
  fetchCurrent(location: string): void {
    this.http.get<CurrentWeatherInterface>(`/api/current.json?key=${this.apiKey}&q=${location}`)
      .pipe(
        catchError(error => {
          this.currentWeatherError.set(`Failed to fetch current weather. Error: ${error}`);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.currentWeather.set(response);
          this.currentWeatherError.set(null);
        }
      });
  }

  //fetch forecast weather with given location
  fetchForecast(location: string): void {
    this.http.get<ForecastWeatherInterface>(`/api/forecast.json?key=${this.apiKey}&q=${location}`)
      .pipe(
        catchError(error => {
          this.forecastWeatherError.set(`Failed to fetch weather forecast. Error: ${error}`);
          return of(null);
        })
      )
      .subscribe(response => {
        if (response) {
          this.forecastWeather.set(response);
          this.forecastWeatherError.set(null);
        }
      });
  }
}
