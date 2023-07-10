import { ChangeDetectorRef, Component, EventEmitter, Inject, OnDestroy, ViewContainerRef } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { InstanceConfigHolderService } from '../../service/instance-config-holder.service';
import { Subject, takeUntil } from 'rxjs';

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
  private destroyIndicator = new Subject<any>();
  public show = new Subject<boolean>();

  constructor(
    @Inject('instanceConfigHolder') private instanceConfigHolder: InstanceConfigHolderService,
    @Inject('busyEmitter') public busyEmitter: EventEmitter<boolean>,
    public vcr: ViewContainerRef,
    private cdr: ChangeDetectorRef,
  ) {
    this.show.pipe(takeUntil(this.destroyIndicator)).subscribe(() => {
      this.cdr.detectChanges();
    });
    this.busyEmitter.pipe(takeUntil(this.destroyIndicator))
      .subscribe((isActive: boolean) => {
        if (isActive === true) {
          const config = this.instanceConfigHolder.config;
          this.wrapperClass = config.wrapperClass;
          this.showBackdrop = config.backdrop;
          this.disableAnimation = config.disableAnimation;
        }
        this.show.next(isActive);
      });
  }

  ngOnDestroy(): void {
    this.destroyIndicator.next(null);
  }

}
