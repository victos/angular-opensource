import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoComponent } from './demo.component';
import {GithubCornerComponent} from '../github-corner/github-corner.component';
import {HeaderComponent} from '../header/header.component';
import {OptionsComponent} from '../options/options.component';
import {CodeViewerComponent} from '../code-viewer/code-viewer.component';
import {TableComponent} from '../table/table.component';
import {FormsModule} from '@angular/forms';
import {NgBusyModule} from 'ng-busy';
import {TemplateService} from 'src/app/modules/ng-busy-demo/service/template.service';

describe('DemoComponent', () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoComponent, GithubCornerComponent, HeaderComponent, OptionsComponent, CodeViewerComponent, TableComponent ],
      imports: [FormsModule, NgBusyModule],
      providers: [TemplateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
