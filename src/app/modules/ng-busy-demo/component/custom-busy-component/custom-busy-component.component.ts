import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {BUSY_CONFIG_DEFAULTS} from 'ng-busy';

@Component({
  selector: 'default-busy',
  template: `
      <div style="background: url('../../assets/img/du.gif') no-repeat center 20px; background-size: 72px;">
          <div style="margin-top: 110px; text-align: center; font-size: 18px; font-weight: 700; line-height: 110px;">
              {{message}}
          </div>
      </div>
  `,
})
export class CustomBusyComponentComponent {

  private _msg: string;

  constructor(@Inject('message') private msg: string, private _changeDetectionRef: ChangeDetectorRef) {
  }

  get message() {
    if (this._msg === undefined) {
      this.message = this.msg;
    }
    return this._msg;
  }

  set message(msg: string) {
    this._msg = msg;
    this._changeDetectionRef.detectChanges();
  }
}

export const OPTIONS_TEMPLATE: Object = {
  default: BUSY_CONFIG_DEFAULTS.template,
  custom: CustomBusyComponentComponent
};
