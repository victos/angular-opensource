import {Injectable, TemplateRef} from '@angular/core';
import {OPTIONS_TEMPLATE} from '../component/custom-busy-component/custom-busy-component.component';

@Injectable()
export class TemplateService {

    private codeCache = {
        'default': `@Component({
    selector: 'default-busy',
    template: \`
        <div class="ng-busy-default-wrapper">
            <div class="ng-busy-default-sign">
                <div class="ng-busy-default-spinner">
                    <div class="bar1"></div>
                    <div class="bar2"></div>
                    <div class="bar3"></div>
                    <div class="bar4"></div>
                    <div class="bar5"></div>
                    <div class="bar6"></div>
                    <div class="bar7"></div>
                    <div class="bar8"></div>
                    <div class="bar9"></div>
                    <div class="bar10"></div>
                    <div class="bar11"></div>
                    <div class="bar12"></div>
                </div>
                <div class="ng-busy-default-text">{{message}}</div>
            </div>
        </div>
    \`,
})
export class DefaultBusyComponent {
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
}`,
        'custom': `@Component({
    selector: 'default-busy',
    template: \`
        <div style="background: url('../assets/img/du.gif') no-repeat center 20px; background-size: 72px;">
            <div style="margin-top: 110px; text-align: center; font-size: 18px; font-weight: 700; line-height: 110px;">
                {{message}}
            </div>
        </div>
    \`,
})
export class CustomBusyComponent {
    private _msg: string;

    constructor(@Inject('message') private msg: string, private _changeDetectionRef: ChangeDetectorRef) {
    };

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
}`,
        'template': `<ng-template #customTemplate>
    <div style="margin-top: 110px; text-align: center;">Hi, This is from ng-template.</div>
</ng-template>`
    };

    private customTemplate: TemplateRef<any>;

    getTemplate(key: string): any {
        if ( key === 'template') {
            return this.customTemplate;
        }
        if (key) {
            return OPTIONS_TEMPLATE[key];
        } else {
            return OPTIONS_TEMPLATE['default'];
        }
    }

    getCode(key: string): string {
        return this.codeCache[key];
    }

    setCustomTemplate(tmpRef: TemplateRef<any>): void {
        this.customTemplate = tmpRef;
    }
}
