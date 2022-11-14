/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MestreListaComponent } from './mestre-lista.component';

describe('MestreListaComponent', () => {
  let component: MestreListaComponent;
  let fixture: ComponentFixture<MestreListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MestreListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MestreListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
