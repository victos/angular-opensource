import {Component, Directive, ViewChild, ElementRef, Inject, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {trigger, style, transition, animate} from '@angular/animations';

import {TrackerService} from '../service/tracker.service';
import {Subscription} from 'rxjs/internal/Subscription';


const inactiveStyle = style({
    opacity: 0,
    transform: 'translateY(-40px)'
});
const timing = '.3s ease';

export interface IBusyContext {
    message: string;
}

@Directive({
    selector: '[busy-container]'
})
export class BusyContainerDirective {
}

@Component({
    selector: 'ng-busy',
    template: `
        <div [class]="wrapperClass" @flyInOut busy-container *ngIf="isActive()">
            <ng-content></ng-content>
        </div>
    `,
    animations: [
        trigger('flyInOut', [
            transition('void => *', [
                inactiveStyle,
                animate(timing)
            ]),
            transition('* => void', [
                animate(timing, inactiveStyle)
            ])
        ])
    ]
})
export class BusyComponent implements OnDestroy {
  public wrapperClass: string;
  sub: Subscription = new Subscription();

  @ViewChild(BusyContainerDirective, {read: ElementRef}) private busyContainer: ElementRef;

  constructor(
    @Inject('busyConfig') private config: any,
    private tracker: TrackerService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.wrapperClass = this.config.wrapperClass;
    this.sub.add(this.tracker.onCheckPending.subscribe(() => {
      if (this.cdr) {
        this.cdr.markForCheck();
      }
    }));
  }

  isActive() {
    return this.tracker.isActive();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
