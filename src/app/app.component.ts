import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './helper/material/material.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MaterialModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly renderer: Renderer2 = inject(Renderer2);
  private readonly document: Document = inject(DOCUMENT);
  
  constructor(){}

  ngOnInit(): void {
      this.setDarkTheme();
  }

  setDarkTheme() {
    this.renderer.removeClass(this.document.body, 'light');
    this.renderer.addClass(this.document.body, 'dark');
  }

  setLightTheme() {
    this.renderer.removeClass(this.document.body, 'dark');
    this.renderer.addClass(this.document.body, 'light');
  }
}
