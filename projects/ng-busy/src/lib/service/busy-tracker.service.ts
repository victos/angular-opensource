import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject, Observable, Subject, tap,
  Subscription, concatAll, from, takeUntil,
  timer, map, take, filter, combineLatest
} from 'rxjs';
import { isPromise } from '../util/isPromise';

export interface TrackerOptions {
  minDuration: number;
  delay: number;
  busyList: Array<Promise<any> | Subscription>;
}

@Injectable({
  providedIn: 'any'
})
export class BusyTrackerService implements OnDestroy {

  private busyQueue: Array<Subscription> = [];
  private operations: Subject<Observable<any>> = new Subject<Observable<any>>();
  private busyDone: Subject<any> = new Subject<any>();
  private destroyIndicator: Subject<any> = new Subject<any>();
  private checkSubject: Subject<TrackerOptions> = new Subject<TrackerOptions>();
  private processingIndicator: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  active: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isActive(): boolean {
    return this.active.value;
  }

  get busyList() {
    return [...this.busyQueue];
  }

  get isBusy() {
    return this.busyQueue.filter(b => !b.closed).length > 0;
  }

  constructor() {
    this.reset();
    this.operations.pipe(takeUntil(this.destroyIndicator), concatAll()).subscribe();
    this.checkSubject.pipe(takeUntil(this.destroyIndicator)).subscribe((options) => {
      this.processingIndicator.pipe(take(1)).subscribe((isProcessing) => {
        if (isProcessing === false && this.isBusy) {
          this.processingIndicator.next(true);
          timer(options.delay || 0).pipe(map(() => this.isBusy)).subscribe((stillBusy) => {
            if (stillBusy) {
              this.active.next(stillBusy);
              combineLatest([this.busyDone, timer(options.minDuration || 0)])
              .pipe(takeUntil(this.active.pipe(filter(a => a === false))))
              .subscribe(() => {
                this.operations.next(new Observable((subscriber) => {
                  if (!this.isBusy) {
                    this.reset();
                  }
                  subscriber.complete();
                }));
              });
            } else {
              this.processingIndicator.next(false);
            }
          });
        }
      });
    });
  }

  load(options: TrackerOptions) {
    this.operations.next(
      from(options.busyList).pipe(
        filter(busy => busy !== null && busy !== undefined && !busy.hasOwnProperty('__loaded_mark_by_ng_busy')),
        tap((busy) => Object.defineProperty(busy, '__loaded_mark_by_ng_busy', {
          value: true, configurable: false, enumerable: false, writable: false
        })),
        map((busy) => isPromise(busy) ? from(busy).subscribe() : busy),
        tap(subscription => this.appendToQueue(subscription))
      )
    );
    this.checkSubject.next(options);
  }

  private updateActiveStatus() {
    this.busyQueue = this.busyQueue.filter((cur: Subscription) => cur && !cur.closed);
    if (this.busyQueue.length === 0) {
      this.busyDone.next(true);
    }
  }

  private reset() {
    this.active.next(false);
    this.busyQueue = [];
    this.processingIndicator.next(false);
  }

  private appendToQueue(busy: Subscription) {
    this.busyQueue.push(busy);
    busy.add(() => {
      this.operations.next(new Observable((subscriber) => {
        this.updateActiveStatus();
        subscriber.complete();
      }));
    });
  }

  ngOnDestroy(): void {
    this.destroyIndicator.next(null);
  }
}
