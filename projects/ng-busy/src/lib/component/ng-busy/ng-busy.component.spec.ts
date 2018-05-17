import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgBusyComponent } from './ng-busy.component';
import {BusyTrackerService} from '../../service/busy-tracker.service';
import {BusyConfigHolderService} from '../../service/busy-config-holder.service';
import {ChangeDetectorRef, ElementRef} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

export class MockElementRef extends ElementRef {}

describe('NgBusyComponent', () => {
  let component: NgBusyComponent;
  let fixture: ComponentFixture<NgBusyComponent>;
  let tracker: BusyTrackerService;
  let configHolder: BusyConfigHolderService;

  beforeEach(async(() => {
    tracker = new BusyTrackerService();
    configHolder = new BusyConfigHolderService({
      wrapperClass: 'the_actual_class',
      template: MockElementRef,
      delay: 0,
      minDuration: 0,
      backdrop: false,
      message: 'the_actual_msg'
    });
    TestBed.configureTestingModule({
      declarations: [ NgBusyComponent ],
      imports: [BrowserAnimationsModule],
      providers: [{provide: BusyTrackerService, useValue: tracker}, BusyConfigHolderService, ChangeDetectorRef,
        {provide: 'busyConfig', useValue: configHolder}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgBusyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty after init', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.the_actual_class')).toBeNull();
  }));

  it('should be empty if isActive is false', async(() => {
    tracker['__isActive'] = false;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.the_actual_class')).toBeNull();
  }));

  it('div.the_actual_class should be load if isActive is true', async(() => {
    tracker['__isActive'] = true;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.the_actual_class')).toBeDefined();
  }));

  it('div.the_actual_class should be load by the change of isActive', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    tracker['__isActive'] = true;
    fixture.detectChanges();
    expect(compiled.querySelector('div.the_actual_class')).toBeDefined();
    tracker['__isActive'] = false;
    fixture.detectChanges();
    expect(compiled.querySelector('div.the_actual_class')).toBeNull();
    tracker['__isActive'] = true;
    fixture.detectChanges();
    expect(compiled.querySelector('div.the_actual_class')).toBeDefined();
    tracker['__isActive'] = false;
    fixture.detectChanges();
    expect(compiled.querySelector('div.the_actual_class')).toBeNull();
  }));
});
