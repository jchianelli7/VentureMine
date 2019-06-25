import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Auction} from 'src/app/models/Auction';
import {AuctionService} from 'src/app/services/auction-service.service';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {
  @Input() auction: Auction;
  @Output() bidPlaced = new EventEmitter();
  // currentStrikePrice: number;
  // currentBids: number;
  // uniqueBidders: number;
  // reserveMet: boolean;
  // displayReserve: boolean;

  constructor(private auctionService: AuctionService) {
  }

  ngOnInit() {
  }

  placeBid(numShares: number, pricePerShare: number) {
    console.log('# Shares: ' + numShares);
    console.log('PPS: ' + pricePerShare);
    // @ts-ignore
    // this.auction.graphDataSets[0].data.push({x: numShares, y: pricePerShare});
    // this.auction.currentBids++;
    // this.bidPlaced.emit(this.auction);
    this.auctionService.placeBid('5d11416d1c9d44000055b5e9', numShares, pricePerShare).subscribe((auction => {
      this.auction = auction;
      this.bidPlaced.emit(auction);
      console.log(auction);
    }));
  }

}
