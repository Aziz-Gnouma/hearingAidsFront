import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisableProductComponent } from './list-disable-product.component';

describe('ListDisableProductComponent', () => {
  let component: ListDisableProductComponent;
  let fixture: ComponentFixture<ListDisableProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListDisableProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListDisableProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
