import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auction } from 'src/app/models/Auction';
import { AuctionService } from 'src/app/services/auction-service.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { BaseChartDirective } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Bid } from 'src/app/models/Bid';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})



export class AuctionComponent implements OnInit, OnDestroy {
  auction: Auction;
  bids: Bid[];
  strikePrice: number;
  connection;

  private auctionSub: Subscription;

  constructor(private auctionService: AuctionService, private route: ActivatedRoute) {
    this.auctionService.getAuction(this.route.snapshot.params.id).subscribe(auction => {
      this.auction = auction;
      this.strikePrice = this.auction.currentStrikePrice;
      // this.bids = this.auction.bids;
      this.bids = this.auction.bids.sort(function(a,b){
        return a.pps - b.pps; //to reverse b.date-a.date
     });
    //15,20
    // 21, 300

    // 14, 125
    // 15, 20
    });
  }

  ngOnInit() {
    console.log('initializIng parent comp');
    this.connection = this.auctionService.getBids(this.route.snapshot.params.id).subscribe(auction => {
      this.auction = auction;
      this.strikePrice = auction.currentStrikePrice;
      this.bids = auction.bids.sort(function(a,b){
      return a.pps - b.pps; //to reverse b.date-a.date
   });
    });
      console.log("Got New Bids AKA Initializing Connection to socket - GetBids");
  }

  ngOnDestroy() {
    console.log("Unsubbing - Auction Component");
    this.connection.unsubscribe();
  }

  resetBids(id: string) {
    console.log("Resetting Bids");
    this.auctionService.resetBids(this.auction._id).subscribe(auction => {
      this.auction = auction;
      this.strikePrice = this.auction.currentStrikePrice;
      this.bids = this.auction.bids;
    });
  }


}
