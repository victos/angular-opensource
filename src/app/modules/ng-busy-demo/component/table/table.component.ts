import {ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {IBusyConfig} from 'ng-busy';
import {TemplateService} from '../../service/template.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {

  @Input() loading: IBusyConfig;
  @Input() customTemplate: any;

  constructor(private templateService: TemplateService) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.templateService.setCustomTemplate(this.customTemplate);
  }

  onBusyStart(): void {
    console.log('what happened ?');
    console.log('busy started');
  }

  onBusyStop(): void {
    console.log('busy stopped');
  }

}
