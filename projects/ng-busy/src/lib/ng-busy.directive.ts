import {
  ApplicationRef,
  ComponentFactoryResolver, ComponentRef,
  Directive, DoCheck,
  ElementRef,
  EventEmitter, Injector,
  Input, OnDestroy,
  Output,
  Renderer2,
  TemplateRef, Type,
  ViewContainerRef, ViewRef
} from '@angular/core';
import { BusyTrackerService } from './service/busy-tracker.service';
import { BusyConfigHolderService } from './service/busy-config-holder.service';
import { Subscription } from 'rxjs';
import { IBusyConfig } from './model/busy-config';
import { NgBusyComponent } from './component/ng-busy/ng-busy.component';
import { InstanceConfigHolderService } from './service/instance-config-holder.service';
import { isPromise } from './util/isPromise';

@Directive({
  selector: '[ngBusy]',
  providers: [BusyTrackerService, InstanceConfigHolderService]
})
export class NgBusyDirective implements DoCheck, OnDestroy {
  @Input('ngBusy')
  set options(op) {
    this._option = op;
  }

  get options() {
    return this._option;
  }

  @Output() busyStart = new EventEmitter();
  @Output() busyStop = new EventEmitter();
  private optionsNorm: IBusyConfig;
  private busyRef: ComponentRef<NgBusyComponent>;
  private componentViewRef: ViewRef;
  private onStartSubscription: Subscription;
  private onStopSubscription: Subscription;
  private isLoading = false;
  private busyEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  public template: TemplateRef<any> | Type<any>;
  public templateNgStyle: {};
  private _option: any;

  constructor(private configHolder: BusyConfigHolderService,
    private instanceConfigHolder: InstanceConfigHolderService,
    private resolver: ComponentFactoryResolver,
    private tracker: BusyTrackerService,
    private appRef: ApplicationRef,
    private vcr: ViewContainerRef,
    private element: ElementRef,
    private renderer: Renderer2,
    private injector: Injector) {
    this.onStartSubscription = tracker.onStartBusy.subscribe(() => {
      setTimeout(() => {
        this.recreateBusyIfNecessary();
        this.isLoading = true;
        this.busyEmitter.emit(this.isLoading);
        this.busyStart.emit();
      }, 0);
    });
    this.onStopSubscription = tracker.onStopBusy.subscribe(() => {
      this.isLoading = false;
      this.busyEmitter.emit(this.isLoading);
      this.busyStop.emit();
      if (this.componentViewRef) {
        this.appRef.detachView(this.componentViewRef);
        this.componentViewRef.destroy();
      }
    });
  }

  ngDoCheck() {
    this.optionsNorm = this.normalizeOptions(this.options);
    this.instanceConfigHolder.config = this.optionsNorm;
    this.tracker.load({
      busyList: this.optionsNorm.busy,
      delay: this.optionsNorm.delay,
      minDuration: this.optionsNorm.minDuration
    });
  }

  ngOnDestroy() {
    this.destroyComponents();
    this.onStartSubscription.unsubscribe();
    this.onStopSubscription.unsubscribe();
  }

  private recreateBusyIfNecessary() {
    if (!this.busyRef
      || this.template !== this.optionsNorm.template
      || this.templateNgStyle !== this.optionsNorm.templateNgStyle
    ) {
      this.destroyComponents();
      this.template = this.optionsNorm.template;
      this.templateNgStyle = this.optionsNorm.templateNgStyle;
      this.createBusy();
      this.busyEmitter.emit(this.isLoading);
    }
  }

  private normalizeOptions(options: any): IBusyConfig {
    if (!options) {
      options = { busy: [] };
    } else if (Array.isArray(options)
      || isPromise(options)
      || options instanceof Subscription
    ) {
      options = { busy: options };
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
    if (this.componentViewRef) {
      this.appRef.detachView(this.componentViewRef);
    }
  }

  private createBusy() {
    const factory = this.resolver.resolveComponentFactory(NgBusyComponent);
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
    this.busyRef = this.vcr.createComponent(factory, 0, injector, this.generateNgContent(injector));
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
    const factory = this.resolver.resolveComponentFactory(this.template);
    const componentRef = factory.create(injector);
    componentRef.instance.templateNgStyle = this.options.templateNgStyle;
    this.componentViewRef = componentRef.hostView;
    this.appRef.attachView(this.componentViewRef);
    return [[componentRef.location.nativeElement]];
  }

}
