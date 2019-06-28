import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Auction} from 'src/app/models/Auction';
import {AuctionService} from 'src/app/services/auction-service.service';
import {Subscription} from 'rxjs';
import {ChartDataSets} from 'chart.js';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {
  @Input() auction: Auction;
  @Output() bidPlaced = new EventEmitter();
  private auctionSub: Subscription;

  constructor(private auctionService: AuctionService) {
  }

  ngOnInit() {
    // this.auctionSub = this.auctionService.currentAuction.subscribe(auction => {
    //   this.auction = auction;
    // });

  }

  placeBid(numShares: number, pricePerShare: number) {
    this.auctionService.placeBid(this.auction._id, pricePerShare, numShares).subscribe(auction => {
      this.auction = auction;
      console.log("Placed Bid");
      this.bidPlaced.emit(auction);
    });
  }

}
