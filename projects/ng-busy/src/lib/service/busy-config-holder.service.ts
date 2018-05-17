import {Injectable, Optional} from '@angular/core';
import {BusyConfig} from '../model/busy-config';

@Injectable({
  providedIn: 'root'
})
export class BusyConfigHolderService {
  config: BusyConfig;

  constructor(@Optional() config: BusyConfig) {
    this.config = config || new BusyConfig();
  }
}
