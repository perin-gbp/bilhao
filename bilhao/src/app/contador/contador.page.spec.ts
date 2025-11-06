import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContadorPage } from './contador.page';

describe('contadorPage', () => {
  let component: ContadorPage;
  let fixture: ComponentFixture<ContadorPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ContadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
