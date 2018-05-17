import {NgBusyDirective} from './ng-busy.directive';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {BusyTrackerService} from './service/busy-tracker.service';
import {BusyConfigHolderService} from './service/busy-config-holder.service';
import {
  ApplicationRef, ChangeDetectorRef,
  Component,
  DebugElement,
  ElementRef, Inject,
  Injector,
  Renderer2, TemplateRef, ViewChild,
  ViewContainerRef
} from '@angular/core';
import {By} from '@angular/platform-browser';
import {NgBusyModule} from './ng-busy.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {DefaultBusyComponent} from './model/busy-config';
import {NgBusyBackdropComponent} from './component/ng-busy-backdrop/ng-busy-backdrop.component';
import {NgBusyComponent} from './component/ng-busy/ng-busy.component';

const createPromiseWithDelay = (delay: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

@Component({
  selector: 'component-template',
  template: `
        <div>
            <div>
                {{message}}
            </div>
        </div>
    `,
})
export class CustomBusyComponent {
  private _msg: string;

  constructor(@Inject('message') private msg: string, private _changeDetectionRef: ChangeDetectorRef) {
  }

  get message() {
    if (this._msg === undefined) {
      this.message = this.msg;
    }
    return this._msg;
  }

  set message(msg: string) {
    this._msg = msg;
    this._changeDetectionRef.detectChanges();
  }
}

@Component({
  template: `
      <ng-template #customTemplate>
          <div class="custom_template_for_test" style="margin-top: 110px; text-align: center;">Hi, This is from ng-template.</div>
      </ng-template>
      <div class="ng-busy-container-for-test" [ngBusy]="options"></div>`
})
class TestNgBusyComponent {
  options: any;
  @ViewChild('customTemplate')
  customTemplate: TemplateRef<any>;
}

describe('NgBusyDirective', () => {
  let component: TestNgBusyComponent;
  let fixture: ComponentFixture<TestNgBusyComponent>;
  let busyContainer: DebugElement;
  const mockElementRef: ElementRef = {nativeElement: undefined};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestNgBusyComponent, CustomBusyComponent],
      imports: [NgBusyModule, BrowserAnimationsModule],
      providers: [BusyConfigHolderService, BusyTrackerService,
        ApplicationRef, ViewContainerRef, {provide: ElementRef, useValue: mockElementRef}, Renderer2, Injector]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [CustomBusyComponent, DefaultBusyComponent, NgBusyBackdropComponent, NgBusyComponent]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestNgBusyComponent);
    component = fixture.componentInstance;
    busyContainer = fixture.debugElement.query(By.css('div.ng-busy-container-for-test'));
    mockElementRef.nativeElement = fixture.elementRef.nativeElement;
    fixture.detectChanges();
  });

  it('should create lib-ng-busy after init the NgBusyDirective', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    component.options = undefined;
    fixture.detectChanges();
    expect(compiled.querySelector('lib-ng-busy')).toBeDefined();
  }));

  it('should create lib-ng-busy-backdrop accordingly after init the NgBusyDirective by the setting of option backdrop ', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    component.options = {
      backdrop: true
    };
    fixture.detectChanges();
    expect(compiled.querySelector('lib-ng-busy-backdrop')).toBeDefined();
    component.options = {
      backdrop: false
    };
    fixture.detectChanges();
    expect(compiled.querySelector('lib-ng-busy-backdrop')).toBeNull();
  }));

  it('should load default template when there is a busy and no template configured', fakeAsync(() => {
    component.options = createPromiseWithDelay(1000);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('lib-ng-busy default-busy'))).toBeDefined();
    tick(701);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('lib-ng-busy default-busy'))).toBeNull();
  }));

  it('should load the template when the option template is configured', fakeAsync(() => {
    component.options = {
      busy: createPromiseWithDelay(1000),
      template: component.customTemplate
    };
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('lib-ng-busy .custom_template_for_test')).nativeElement.textContent)
      .toBe('Hi, This is from ng-template.');
    tick(701);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('lib-ng-busy .custom_template_for_test'))).toBeNull();
  }));


  it('string typed template', fakeAsync(() => {
    component.options = {
      busy: createPromiseWithDelay(1000),
      template: 'hello',
      wrapperClass: 'content_class'
    };
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('lib-ng-busy>.content_class')).nativeElement.textContent)
      .toBe('hello');
    tick(701);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('lib-ng-busy>.content_class'))).toBeNull();
  }));

  it('component typed template', fakeAsync(() => {
    component.options = {
      busy: createPromiseWithDelay(1000),
      template: CustomBusyComponent,
      message: 'this is from component',
      wrapperClass: 'content_class_component'
    };
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('lib-ng-busy>.content_class_component')).nativeElement.textContent.trim())
      .toBe('this is from component');
    tick(701);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('lib-ng-busy>.content_class_component'))).toBeNull();
  }));
});
