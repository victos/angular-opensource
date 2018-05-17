import {ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs/internal/Subscription';
import {BusyTrackerService} from '../../service/busy-tracker.service';
import {BusyConfigHolderService} from '../../service/busy-config-holder.service';

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
  sub: Subscription = new Subscription();

  get isActive(): boolean {
    return this.tracker.isActive;
  }

  constructor(
    @Inject('busyConfig') private config: any,
    private tracker: BusyTrackerService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.wrapperClass = this.config.wrapperClass;
    this.sub.add(this.tracker.onCheckPending.subscribe(() => {
      if (this.cdr) {
        this.cdr.markForCheck();
      }
    }));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
