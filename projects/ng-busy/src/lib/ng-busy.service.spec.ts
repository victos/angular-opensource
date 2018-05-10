import { TestBed, inject } from '@angular/core/testing';

import { NgBusyService } from './ng-busy.service';

describe('NgBusyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgBusyService]
    });
  });

  it('should be created', inject([NgBusyService], (service: NgBusyService) => {
    expect(service).toBeTruthy();
  }));
});
