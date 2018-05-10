import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgBusyComponent } from './ng-busy.component';

describe('NgBusyComponent', () => {
  let component: NgBusyComponent;
  let fixture: ComponentFixture<NgBusyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgBusyComponent ]
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
});
