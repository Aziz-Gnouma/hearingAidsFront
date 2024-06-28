import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductClientComponent } from './list-product-client.component';

describe('ListProductClientComponent', () => {
  let component: ListProductClientComponent;
  let fixture: ComponentFixture<ListProductClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListProductClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListProductClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
