import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LocationService {

  constructor() { }

  fetchLocations(query: string, callback: (results: google.maps.places.AutocompletePrediction[]) => void): void {
    const service = new google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: query }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        callback(results);
      } 
      else {
        callback([]);
      }
    });
  }
}
