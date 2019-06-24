import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Auction } from 'src/app/models/Auction';
import { AuctionService } from 'src/app/services/auction-service.service';

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
    this.auction.graphDataSets[0].data.push({x: 500, y: 2});
    this.auction.currentBids++;
    this.bidPlaced.emit(this.auction);
  }

}
