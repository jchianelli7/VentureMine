import { Component, OnInit, OnDestroy } from '@angular/core';
import { Auction } from 'src/app/models/Auction';
import { AuctionService } from 'src/app/services/auction-service.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { BaseChartDirective } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})



export class AuctionComponent implements OnInit, OnDestroy {
  auction: Auction;
  strikePrice: number;
  graphDataSets: ChartDataSets[];
  strikePriceAnnotation: any;
  isReady: boolean = false;
  connection;

  private auctionSub: Subscription;

  constructor(private auctionService: AuctionService, private route: ActivatedRoute) {
    this.auctionService.getAuction(this.route.snapshot.params.id).subscribe(auction => {
      this.auction = auction;
      this.strikePrice = this.auction.currentStrikePrice;
      this.graphDataSets = this.auction.graphDataSets;
      this.strikePriceAnnotation = {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: this.strikePrice,
        borderColor: 'red',
        borderWidth: 1.5,
        label: {
          enabled: true,
          fontColor: 'white',
          content: 'Strike Price'
        }
      };
    });
  }

  ngOnInit() {
    console.log('initializIng parent comp');
    this.connection = this.auctionService.getBids(this.route.snapshot.params.id).subscribe(auction => {
      this.auction = auction;
      this.strikePrice = this.auction.currentStrikePrice;
      this.graphDataSets = this.auction.graphDataSets;
      this.strikePriceAnnotation = {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: this.strikePrice,
        borderColor: 'red',
        borderWidth: 1.5,
        label: {
          enabled: true,
          fontColor: 'white',
          content: 'Strike Price'
        }
      }
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
      this.graphDataSets = this.auction.graphDataSets;
      this.strikePriceAnnotation = {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: this.strikePrice,
        borderColor: 'red',
        borderWidth: 1.5,
        label: {
          enabled: true,
          fontColor: 'white',
          content: 'Strike Price'
        }
      }
    });
  }


}
