import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgBusyComponent } from './ng-busy.component';
import {BusyConfigHolderService} from '../../service/busy-config-holder.service';
import {ChangeDetectorRef, ElementRef, EventEmitter} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

export class MockElementRef extends ElementRef {}

describe('NgBusyComponent', () => {
  let component: NgBusyComponent;
  let fixture: ComponentFixture<NgBusyComponent>;
  let busyEmitter: EventEmitter<boolean>;
  let configHolder: BusyConfigHolderService;

  beforeEach(async(() => {
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
      providers: [BusyConfigHolderService, ChangeDetectorRef,
        {provide: 'busyConfig', useValue: configHolder}, {provide: 'busyEmitter', useValue: new EventEmitter<boolean>()}]
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

  it('should be empty after init', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.the_actual_class')).toBeNull();
  }));

  it('should be empty if isActive is false', async(() => {
    busyEmitter.emit(false);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.the_actual_class')).toBeNull();
  }));

  it('div.the_actual_class should be load if isActive is true', async(() => {
    busyEmitter.emit(true);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.the_actual_class')).toBeDefined();
  }));

  it('div.the_actual_class should be load by the change of isActive', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    busyEmitter.emit(true);
    fixture.detectChanges();
    expect(compiled.querySelector('div.the_actual_class')).toBeDefined();
    busyEmitter.emit(false);
    fixture.detectChanges();
    expect(compiled.querySelector('div.the_actual_class')).toBeNull();
    busyEmitter.emit(true);
    fixture.detectChanges();
    expect(compiled.querySelector('div.the_actual_class')).toBeDefined();
    busyEmitter.emit(false);
    fixture.detectChanges();
    expect(compiled.querySelector('div.the_actual_class')).toBeNull();
  }));
});
