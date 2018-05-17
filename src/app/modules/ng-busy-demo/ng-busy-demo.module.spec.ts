import {NgBusyDemoModule} from './ng-busy-demo.module';

describe('NgBusyDemoModule', () => {
  let ngBusyDemoModule: NgBusyDemoModule;

  beforeEach(() => {
    ngBusyDemoModule = new NgBusyDemoModule();
  });

  it('should create an instance', () => {
    expect(ngBusyDemoModule).toBeTruthy();
  });
});
