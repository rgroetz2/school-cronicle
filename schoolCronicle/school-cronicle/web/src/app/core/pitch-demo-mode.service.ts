import { Injectable } from '@angular/core';
import { isPitchDemoModeEnabled } from './demo-mode';

@Injectable({ providedIn: 'root' })
export class PitchDemoModeService {
  isEnabled(): boolean {
    return isPitchDemoModeEnabled();
  }
}
