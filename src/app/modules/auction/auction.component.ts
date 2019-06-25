import {Component, OnInit, Output} from '@angular/core';
import {Auction} from 'src/app/models/Auction';
import {AuctionService} from 'src/app/services/auction-service.service';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {

  auction: Auction;

  constructor(private auctionService: AuctionService) {
  }

  ngOnInit() {
    // TODO: Remove hardcoded auctionID when auction addition is enabled
    this.auctionService.getAuction('5d11416d1c9d44000055b5e9').subscribe((auction: Auction) => {
      console.log('In Auction Service');
      this.auction = auction;
    });
  }

  bidPlaced(auction: Auction) {
    console.log('In Parent Component - Auction');
    this.auction = auction;
  }

}
