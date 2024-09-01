import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../helper/material.module';
import { LocationService } from '../services/location.service';
import { MatOption } from '@angular/material/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ThemeService } from '../services/theme.service';
import { TempUnitService } from '../services/tempunit.service';

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

  locationQuery: string = ''; // Bound to ngModel
  filteredLocations: Array<google.maps.places.AutocompletePrediction> = [];  //autocomplete location list

  constructor( ) {}

  ngOnInit(): void {
      
  }

  onUnitChange(): void{
    if(this.tempUnitService.unitSignal() === 'cel'){
      this.tempUnitService.setUnit('far');
    }
    else{
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
  }
}
