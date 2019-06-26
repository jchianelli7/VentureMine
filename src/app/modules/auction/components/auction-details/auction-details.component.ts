import {Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Auction} from 'src/app/models/Auction';
import {AuctionService} from 'src/app/services/auction-service.service';
import {Subscription} from 'rxjs';
import {ChartDataSets} from 'chart.js';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit { // , OnChanges{
  @Input() auction: Auction;
  private auctionSub: Subscription;

  constructor(private auctionService: AuctionService) {
  }

  ngOnInit() {
    this.auctionSub = this.auctionService.currentAuction.subscribe(auction => {
      this.auction = auction;
    });
    // this.auctionService.getAuction('5d11416d1c9d44000055b5e9').subscribe(auction => {
    //   this.auction = auction;
    // });
    console.log('Initializing Auction Details');
  }

  placeBid(numShares: number, pricePerShare: number) {
    this.auctionService.placeBid(this.auction._id, pricePerShare, numShares);
  }
  //
  // ngOnChanges(changes: SimpleChanges): void {
  //
  // }

}
