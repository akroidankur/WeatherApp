import { Component, effect, inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './helper/material.module';
import { HeaderComponent } from './header/header.component';
import { ThemeService } from './services/theme.service';
import { WeatherService } from './services/weather.service';
import { WeatherUiComponent } from "./weather-ui/weather-ui.component";
import { WidthService } from './services/width.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, HeaderComponent, WeatherUiComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly document: Document = inject(DOCUMENT);
  private readonly themeService: ThemeService = inject(ThemeService);
  readonly weatherService: WeatherService = inject(WeatherService);

  constructor() {
    // Reactively watch for changes
    effect(() => {
      this.checkTheme();
    });
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
}
