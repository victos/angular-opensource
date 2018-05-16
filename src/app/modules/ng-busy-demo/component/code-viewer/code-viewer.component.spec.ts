import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeViewerComponent } from './code-viewer.component';
import {TemplateService} from '../../service/template.service';
import {ElementRef, Renderer2} from '@angular/core';

describe('CodeViewerComponent', () => {
  let component: CodeViewerComponent;
  let fixture: ComponentFixture<CodeViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeViewerComponent ],
      providers: [TemplateService, Renderer2, { provide: ElementRef, useClass: {} }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
