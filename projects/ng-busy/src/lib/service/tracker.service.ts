import {Injectable, EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs';

@Injectable()
export class TrackerService {
    promiseList: Array<Promise<any> | Subscription> = [];
    delayPromise: number | any;
    durationPromise: number | any;
    delayJustFinished = false;
    minDuration: number;

    private isBusyStarted = false;
    onStartBusy: EventEmitter<any>;
    onStopBusy: EventEmitter<any>;

    reset(options: IPromiseTrackerOptions) {
        this.minDuration = options.minDuration;

        this.promiseList = [];
        options.promiseList.forEach(promise => {
            if (!promise || promise['busyFulfilled']) {
                return;
            }
            this.addPromise(promise);
        });

        if (this.promiseList.length === 0) {
            return;
        }

        this.delayJustFinished = false;
        if (options.delay) {
            this.delayPromise = setTimeout(
                () => {
                    this.delayPromise = undefined;
                    this.delayJustFinished = true;
                },
                options.delay
            );
        }
        if (options.minDuration) {
            this.durationPromise = setTimeout(
                () => {
                    this.durationPromise = undefined;
                },
                options.minDuration + (options.delay || 0)
            );
        }
    }

    isActive() {
        let result;
        if (this.delayPromise) {
            result = false;
        } else {
            if (!this.delayJustFinished) {
                if (this.durationPromise) {
                    result = true;
                } else {
                    result = this.promiseList.length > 0;
                }
            } else {
                this.delayJustFinished = false;
                if (this.promiseList.length === 0) {
                    this.durationPromise = undefined;
                }
                result = this.promiseList.length > 0;
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
        if (this.promiseList.indexOf(promise) !== -1) {
            return;
        }

        this.promiseList.push(promise);

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
        const index = this.promiseList.indexOf(promise);
        if (index === -1) {
            return;
        }
        this.promiseList.splice(index, 1);
    }

}

export interface IPromiseTrackerOptions {
    minDuration: number;
    delay: number;
    promiseList: Promise<any>[];
}
