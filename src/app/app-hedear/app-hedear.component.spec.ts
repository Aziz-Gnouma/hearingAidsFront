import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppHedearComponent } from './app-hedear.component';

describe('AppHedearComponent', () => {
  let component: AppHedearComponent;
  let fixture: ComponentFixture<AppHedearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppHedearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppHedearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
