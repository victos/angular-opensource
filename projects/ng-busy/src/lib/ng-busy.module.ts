import {ModuleWithProviders, NgModule} from '@angular/core';
import {BusyConfig, DefaultBusyComponent} from './model/busy-config';
import {BusyComponent, BusyContainerDirective} from './component/busy.component';
import {BusyBackdropComponent} from './component/busy-backdrop.component';
import {BusyDirective} from './directive/busy.directive';
import {BusyService} from './service/busy.service';
import {TrackerService} from './service/tracker.service';
import {CommonModule} from '@angular/common';
import {NgBusyComponent} from './ng-busy.component';

@NgModule({
    imports: [CommonModule],
    declarations: [BusyComponent, BusyBackdropComponent, NgBusyComponent,
        BusyDirective, DefaultBusyComponent, BusyContainerDirective],
    providers: [BusyService, TrackerService],
    exports: [BusyDirective],
    entryComponents: [BusyBackdropComponent, BusyComponent, DefaultBusyComponent]
})
export class NgBusyModule {
    static forRoot(config: BusyConfig): ModuleWithProviders {
        return {
            ngModule: NgBusyModule,
            providers: [
                {provide: BusyConfig, useValue: config}
            ]
        };
    }
}
