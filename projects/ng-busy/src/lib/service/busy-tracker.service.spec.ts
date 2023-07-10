import {TestBed, inject, fakeAsync, tick} from '@angular/core/testing';

import {BusyTrackerService} from './busy-tracker.service';
import {Subscription} from 'rxjs/internal/Subscription';
import {Observable} from 'rxjs/internal/Observable';

const prepareOption = (delay: number, minDuration: number, busyList: Array<Promise<any> | Subscription>) => {
  return {
    minDuration: minDuration,
    delay: delay,
    busyList: busyList
  };
};
const createPromiseWithDelay = (delay: number): Promise<any> => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};
const createSubscriptionWithDelay = (delay: number): Subscription => {
  return new Observable((o) => {
    setTimeout(() => {
      o.next();
      o.complete();
    }, delay);
  }).subscribe(() => {});
};
describe('BusyTrackerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusyTrackerService]
    });
  });

  it('should be created', inject([BusyTrackerService], (service: BusyTrackerService) => {
    expect(service).toBeTruthy();
  }));

  it('after service init the isActive should be false', inject([BusyTrackerService], (service: BusyTrackerService) => {
    expect(service.isActive).toBe(false);
    expect(service.busyList.length).toBe(0);
  }));

  it('the options should work as expected', fakeAsync(inject([BusyTrackerService], (service: BusyTrackerService) => {
    service.load(prepareOption(200, 500, [createPromiseWithDelay(500)]));
    expect(service.isActive).toBe(false);
    tick(100);
    expect(service.isActive).toBe(false);
    tick(100);
    expect(service.isActive).toBe(true);
    tick(300);
    expect(service.isActive).toBe(true);
    tick(100);
    expect(service.isActive).toBe(true);
    tick(100);
    expect(service.isActive).toBe(false);
    expect(service.busyList.length).toBe(0);

    service.load(prepareOption(200, 100, [createPromiseWithDelay(500)]));
    expect(service.isActive).toBe(false);
    tick(100);
    expect(service.isActive).toBe(false);
    tick(100);
    expect(service.isActive).toBe(true);
    tick(150);
    expect(service.isActive).toBe(true);
    tick(150);
    expect(service.isActive).toBe(false);
    expect(service.busyList.length).toBe(0);

    service.load(prepareOption(0, 300, [createPromiseWithDelay(500)]));
    tick(0);
    expect(service.isActive).toBe(true);
    tick(200);
    expect(service.isActive).toBe(true);
    tick(150);
    expect(service.isActive).toBe(true);
    tick(150);
    expect(service.isActive).toBe(false);
    expect(service.busyList.length).toBe(0);

    service.load(prepareOption(0, 600, [createPromiseWithDelay(500)]));
    tick(0);
    expect(service.isActive).toBe(true);
    tick(200);
    expect(service.isActive).toBe(true);
    tick(150);
    expect(service.isActive).toBe(true);
    tick(150);
    expect(service.isActive).toBe(true);
    tick(100);
    expect(service.isActive).toBe(false);
    expect(service.busyList.length).toBe(0);

    service.load(prepareOption(200, 0, [createPromiseWithDelay(500)]));
    expect(service.isActive).toBe(false);
    tick(100);
    expect(service.isActive).toBe(false);
    tick(100);
    expect(service.isActive).toBe(true);
    tick(200);
    expect(service.isActive).toBe(true);
    tick(100);
    expect(service.isActive).toBe(false);
    expect(service.busyList.length).toBe(0);

    service.load(prepareOption(600, 0, [createPromiseWithDelay(500)]));
    expect(service.isActive).toBe(false);
    tick(300);
    expect(service.isActive).toBe(false);
    tick(240);
    expect(service.isActive).toBe(false);
    tick(60);
    expect(service.isActive).toBe(false);
    expect(service.busyList.length).toBe(0);
  })));

  it('after load empty busyList the isActive should be false', inject([BusyTrackerService], (service: BusyTrackerService) => {
    service.load(prepareOption(0, 0, []));
    expect(service.isActive).toBe(false);
    expect(service.busyList.length).toBe(0);
    service.load(prepareOption(10, 5, []));
    expect(service.isActive).toBe(false);
    expect(service.busyList.length).toBe(0);
  }));

  it('when there is only one busy after load the option the isActive should be true until the busy finished',
    inject([BusyTrackerService], fakeAsync((service: BusyTrackerService) => {
      const optionsWithPromise = prepareOption(0, 0, [createPromiseWithDelay(1000)]);
      service.load(optionsWithPromise);
      tick(0);
      expect(service.isActive).toBe(true);
      tick(100);
      expect(service.isActive).toBe(true);
      tick(300);
      expect(service.isActive).toBe(true);
      tick(400);
      expect(service.isActive).toBe(true);
      tick(200);
      expect(service.isActive).toBe(false);
      expect(service.busyList.length).toBe(0);

      const optionsWithSubscription = prepareOption(0, 0, [createSubscriptionWithDelay(1000)]);
      service.load(optionsWithSubscription);
      tick(0);
      expect(service.isActive).toBe(true);
      tick(100);
      expect(service.isActive).toBe(true);
      tick(300);
      expect(service.isActive).toBe(true);
      tick(400);
      expect(service.isActive).toBe(true);
      tick(200);
      expect(service.isActive).toBe(false);
      expect(service.busyList.length).toBe(0);
    })));

  it('the events should be triggered', inject([BusyTrackerService], fakeAsync((service: BusyTrackerService) => {
    let isStarted = false;
    let isStopped = true;
    service.active.subscribe((status) => {
      isStarted = status === true;
      isStopped = status === false;
    });
    const options = prepareOption(0, 0, [createPromiseWithDelay(1000)]);
    service.load(options);
    tick(500);
    expect(isStarted).toBe(true);
    expect(isStopped).toBe(false);
    tick(500);
    expect(isStarted).toBe(false);
    expect(isStopped).toBe(true);
    expect(service.busyList.length).toBe(0);
  })));

  it('when there are many busies', inject([BusyTrackerService], fakeAsync((service: BusyTrackerService) => {
    service.load(prepareOption(0, 0, [createPromiseWithDelay(100), createPromiseWithDelay(600), createPromiseWithDelay(200)]));
    tick(0);
    expect(service.isActive).toBe(true);
    tick(150);
    expect(service.isActive).toBe(true);
    tick(250);
    expect(service.isActive).toBe(true);
    tick(200);
    expect(service.isActive).toBe(false);
    expect(service.busyList.length).toBe(0);
  })));

  it('when load options many times and add busy dynamically', inject([BusyTrackerService], fakeAsync((service: BusyTrackerService) => {
    service.load(prepareOption(0, 0, [createPromiseWithDelay(100), createPromiseWithDelay(600), createPromiseWithDelay(200)]));
    expect(service.busyList.length).toBe(3);
    tick(0);
    expect(service.isActive).toBe(true);
    tick(150);
    expect(service.isActive).toBe(true);
    expect(service.busyList.length).toBe(2);
    tick(250);
    expect(service.busyList.length).toBe(1);
    service.load(prepareOption(0, 0, [createSubscriptionWithDelay(700), createPromiseWithDelay(500), createPromiseWithDelay(100)]));
    expect(service.busyList.length).toBe(4);
    expect(service.isActive).toBe(true);
    tick(200);
    expect(service.busyList.length).toBe(2);
    expect(service.isActive).toBe(true);
    tick(400);
    expect(service.busyList.length).toBe(1);
    expect(service.isActive).toBe(true);
    tick(100);
    expect(service.isActive).toBe(false);
    expect(service.busyList.length).toBe(0);
  })));
});
