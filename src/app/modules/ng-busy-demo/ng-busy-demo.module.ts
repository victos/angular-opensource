import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DemoComponent} from './component/demo/demo.component';
import {CodeViewerComponent} from './component/code-viewer/code-viewer.component';
import {HeaderComponent} from './component/header/header.component';
import {OptionsComponent} from './component/options/options.component';
import {TableComponent} from './component/table/table.component';
import {CustomBusyComponentComponent} from './component/custom-busy-component/custom-busy-component.component';
import {GithubCornerComponent} from './component/github-corner/github-corner.component';
import {FormsModule} from '@angular/forms';
import {NgBusyModule} from 'ng-busy';
import {TemplateService} from './service/template.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgBusyModule,
        BrowserAnimationsModule
    ],
    declarations: [DemoComponent, CodeViewerComponent, HeaderComponent, OptionsComponent,
        TableComponent, CustomBusyComponentComponent, GithubCornerComponent],
    exports: [DemoComponent],
    providers: [TemplateService]
})
export class NgBusyDemoModule {
}
