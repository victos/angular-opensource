import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { BUSY_CONFIG_DEFAULTS } from 'ng-busy';
import { InstanceConfigHolderService } from '../../../../../../projects/ng-busy/src/lib/service/instance-config-holder.service';

@Component({
  selector: 'default-busy',
  template: `
      <div style="background: url('../../assets/img/du.gif') no-repeat center 20px; background-size: 72px;" [ngStyle]="instanceConfigHolder.config.templateNgStyle">
          <div style="margin-top: 110px; text-align: center; font-size: 18px; font-weight: 700; line-height: 110px;">
              {{message}}
          </div>
      </div>
  `,
})
export class CustomBusyComponentComponent implements OnInit, OnDestroy {

  constructor(@Inject('instanceConfigHolder')public instanceConfigHolder: InstanceConfigHolderService) {
  }

  get message() {
    return this.instanceConfigHolder.config.message;
  }

  ngOnDestroy(): void {
    console.log('custom component destroy');
  }

  ngOnInit(): void {
    console.log('custom component init');
  }
}

export const OPTIONS_TEMPLATE: Object = {
  default: BUSY_CONFIG_DEFAULTS.template,
  custom: CustomBusyComponentComponent
};
