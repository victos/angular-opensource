import {ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs/internal/Subscription';
import {NgBusyDirective} from '../../ng-busy.directive';
import {InstanceConfigHolderService} from '../../service/instance-config-holder.service';

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
  public disableAnimation = false;
  public showBackdrop = true;
  private readonly busyMonitor: Subscription;
  isActive = false;

  constructor(
    @Inject('instanceConfigHolder') private instanceConfigHolder: InstanceConfigHolderService,
    @Inject('busyEmitter') private busyEmitter: EventEmitter<boolean>,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.busyMonitor = this.busyEmitter.subscribe((isActive: boolean) => {
      const config = this.instanceConfigHolder.config;
      this.isActive = isActive;
      this.wrapperClass = config.wrapperClass;
      this.showBackdrop = config.backdrop;
      this.disableAnimation = config.disableAnimation;
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
