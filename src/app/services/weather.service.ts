import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly url: string = environment.URL;
  private readonly apiKey: string = environment.API_KEY;

  constructor() { }

  getSearch(){

  }

  getCurrent(){

  }

  getForecast() {
    
  }
}
