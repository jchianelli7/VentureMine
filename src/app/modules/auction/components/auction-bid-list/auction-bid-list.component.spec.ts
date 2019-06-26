import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionBidListComponent } from './auction-bid-list.component';

describe('AuctionBidListComponent', () => {
  let component: AuctionBidListComponent;
  let fixture: ComponentFixture<AuctionBidListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionBidListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionBidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
