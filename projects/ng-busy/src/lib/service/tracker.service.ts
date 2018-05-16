import {Injectable, EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs';

export interface IPromiseTrackerOptions {
  minDuration: number;
  delay: number;
  busyList: Promise<any>[];
}

@Injectable()
export class TrackerService {
  busyList: Array<Promise<any> | Subscription> = [];
  delayTimer: any;
  durationTimer: any;
  delayJustFinished = false;
  minDuration: number;

  private isBusyStarted = false;
  onStartBusy: EventEmitter<any>;
  onStopBusy: EventEmitter<any>;

  onCheckPending = new EventEmitter();

  reset(options: IPromiseTrackerOptions) {
    this.minDuration = options.minDuration;

    this.busyList = [];
    options.busyList.forEach(promise => {
      if (!promise || promise['busyFulfilled']) {
        return;
      }
      this.addPromise(promise);
    });

    if (this.busyList.length === 0) {
      return;
    }

    this.delayJustFinished = false;
    if (options.delay) {
      this.delayTimer = setTimeout(
        () => {
          this.delayTimer = undefined;
          this.delayJustFinished = true;
          if (this.busyList.length === 0) {
            this.onCheckPending.emit();
          }
        },
        options.delay
      );
    }
    if (options.minDuration) {
      this.durationTimer = setTimeout(
        () => {
          this.durationTimer = undefined;
          if (this.busyList.length === 0) {
            this.onCheckPending.emit();
          }
        },
        options.minDuration + (options.delay || 0)
      );
    }
  }

  isActive() {
    let result;
    if (this.delayTimer) {
      result = false;
    } else {
      if (!this.delayJustFinished) {
        if (this.durationTimer) {
          result = true;
        } else {
          result = this.busyList.length > 0;
        }
      } else {
        this.delayJustFinished = false;
        if (this.busyList.length === 0) {
          this.durationTimer = undefined;
        }
        result = this.busyList.length > 0;
      }
    }
    if (result === false && this.isBusyStarted) {
      this.onStopBusy.emit();
      this.isBusyStarted = false;
    } else if (result === true && !this.isBusyStarted) {
      this.onStartBusy.emit();
      this.isBusyStarted = true;
    }
    return result;
  }

  private addPromise(promise: Promise<any> | Subscription) {
    if (this.busyList.indexOf(promise) !== -1) {
      return;
    }

    this.busyList.push(promise);

    if (promise instanceof Promise) {
      promise.then.call(
        promise,
        () => this.finishPromise(promise),
        () => this.finishPromise(promise)
      );
    } else {
      promise.add(() => this.finishPromise(promise));
    }
  }

  private finishPromise(promise: Promise<any> | Subscription) {
    promise['busyFulfilled'] = true;
    const index = this.busyList.indexOf(promise);
    if (index === -1) {
      return;
    }
    this.busyList.splice(index, 1);
    if (!this.durationTimer) {
      this.onCheckPending.emit();
    }
  }

}
