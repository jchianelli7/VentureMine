import { Component, OnInit, Output } from '@angular/core';
import { Auction } from 'src/app/models/Auction';
import { AuctionService } from 'src/app/services/auction-service.service';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit {

 auction: Auction;

  constructor(private auctionService: AuctionService) { }

  ngOnInit() {
    this.auction = this.auctionService.getAuction(1);
  }

  bidPlaced(){
    console.log("In Parent Component - Auction");
  }

}
