import {
    Directive,
    Input,
    DoCheck,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef,
    Injector,
    Renderer2,
    TemplateRef,
    ElementRef,
    Type, ApplicationRef,
    Output,
    EventEmitter
} from '@angular/core';
import {Subscription} from 'rxjs';

import {equals} from '../tools/util';
import {TrackerService} from '../service/tracker.service';
import {BusyService} from '../service/busy.service';
import {IBusyConfig} from '../model/busy-config';
import {BusyComponent} from '../component/busy.component';
import {BusyBackdropComponent} from '../component/busy-backdrop.component';
import {ViewRef} from '@angular/core/src/linker/view_ref';


/**
 * ### Syntax
 *
 * - `<div [ngBusy]="busy">...</div>`
 * - `<div [ngBusy]="[busyA, busyB, busyC]">...</div>`
 * - `<div [ngBusy]="{busy: busy, message: 'Loading...', backdrop: false, delay: 200, minDuration: 600}">...</div>`
 */
@Directive({
    selector: '[ngBusy]',
    providers: [TrackerService]
})
export class BusyDirective implements DoCheck {
    @Input('ngBusy') options: any;
    @Output() busyStart = new EventEmitter();
    @Output() busyStop = new EventEmitter();
    private optionsRecord: any;
    private optionsNorm: IBusyConfig;
    private busyRef: ComponentRef<BusyComponent>;
    private backdropRef: ComponentRef<BusyBackdropComponent>;
    private componentViewRef: ViewRef;

    public backdrop: boolean;
    public template: TemplateRef<any> | Type<any>;

    constructor(private service: BusyService,
                private tracker: TrackerService,
                private resolver: ComponentFactoryResolver,
                private vcr: ViewContainerRef,
                private element: ElementRef,
                private injector: Injector,
                private appRef: ApplicationRef,
                private renderer: Renderer2) {
        tracker.onStartBusy = this.busyStart;
        tracker.onStopBusy = this.busyStop;
    }

    // As ngOnChanges does not work on Object detection, ngDoCheck is using
    ngDoCheck() {
        const options = this.optionsNorm = this.normalizeOptions(this.options);

        if (!this.dectectOptionsChange()) {
            return;
        }

        if (!equals(options.busy, this.tracker.busyList)) {
            this.tracker.reset({
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

    private normalizeOptions(options: any) {
        if (!options) {
            options = {busy: undefined};
        } else if (Array.isArray(options)
            || options instanceof Promise
            || options instanceof Subscription
        ) {
            options = {busy: options};
        }
        options = Object.assign({}, this.service.config, options);
        if (!Array.isArray(options.busy)) {
            options.busy = [options.busy];
        }

        return options;
    }

    private dectectOptionsChange() {
        if (equals(this.optionsNorm, this.optionsRecord)) {
            return false;
        }
        this.optionsRecord = this.optionsNorm;
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
        const backdropFactory = this.resolver.resolveComponentFactory(BusyBackdropComponent);
        this.backdropRef = this.vcr.createComponent(backdropFactory, undefined, this.injector);
    }

    private createBusy() {
        const factory = this.resolver.resolveComponentFactory(BusyComponent);
        const injector = Injector.create([
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
        ], this.injector);
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
            // In earlier versions, you may need to add this line
            // this.appRef.attachView(viewRef);
            return [viewRef.rootNodes];
        }
        // Else it's a component
        const factory = this.resolver.resolveComponentFactory(this.template);
        const componentRef = factory.create(injector);
        this.componentViewRef = componentRef.hostView;
        this.appRef.attachView(this.componentViewRef);
        // In earlier versions, you may need to add this line
        // this.appRef.attachView(componentRef.hostView);
        return [[componentRef.location.nativeElement]];
    }
}
