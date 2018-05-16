import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomBusyComponentComponent } from './custom-busy-component.component';

describe('CustomBusyComponentComponent', () => {
  let component: CustomBusyComponentComponent;
  let fixture: ComponentFixture<CustomBusyComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomBusyComponentComponent ],
      providers: [{provide: 'message', useValue: 'hello'}]
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
