import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {CustomBusyComponentComponent} from './custom-busy-component.component';

describe('CustomBusyComponentComponent', () => {
  let component: CustomBusyComponentComponent;
  let fixture: ComponentFixture<CustomBusyComponentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CustomBusyComponentComponent],
      providers: [{provide: 'instanceConfigHolder', useValue: {config: {message : 'hello'}}}]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomBusyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
