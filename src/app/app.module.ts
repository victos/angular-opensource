import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NgBusyDemoModule} from './modules/ng-busy-demo/ng-busy-demo.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgBusyDemoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
