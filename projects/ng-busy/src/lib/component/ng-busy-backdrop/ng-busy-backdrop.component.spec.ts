import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgBusyBackdropComponent } from './ng-busy-backdrop.component';
import {BusyTrackerService} from '../../service/busy-tracker.service';

describe('NgBusyBackdropComponent', () => {
  let component: NgBusyBackdropComponent;
  let fixture: ComponentFixture<NgBusyBackdropComponent>;
  let tracker: BusyTrackerService;

  beforeEach(async(() => {
    tracker = new BusyTrackerService();
    TestBed.configureTestingModule({
      declarations: [ NgBusyBackdropComponent ],
      providers: [{provide: BusyTrackerService, useValue: tracker}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgBusyBackdropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    tracker['__isActive'] = false;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.ng-busy-backdrop')).toBeNull();
  }));

  it('div.ng-busy-backdrop should be load if isActive is true', async(() => {
    tracker['__isActive'] = true;
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.ng-busy-backdrop')).toBeDefined();
  }));

  it('div.ng-busy-backdrop should be load by the change of isActive', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    tracker['__isActive'] = true;
    fixture.detectChanges();
    expect(compiled.querySelector('div.ng-busy-backdrop')).toBeDefined();
    tracker['__isActive'] = false;
    fixture.detectChanges();
    expect(compiled.querySelector('div.ng-busy-backdrop')).toBeNull();
    tracker['__isActive'] = true;
    fixture.detectChanges();
    expect(compiled.querySelector('div.ng-busy-backdrop')).toBeDefined();
    tracker['__isActive'] = false;
    fixture.detectChanges();
    expect(compiled.querySelector('div.ng-busy-backdrop')).toBeNull();
  }));
});
