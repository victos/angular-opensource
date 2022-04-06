import {ModuleWithProviders, NgModule} from '@angular/core';
import {BusyConfig, DefaultBusyComponent, IBusyConfig} from './model/busy-config';
import {CommonModule} from '@angular/common';
import {BusyTrackerService} from './service/busy-tracker.service';
import {BusyConfigHolderService} from './service/busy-config-holder.service';
import {NgBusyDirective} from './ng-busy.directive';
import {NgBusyComponent} from './component/ng-busy/ng-busy.component';

@NgModule({
    imports: [CommonModule],
    declarations: [DefaultBusyComponent, NgBusyDirective, NgBusyComponent],
    providers: [BusyConfigHolderService, BusyTrackerService],
    exports: [NgBusyDirective]
})
export class NgBusyModule {
  static forRoot(config: IBusyConfig): ModuleWithProviders<NgBusyModule> {
    return {
      ngModule: NgBusyModule,
      providers: [
        {provide: BusyConfig, useValue: config}
      ]
    };
  }
}
