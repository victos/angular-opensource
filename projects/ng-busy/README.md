**Notice**

1.x version is used for angular 5.x

6.x version is used for angular 6.x, and this version is **not** ready for release

**NgBusy** can show busy/loading indicators on any promise, or on any Observable's subscription.

![demo](https://raw.githubusercontent.com/devyumao/devyumao.github.io/master/angular2-busy/img/demo.gif)

Rewritten from [angular2-busy](https://github.com/devyumao/angular2-busy), and add some new features in terms of Angular 2.

### Built with Angular 6.0.0

## Demo

[https://github.com/victos/angular-opensource/tree/master/projects/ng-busy/](https://github.com/victos/angular-opensource/tree/master/projects/ng-busy/)

## Installation

```shell
npm install --save ng-busy
```

## Link CSS

```html
<link rel="stylesheet" href="/node_modules/ng-busy/src/style/busy.css">
```

## Getting Started

Import the `NgBusyModule` in your root application module:

```ts
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgBusyModule} from 'ng-busy';

@NgModule({
	imports: [
    	// ...
        BrowserAnimationsModule,
        NgBusyModule
    ],
	// ...
})
export class AppModule {}
```


Reference your promise in the `ngBusy` directive:

```ts
import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'some',
    template: `
        <div [ngBusy]="busy"></div>
    `
})
class SomeComponent implements OnInit {
    busy: Promise<any>;

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.busy = this.http.get('...').toPromise();
    }
}
```

Moreover, the subscription of an Observable is also supported:

```ts
// ...
import {Subscription} from 'rxjs';

// ...
class SomeComponent implements OnInit {
    busy: Subscription;

    // ...

    ngOnInit() {
        this.busy = this.http.get('...').subscribe();
    }
}
```

## Directive Syntax

The `ngBusy` directive expects a ***busy thing***, which means:
- A promise
- Or an Observable's subscription
- Or an array of them
- Or a configuration object
In other words, you may use flexible syntax:

```html
<!-- Collection syntax -->
<div [ngBusy]="[busyA, busyB, busyC]"></div>
```

```html
<!-- Advanced syntax -->
<div [ngBusy]="{busy: busy, message: 'Loading...', backdrop: false, delay: 200, minDuration: 600}"></div>
```

## Event

- busyStop : Will be triggered when the busy is done
- busyStart : Will be triggered when the busy comes out.

### Usage

```html
<!-- Simple syntax -->
<div [ngBusy]="..."  (busyStop)="onBusyStop()" (busyStart)="onBusyStart()"></div>
```

## Options

| Option | Required | Default | Details |
| ---- | ---- | ---- | ---- |
| busy | Required | null | A busy thing (or an array of busy things) that will cause the loading indicator to show. |
| message | Optional | 'Please wait...' | The message to show in the indicator which will reflect the updated values as they are changed. |
| backdrop | Optional | true | A faded backdrop will be shown behind the indicator if true. |
| template | Optional | A default template component | The template can be a template or a component. If provided, the custom template will be shown in place of the default indicatory template. The scope can be augmented with a `{{message}}` field containing the indicator message text. |
| delay | Optional | 0 | The amount of time to wait until showing the indicator. Specified in milliseconds.
| minDuration | Optional | 0 | The amount of time to keep the indicator showing even if the busy thing was completed quicker. Specified in milliseconds.|
| wrapperClass | Optional | 'ng-busy' | The name(s) of the CSS classes to be applied to the wrapper element of the indicator. |


## Overriding Defaults

The default values of options can be overriden by configuring the provider of the `BusyModule`.

In the root application module, you can do this:

```ts
import {NgModule} from '@angular/core';
import {NgBusyModule, BusyConfig} from 'ng-busy';
import {CustomBusyComponent} from '...'

@NgModule({
    imports: [
            ...
            NgBusyModule.forRoot(new BusyConfig({
                message: 'Don\'t panic!',
                backdrop: false,
                template: CustomBusyComponent,
                delay: 200,
                minDuration: 600
            }))
        ],
        declarations: [
            ...
            CustomBusyComponent,
            ...
        ],
        entryComponents: [
            CustomBusyComponent
        ],
})
export class AppModule
```

```ts
@Component({
  selector: 'default-busy',
  template: `
    <div class="ng-busy-default-wrapper">
          <div class="ng-busy-default-sign">
            <div class="ng-busy-default-spinner">
              <div class="bar1"></div>
              <div class="bar2"></div>
              <div class="bar3"></div>
              <div class="bar4"></div>
              <div class="bar5"></div>
              <div class="bar6"></div>
              <div class="bar7"></div>
              <div class="bar8"></div>
              <div class="bar9"></div>
              <div class="bar10"></div>
              <div class="bar11"></div>
              <div class="bar12"></div>
            </div>
            <div class="ng-busy-default-text">{{message}}</div>
          </div>
        </div>
  `,
})
export class CustomBusyComponent {
  constructor(@Inject('message')public message: string) {};
}
```



## Credits

Rewritten from [devyumao](https://github.com/devyumao)'s [angular2-busy](https://github.com/devyumao/angular2-busy).

## LICENSE

This project is licensed under the MIT license. See the [LICENSE](https://github.com/victos/ng-busy/blob/master/LICENSE) file for more info.
