import { Component, effect, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './helper/material.module';
import { HeaderComponent } from './header/header.component';
import { ThemeService } from './services/theme.service';
import { TempUnitService } from './services/tempunit.service';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MaterialModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly document: Document = inject(DOCUMENT);
  private readonly themeService: ThemeService = inject(ThemeService);
  private readonly tempUnitService: TempUnitService = inject(TempUnitService);
  readonly weatherService: WeatherService = inject(WeatherService)


  constructor() {
    // Reactively watch for changes
    effect(() => {
      this.checkTheme();
      this.checkTempUnit();
    });
  }

  ngOnInit(): void {

  }

  //theme
  private checkTheme(): void {
    if (this.themeService.isThemeLight()) {
      this.setLightTheme();
    }
    else {
      this.setDarkTheme();
    }
  }

  private setDarkTheme(): void {
    this.renderer.removeClass(this.document.body, 'light');
    this.renderer.addClass(this.document.body, 'dark');
  }

  private setLightTheme(): void {
    this.renderer.removeClass(this.document.body, 'dark');
    this.renderer.addClass(this.document.body, 'light');
  }

  //temp unit
  private checkTempUnit(): void {
    console.log(this.tempUnitService.unitSignal());
  }
}
