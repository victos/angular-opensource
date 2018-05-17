import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {BusyTrackerService} from '../../service/busy-tracker.service';

const inactiveStyle = style({
  opacity: 0
});
const timing = '.3s ease';

@Component({
  selector: 'lib-ng-busy-backdrop',
  templateUrl: './ng-busy-backdrop.component.html',
  styleUrls: ['./ng-busy-backdrop.component.css'],
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
export class NgBusyBackdropComponent implements OnInit {

  get isActive(): boolean {
    return this.tracker.isActive;
  }

  constructor(private tracker: BusyTrackerService) { }

  ngOnInit() {
  }

}
