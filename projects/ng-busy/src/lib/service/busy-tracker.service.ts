import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/index';

export interface TrackerOptions {
  minDuration: number;
  delay: number;
  busyList: Array<Promise<any> | Subscription>;
}

@Injectable({
  providedIn: 'root'
})
export class BusyTrackerService implements OnDestroy {

  private busyQueue: Array<Promise<any> | Subscription> = [];
  private delayTimer: any = undefined;
  private durationTimer: any = undefined;
  private __isActive = false;
  private onDelayDone: EventEmitter<any> = new EventEmitter<any>();
  private onMinDurationDone: EventEmitter<any> = new EventEmitter<any>();

  onStartBusy: EventEmitter<any>;
  onStopBusy: EventEmitter<any>;
  onCheckPending = new EventEmitter();

  get isActive(): boolean {
    return this.__isActive;
  }

  set isActive(val: boolean) {
    if (this.__isActive === false && val === true) {
      this.onStartBusy.emit();
    }
    if (this.__isActive === true && val === false) {
      this.onStopBusy.emit();
    }
    this.__isActive = val;
    this.onCheckPending.emit();
  }

  constructor() {
    this.onDelayDone.subscribe(() => {
      this.delayTimer = undefined;
      this.isActive = this.busyQueue.length > 0;
    });
    this.onMinDurationDone.subscribe(() => {
      this.durationTimer = undefined;
      this.isActive = this.busyQueue.length > 0;
    });
  }

  load(options: TrackerOptions) {
    this.loadBusyQueue(options.busyList);
    this.startLoading(options);
  }

  private checkActiveStatus() {
    const queueLength = this.busyQueue.length;
    if (queueLength === 0) {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
      }
      if (this.durationTimer) {
        clearTimeout(this.durationTimer);
      }
    }
    this.isActive = queueLength > 0;
  }

  private startLoading(options: TrackerOptions) {
    if (this.busyQueue.length === 0 || this.isActive) {
      return;
    }
    this.startDelay(options.delay);
    this.startMinDuration(options.minDuration, options.delay);
  }

  private startDelay(delay: number) {
    if (delay) {
      this.delayTimer = setTimeout(
        () => {
          this.onDelayDone.emit();
        },
        delay
      );
    }
  }

  private startMinDuration(duration: number, delay: number) {
    if (duration) {
      this.durationTimer = setTimeout(
        () => {
          this.onMinDurationDone.emit();
        },
        duration + (delay || 0)
      );
    }
  }

  private loadBusyQueue(busyList: Array<Promise<any> | Subscription>) {
    this.busyQueue = [];
    busyList.filter((busy) => busy && !busy['__load_complete_mark_by_ng_busy'] && this.busyQueue.indexOf(busy) < 0)
      .forEach(busy => {
        this.addToBusyQueue(busy);
    });
  }

  private addToBusyQueue(busy: Promise<any> | Subscription) {
    this.busyQueue.push(busy);
    if (busy instanceof Promise) {
      busy.then.call(
        busy,
        () => this.onBusyComplete(busy),
        () => this.onBusyComplete(busy)
      );
    } else {
      busy.add(() => this.onBusyComplete(busy));
    }
  }

  private onBusyComplete(busy: Promise<any> | Subscription) {
    Object.defineProperty(busy, '__load_complete_mark_by_ng_busy', {
      value: true,
      configurable: false,
      enumerable: false,
      writable: false
    });
    const index = this.busyQueue.indexOf(busy);
    if (index >= 0) {
      this.busyQueue.splice(index, 1);
    }
    this.checkActiveStatus();
  }

  ngOnDestroy(): void {
  }
}
