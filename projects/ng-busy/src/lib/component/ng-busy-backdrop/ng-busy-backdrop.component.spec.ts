import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgBusyBackdropComponent } from './ng-busy-backdrop.component';
import {EventEmitter} from '@angular/core';

describe('NgBusyBackdropComponent', () => {
  let component: NgBusyBackdropComponent;
  let fixture: ComponentFixture<NgBusyBackdropComponent>;
  let busyEmitter: EventEmitter<boolean>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgBusyBackdropComponent ],
      providers: [{provide: 'busyEmitter', useValue: new EventEmitter<boolean>()}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgBusyBackdropComponent);
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
    expect(compiled.querySelector('.ng-busy-backdrop')).toBeNull();
  }));

  it('should be empty if isActive is false', async(() => {
    // spy = spyOn(tracker, 'isActive').and.returnValue(false);
    busyEmitter.emit(false);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.ng-busy-backdrop')).toBeNull();
  }));

  it('div.ng-busy-backdrop should be load if isActive is true', async(() => {
    busyEmitter.emit(true);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.ng-busy-backdrop')).toBeDefined();
  }));

  it('div.ng-busy-backdrop should be load by the change of isActive', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    busyEmitter.emit(true);
    fixture.detectChanges();
    expect(compiled.querySelector('div.ng-busy-backdrop')).toBeDefined();
    busyEmitter.emit(false);
    fixture.detectChanges();
    expect(compiled.querySelector('div.ng-busy-backdrop')).toBeNull();
    busyEmitter.emit(true);
    fixture.detectChanges();
    expect(compiled.querySelector('div.ng-busy-backdrop')).toBeDefined();
    busyEmitter.emit(false);
    fixture.detectChanges();
    expect(compiled.querySelector('div.ng-busy-backdrop')).toBeNull();
  }));
});
