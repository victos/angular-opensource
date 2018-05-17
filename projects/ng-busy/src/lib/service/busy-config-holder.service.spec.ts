import { TestBed, inject } from '@angular/core/testing';

import { BusyConfigHolderService } from './busy-config-holder.service';
import {BusyConfig} from '../model/busy-config';

describe('BusyConfigHolderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusyConfigHolderService, {provide: BusyConfig, useValue: {message: 'the message should be this'}}]
    });
  });

  it('should be created', inject([BusyConfigHolderService], (service: BusyConfigHolderService) => {
    expect(service).toBeTruthy();
  }));

  it('should load BusyConfig', inject([BusyConfigHolderService], (service: BusyConfigHolderService) => {
    expect(service.config.message).toBe('the message should be this');
  }));
});
