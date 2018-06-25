import {Injectable, Optional} from '@angular/core';
import {BUSY_CONFIG_DEFAULTS, BusyConfig} from '../model/busy-config';

@Injectable({
  providedIn: 'root'
})
export class BusyConfigHolderService {
  config: BusyConfig;

  constructor(@Optional() config: BusyConfig) {
    this.config = Object.assign(BUSY_CONFIG_DEFAULTS, config || new BusyConfig());
  }
}
