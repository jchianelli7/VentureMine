import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionGraphComponent } from './auction-graph.component';

describe('AuctionGraphComponent', () => {
  let component: AuctionGraphComponent;
  let fixture: ComponentFixture<AuctionGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
