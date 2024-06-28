import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingProductComponent } from './buying-product.component';

describe('BuyingProductComponent', () => {
  let component: BuyingProductComponent;
  let fixture: ComponentFixture<BuyingProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyingProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
