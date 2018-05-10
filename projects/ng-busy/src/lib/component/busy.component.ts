import {Component, Directive, ViewChild, ElementRef, Inject} from '@angular/core';
import {trigger, style, transition, animate} from '@angular/animations';

import {TrackerService} from '../service/tracker.service';


const inactiveStyle = style({
    opacity: 0,
    transform: 'translateY(-40px)'
});
const timing = '.3s ease';

export interface IBusyContext {
    message: string;
}

@Directive({
    selector: '[busy-container]'
})
export class BusyContainerDirective {
}

@Component({
    selector: 'ng-busy',
    template: `
        <div [class]="wrapperClass" @flyInOut busy-container *ngIf="isActive()">
            <ng-content></ng-content>
        </div>
    `,
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
export class BusyComponent {
    public wrapperClass: string;

    @ViewChild(BusyContainerDirective, {read: ElementRef}) private busyContainer: ElementRef;

    constructor(@Inject('busyConfig') private config: any,
                private tracker: TrackerService) {
        this.wrapperClass = this.config.wrapperClass;
    }

    isActive() {
        return this.tracker.isActive();
    }
}
