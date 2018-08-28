import { TestBed, inject } from '@angular/core/testing';

import { InstanceConfigHolderService } from './instance-config-holder.service';

describe('InstanceConfigHolderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstanceConfigHolderService]
    });
  });

  it('should be created', inject([InstanceConfigHolderService], (service: InstanceConfigHolderService) => {
    expect(service).toBeTruthy();
  }));
});
