import { Injectable } from '@angular/core';
import {IBusyConfig} from '../model/busy-config';

@Injectable({
  providedIn: 'any'
})
export class InstanceConfigHolderService {
  public config: IBusyConfig;
  constructor() { }
}
