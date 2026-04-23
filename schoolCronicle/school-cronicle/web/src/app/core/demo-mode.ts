import { isDevMode } from '@angular/core';

/**
 * Pitch/demo reset is available in dev builds, or when the presenter sets
 * `sessionStorage.setItem('sc_pitch_demo', '1')` (e.g. constrained staging).
 */
export function isPitchDemoModeEnabled(): boolean {
  try {
    if (typeof globalThis.sessionStorage === 'undefined') {
      return isDevMode();
    }
    return isDevMode() || globalThis.sessionStorage.getItem('sc_pitch_demo') === '1';
  } catch {
    return isDevMode();
  }
}
