import {ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs/internal/Subscription';

const inactiveStyle = style({
  opacity: 0
});
const timing = '.3s ease';

@Component({
  selector: 'lib-ng-busy-backdrop',
  templateUrl: './ng-busy-backdrop.component.html',
  styleUrls: ['./ng-busy-backdrop.component.css'],
  animations: [
    trigger('fadeInOut', [
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
export class NgBusyBackdropComponent implements OnDestroy {

  private readonly busyMonitor: Subscription;
  isActive = false;

  constructor(@Inject('busyEmitter') private busyEmitter: EventEmitter<boolean>,
              private readonly cdr: ChangeDetectorRef) {
    this.busyMonitor = this.busyEmitter.subscribe((isActive: boolean) => {
      this.isActive = isActive;
      if (this.cdr) {
        this.cdr.markForCheck();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.busyMonitor) {
      this.busyMonitor.unsubscribe();
    }
  }

}
