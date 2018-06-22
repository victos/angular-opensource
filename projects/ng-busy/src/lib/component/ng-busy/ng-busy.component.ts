import {Component, EventEmitter, Inject, OnDestroy} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs/internal/Subscription';

const inactiveStyle = style({
  opacity: 0,
  transform: 'translateY(-40px)'
});
const timing = '.3s ease';

@Component({
  selector: 'lib-ng-busy',
  templateUrl: './ng-busy.component.html',
  styleUrls: ['./ng-busy.component.css'],
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
export class NgBusyComponent implements OnDestroy {

  public wrapperClass: string;
  private readonly busyMonitor: Subscription;
  isActive = false;

  constructor(
    @Inject('busyConfig') private config: any,
    @Inject('busyEmitter') private busyEmitter: EventEmitter<boolean>
  ) {
    this.wrapperClass = this.config.wrapperClass;
    this.busyMonitor = this.busyEmitter.subscribe((isActive: boolean) => {
      this.isActive = isActive;
    });
  }

  ngOnDestroy(): void {
    if (this.busyMonitor) {
      this.busyMonitor.unsubscribe();
    }
  }

}
