import { Injectable } from '@angular/core';
import {IBusyConfig} from '../model/busy-config';

@Injectable({
  providedIn: 'root'
})
export class InstanceConfigHolderService {
  public config: IBusyConfig;
  constructor() { }
}
