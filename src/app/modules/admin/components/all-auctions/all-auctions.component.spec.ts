import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAuctionsComponent } from './all-auctions.component';

describe('AllAuctionsComponent', () => {
  let component: AllAuctionsComponent;
  let fixture: ComponentFixture<AllAuctionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAuctionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAuctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
