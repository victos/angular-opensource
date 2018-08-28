/**
 * @file Component: Options
 * @author yumao<yuzhang.lille@gmail.com>
 */

import {Component} from '@angular/core';

import {BUSY_CONFIG_DEFAULTS, IBusyConfig} from 'ng-busy';
import {Observer, Observable} from 'rxjs';
import {TemplateService} from '../../service/template.service';


@Component({
  selector: 'demo-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent {
  templateType = 'default';
  templates: any = [
    {val: 'default', show: 'Default'},
    {val: 'custom', show: 'Custom'},
    {val: 'template', show: 'Template'}
  ];
  data: IBusyConfig = Object.assign({}, BUSY_CONFIG_DEFAULTS);

  constructor(private templateService: TemplateService) {
  }

  changeTemplate(tmp: string) {
    this.templateType = tmp;
    this.data.template = this.templateService.getTemplate(this.templateType);
  }

  changeBackdrop(element: HTMLInputElement) {
    this.data.backdrop = element.checked;
  }

  disableAnimation(element: HTMLInputElement) {
    this.data.disableAnimation = element.checked;
  }

  playDemo() {
    const busies = [];
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve();
        console.log('Promise finished!');
      }, 3000);
    });

    const observable1: Observable<number> = Observable.create((observer: Observer<number>) => {
      setTimeout(() => {
        observer.next(1);
        observer.complete();
      }, 1000);
    });

    const observable2: Observable<number> = Observable.create((observer: Observer<number>) => {
      setTimeout(() => {
        observer.next(2);
        observer.complete();
      }, 2000);
    });

    const observable3: Observable<number> = Observable.create((observer: Observer<number>) => {
      setTimeout(() => {
        observer.next(3);
        observer.complete();
      }, 5000);
    });

    const observable4: Observable<number> = Observable.create((observer: Observer<number>) => {
      setTimeout(() => {
        observer.next(4);
        observer.complete();
      }, 4000);
    });

    busies.push(promise);
    busies.push(observable1.subscribe((val: number) => {
      console.log(`Observer${val} done!`);
    }));
    busies.push(observable2.subscribe((val: number) => {
      console.log(`Observer${val} done!`);
    }));
    busies.push(observable3.subscribe((val: number) => {
      console.log(`Observer${val} done!`);
    }));
    busies.push(observable4.subscribe((val: number) => {
      console.log(`Observer${val} done!`);
    }));
    this.data.busy = busies;
    this.data = Object.assign({}, this.data);
  }
}
