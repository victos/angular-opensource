import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgBusyComponent } from './ng-busy.component';
import {BusyConfigHolderService} from '../../service/busy-config-holder.service';
import {ChangeDetectorRef, ElementRef, EventEmitter} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {InstanceConfigHolderService} from '../../service/instance-config-holder.service';
import {DefaultBusyComponent} from '../../model/busy-config';

export class MockElementRef extends ElementRef {}

describe('NgBusyComponent', () => {
  let component: NgBusyComponent;
  let fixture: ComponentFixture<NgBusyComponent>;
  let busyEmitter: EventEmitter<boolean>;
  const instanceConfig: InstanceConfigHolderService = new InstanceConfigHolderService();

  beforeEach(waitForAsync(() => {
    instanceConfig.config = {
        wrapperClass: 'the_actual_class',
        template: MockElementRef,
        delay: 0,
        minDuration: 0,
        backdrop: false,
        message: 'the_actual_msg'
    };
    TestBed.configureTestingModule({
      declarations: [ NgBusyComponent ],
      imports: [BrowserAnimationsModule],
      providers: [BusyConfigHolderService, ChangeDetectorRef,
        {provide: 'busyEmitter', useValue: new EventEmitter<boolean>()},
        {provide: 'instanceConfigHolder', useValue: instanceConfig}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgBusyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    busyEmitter = TestBed.get('busyEmitter');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty after init', waitForAsync(() => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.the_actual_class'))).toBeNull();
  }));

  it('should be empty if isActive is false', waitForAsync(() => {
    busyEmitter.emit(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.the_actual_class'))).toBeNull();
  }));

  it('div.the_actual_class should be load if isActive is true', waitForAsync(() => {
    busyEmitter.emit(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.the_actual_class'))).not.toBeNull();
  }));

  it('div.the_actual_class should be load by the change of isActive', waitForAsync(() => {
    busyEmitter.emit(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.the_actual_class'))).not.toBeNull();
    busyEmitter.emit(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.the_actual_class'))).toBeNull();
    busyEmitter.emit(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.the_actual_class'))).not.toBeNull();
    busyEmitter.emit(false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.the_actual_class'))).toBeNull();
  }));
});
