import {Injectable, Optional} from '@angular/core';

import {BusyConfig} from '../model/busy-config';

@Injectable()
export class BusyService {
    config: BusyConfig;

    constructor(@Optional() config: BusyConfig) {
        this.config = config || new BusyConfig();
    }
}
