import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CursorFxComponent } from './shared/components/cursor-fx/cursor-fx.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CursorFxComponent],
  template: `<app-cursor-fx></app-cursor-fx><router-outlet />`,
})
export class AppComponent {}
