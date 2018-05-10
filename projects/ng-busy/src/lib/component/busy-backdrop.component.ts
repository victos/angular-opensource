import {Component} from '@angular/core';
import {trigger, style, transition, animate} from '@angular/animations';

import {TrackerService} from '../service/tracker.service';

const inactiveStyle = style({
    opacity: 0
});
const timing = '.3s ease';

@Component({
    selector: 'ng-busy-backdrop',
    template: `
        <div class="ng-busy-backdrop"
             *ngIf="isActive()">
        </div>
    `,
    animations: [
        trigger('fadeInOut', [
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
export class BusyBackdropComponent {
    constructor(private tracker: TrackerService) {
    }

    isActive() {
        return this.tracker.isActive();
    }
}
