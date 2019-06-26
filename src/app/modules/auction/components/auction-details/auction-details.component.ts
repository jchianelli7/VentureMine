import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Auction} from 'src/app/models/Auction';
import {AuctionService} from 'src/app/services/auction-service.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {
  auction: Auction;
  private auctionSub: Subscription;

  constructor(private auctionService: AuctionService) {
    this.auctionSub = this.auctionService.currentAuction.subscribe(auction => {
      this.auction = auction;
    });
  }

  ngOnInit() {
  }

  placeBid(numShares: number, pricePerShare: number) {
    console.log('# Shares: ' + numShares);
    console.log('PPS: ' + pricePerShare);
    // this.auctionService.placeBid('5d11416d1c9d44000055b5e9', numShares, pricePerShare).subscribe((auction => {
    //   this.auction = auction;
    //   console.log(auction);
    // }));
    console.log('Auction?');
    console.log(this.auction.id);
    this.auctionService.placeBid(this.auction.id, pricePerShare, numShares);
  }

}
