import { Injectable, signal } from '@angular/core';

export type DashTheme = 'ocean' | 'sunrise' | 'emerald';

const STORAGE_KEY = 'amrit-dash-theme';

export interface DashThemeOption {
  id: DashTheme;
  label: string;
  swatch: string;
}

export const DASH_THEME_OPTIONS: DashThemeOption[] = [
  { id: 'ocean', label: 'Ocean Breeze', swatch: 'linear-gradient(135deg, #38bdf8, #2dd4bf)' },
  { id: 'sunrise', label: 'Sunrise Gold', swatch: 'linear-gradient(135deg, #fbbf24, #fb7185)' },
  { id: 'emerald', label: 'Emerald Fresh', swatch: 'linear-gradient(135deg, #34d399, #22d3ee)' },
];

/**
 * Tracks which of the 3 light dashboard gradient themes is active, persisted
 * per-browser in localStorage. The dashboard layout binds the current value
 * to a `data-dash-theme` attribute on its root element; the corresponding
 * CSS custom properties (defined in styles.scss) then cascade down to every
 * component rendered inside it (sidebar, topbar, stat cards, tables, feature
 * pages) so switching themes restyles the whole authenticated area at once,
 * with no reload.
 */
@Injectable({ providedIn: 'root' })
export class DashThemeService {
  readonly theme = signal<DashTheme>(this.readStored());
  readonly options = DASH_THEME_OPTIONS;

  private readStored(): DashTheme {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === 'ocean' || v === 'sunrise' || v === 'emerald') return v;
    } catch {
      /* localStorage unavailable — fall through to default */
    }
    return 'ocean';
  }

  setTheme(theme: DashTheme): void {
    this.theme.set(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore persistence failures (private browsing, etc.) */
    }
  }
}
