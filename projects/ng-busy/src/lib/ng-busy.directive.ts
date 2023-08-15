import {
  ChangeDetectorRef,
  ComponentRef,
  Directive, DoCheck,
  EventEmitter, Injector,
  Input, OnDestroy,
  Output,
  Renderer2,
  TemplateRef, Type,
  ViewContainerRef
} from '@angular/core';
import { BusyTrackerService } from './service/busy-tracker.service';
import { BusyConfigHolderService } from './service/busy-config-holder.service';
import { Subject, Subscription, distinctUntilChanged, skip, takeUntil } from 'rxjs';
import { IBusyConfig } from './model/busy-config';
import { NgBusyComponent } from './component/ng-busy/ng-busy.component';
import { InstanceConfigHolderService } from './service/instance-config-holder.service';
import { isPromise } from './util/isPromise';

@Directive({
  selector: '[ngBusy]',
  providers: [BusyTrackerService, InstanceConfigHolderService],
  exportAs: 'ngBusy'
})
export class NgBusyDirective implements DoCheck, OnDestroy {
  @Input('ngBusy')
  set options(op) {
    this._option = op;
  }

  get options() {
    return this._option;
  }

  get trackerService() {
    return this.tracker;
  }

  @Output() busyStart = new EventEmitter();
  @Output() busyStop = new EventEmitter();
  private _option: any;
  private optionsNorm: IBusyConfig;
  private busyRef: ComponentRef<NgBusyComponent>;
  private destroyIndicator: Subject<any> = new Subject<any>();
  private configLoader: Subject<IBusyConfig> = new Subject<IBusyConfig>();
  private busyEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  public template: TemplateRef<any> | Type<any>;
  public templateNgStyle: {};

  constructor(private configHolder: BusyConfigHolderService,
    private instanceConfigHolder: InstanceConfigHolderService,
    private tracker: BusyTrackerService,
    private cdr: ChangeDetectorRef,
    private vcr: ViewContainerRef,
    private renderer: Renderer2,
    private injector: Injector) {
    tracker.active.pipe(skip(1), takeUntil(this.destroyIndicator), distinctUntilChanged()).subscribe((status) => {
      if (status === true) {
        this.recreateBusyIfNecessary();
        this.busyStart.emit();
      } else {
        this.busyStop.emit();
      }
      this.busyEmitter.next(status);
    });
    this.configLoader.pipe(takeUntil(this.destroyIndicator)).subscribe((config) => {
      const busyList = config.busy.filter(b => b?.['closed'] !== true && !b?.hasOwnProperty?.('__loaded_mark_by_ng_busy'));
      this.optionsNorm = config;
      this.instanceConfigHolder.config = this.optionsNorm;
      if (busyList.length > 0) {
        this.tracker.load({
          busyList, delay: this.optionsNorm.delay,
          minDuration: this.optionsNorm.minDuration
        });
      }
    });
  }

  ngDoCheck() {
    this.configLoader.next(this.normalizeOptions(this.options));
  }

  ngOnDestroy() {
    this.destroyIndicator.next(null);
  }

  private recreateBusyIfNecessary() {
    this.destroyComponents();
    this.template = this.optionsNorm.template;
    this.templateNgStyle = this.optionsNorm.templateNgStyle;
    this.createBusy();
  }

  private normalizeOptions(options: any): IBusyConfig {
    if (!options) {
      options = { busy: [] };
    } else if (Array.isArray(options)) {
      options = { busy: options };
    } else if (isPromise(options) || options instanceof Subscription) {
      options = { busy: [options] }
    }
    options = Object.assign({}, this.configHolder.config, options);
    if (!Array.isArray(options.busy)) {
      options.busy = [options.busy];
    }
    return options;
  }

  private destroyComponents() {
    if (this.busyRef) {
      this.busyRef.destroy();
    }
  }

  private createBusy() {
    const injector = Injector.create({
      providers: [
        {
          provide: 'instanceConfigHolder',
          useValue: this.instanceConfigHolder
        },
        {
          provide: 'busyEmitter',
          useValue: this.busyEmitter
        }
      ], parent: this.injector
    });
    this.template = this.optionsNorm.template;
    this.busyRef = this.vcr.createComponent(NgBusyComponent, { injector, projectableNodes: this.generateNgContent(injector) });
    this.busyRef.onDestroy(() => {
      this.busyRef.instance.ngOnDestroy();
    });
    this.cdr.markForCheck();
    this.busyRef.hostView.detectChanges();
  }

  private generateNgContent(injector: Injector) {
    if (typeof this.template === 'string') {
      const element = this.renderer.createText(this.template);
      return [[element]];
    }
    if (this.template instanceof TemplateRef) {
      const context = {};
      const viewRef = this.template.createEmbeddedView(context);
      return [viewRef.rootNodes];
    }
    if (typeof this.template === 'function') {
      const factory = this.vcr.createComponent(this.template, { injector });
      factory.onDestroy(() => {
        factory?.instance?.ngOnDestroy?.();
      });
      factory.changeDetectorRef.markForCheck();
      return [[factory.location.nativeElement]];
    }
    return [[]];
  }

}