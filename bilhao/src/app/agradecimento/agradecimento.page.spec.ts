import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgradecimentoPage } from './agradecimento.page';

describe('agradecimentoPage', () => {
  let component: AgradecimentoPage;
  let fixture: ComponentFixture<AgradecimentoPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(AgradecimentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
