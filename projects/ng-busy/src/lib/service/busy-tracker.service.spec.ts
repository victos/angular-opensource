import { TestBed, inject } from '@angular/core/testing';

import { BusyTrackerService } from './busy-tracker.service';

describe('BusyTrackerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusyTrackerService]
    });
  });

  it('should be created', inject([BusyTrackerService], (service: BusyTrackerService) => {
    expect(service).toBeTruthy();
  }));
});
