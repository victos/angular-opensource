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
  ViewContainerRef
} from '@angular/core';
import {equals} from './tools/util';
import {ViewRef} from '@angular/core/src/linker/view_ref';
import {BusyTrackerService} from './service/busy-tracker.service';
import {BusyConfigHolderService} from './service/busy-config-holder.service';
import {Subscription} from 'rxjs';
import {IBusyConfig} from './model/busy-config';
import {NgBusyComponent} from './component/ng-busy/ng-busy.component';
import {NgBusyBackdropComponent} from './component/ng-busy-backdrop/ng-busy-backdrop.component';

@Directive({
  selector: '[ngBusy]'
})
export class NgBusyDirective implements DoCheck, OnDestroy {
  @Input('ngBusy') options: any;
  @Output() busyStart = new EventEmitter();
  @Output() busyStop = new EventEmitter();
  private optionsRecorded: IBusyConfig;
  private optionsNorm: IBusyConfig;
  private busyRef: ComponentRef<NgBusyComponent>;
  private backdropRef: ComponentRef<NgBusyBackdropComponent>;
  private componentViewRef: ViewRef;
  public template: TemplateRef<any> | Type<any>;
  public backdrop: boolean;

  constructor(private configHolder: BusyConfigHolderService,
              private resolver: ComponentFactoryResolver,
              private tracker: BusyTrackerService,
              private appRef: ApplicationRef,
              private vcr: ViewContainerRef,
              private element: ElementRef,
              private renderer: Renderer2,
              private injector: Injector) {
    tracker.onStartBusy = this.busyStart;
    tracker.onStopBusy = this.busyStop;
  }

  ngDoCheck() {
    const options: IBusyConfig = this.optionsNorm = this.normalizeOptions(this.options);

    if (!this.isOptionsChanged()) {
      return;
    }
    if (!equals(options.busy, this.tracker.busyList)) {
      this.tracker.load({
        busyList: options.busy,
        delay: options.delay,
        minDuration: options.minDuration
      });
    }

    if (!this.busyRef
      || this.template !== options.template
      || this.backdrop !== options.backdrop
    ) {
      this.destroyComponents();

      this.template = options.template;
      this.backdrop = options.backdrop;

      if (options.backdrop) {
        this.createBackdrop();
      }

      this.createBusy();
    }
  }

  ngOnDestroy() {
    this.destroyComponents();
  }

  private normalizeOptions(options: any): IBusyConfig {
    if (!options) {
      options = {busy: undefined};
    } else if (Array.isArray(options)
      || options instanceof Promise
      || options instanceof Subscription
    ) {
      options = {busy: options};
    }
    options = Object.assign({}, this.configHolder.config, options);
    if (!Array.isArray(options.busy)) {
      options.busy = [options.busy];
    }

    return options;
  }

  private isOptionsChanged() {
    if (equals(this.optionsNorm, this.optionsRecorded)) {
      return false;
    }
    this.optionsRecorded = this.optionsNorm;
    return true;
  }

  private destroyComponents() {
    if (this.busyRef) {
      this.busyRef.destroy();
    }
    if (this.backdropRef) {
      this.backdropRef.destroy();
    }
    if (this.componentViewRef) {
      this.appRef.detachView(this.componentViewRef);
    }
  }

  private createBackdrop() {
    const backdropFactory = this.resolver.resolveComponentFactory(NgBusyBackdropComponent);
    this.backdropRef = this.vcr.createComponent(backdropFactory, undefined, this.injector);
  }

  private createBusy() {
    const factory = this.resolver.resolveComponentFactory(NgBusyComponent);
    const injector = Injector.create({
      providers: [
        {
          provide: 'busyConfig',
          useValue: {
            host: this.element.nativeElement,
            wrapperClass: this.optionsNorm.wrapperClass
          }
        },
        {
          provide: 'message',
          useValue: this.optionsNorm.message
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
    this.componentViewRef = componentRef.hostView;
    this.appRef.attachView(this.componentViewRef);
    return [[componentRef.location.nativeElement]];
  }

}
