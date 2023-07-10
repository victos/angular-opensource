import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject, Observable, Subject, tap,
  Subscription, concatAll, forkJoin, from, of,
  takeUntil, timer, finalize, map, take,
  filter, iif, mergeMap, switchMap, EMPTY
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
  private progress: Subject<any> = new Subject<any>();
  private destroyIndicator: Subject<any> = new Subject<any>();
  private processingIndicator: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  active: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get isActive(): boolean {
    return this.active.value;
  }

  get busyList() {
    return [...this.busyQueue];
  }

  constructor() {
    this.reset();
    this.operations.pipe(takeUntil(this.destroyIndicator), concatAll()).subscribe();
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
      ));
    this.operations.next(
      this.processingIndicator.pipe(take(1), mergeMap(v => iif(
        () => v === false && this.busyQueue.filter(b => !b.closed).length > 0,
        of(options.delay || 0).pipe(
          tap(() => {
            this.processingIndicator.next(true);
          }),
          switchMap((c) => timer(c).pipe(
            tap(() => this.active.next(true)),
            map(() => this.busyQueue.filter(b => !b.closed).length),
            mergeMap((c) => iif(
              () => c === 0 && (options.minDuration || 0) === 0,
              EMPTY.pipe(finalize(() => this.reset())),
              EMPTY.pipe(finalize(() => {
                forkJoin([this.progress.pipe(take(1)), timer(options.minDuration || 0)])
                  .pipe(finalize(() => this.reset())).subscribe();
              }))
            ))
          ))),
        EMPTY)))
    );
  }

  private updateActiveStatus() {
    this.busyQueue = this.busyQueue.filter((cur: Subscription) => cur && !cur.closed);
    if (this.busyQueue.length === 0) {
      this.progress.next(null);
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
