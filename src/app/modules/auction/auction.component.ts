import { Component, OnInit } from '@angular/core';
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



export class AuctionComponent implements OnInit {
  auction: Auction;
  strikePrice: number;
  graphDataSets: ChartDataSets[];
  strikePriceAnnotation: any;
  isReady: boolean = false;

  private auctionSub: Subscription;

  constructor(private auctionService: AuctionService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.auctionService.getAuction(this.route.snapshot.params.id).subscribe(
        (auction) => {
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
          
        },
        (err) => console.log("Error subbing"),
        () => {
        }
      );

    });
    
  }

  auctionUpdated(auction: Auction){
    console.log("auction updated - Parent");
    this.auction = auction;
    this.strikePrice = auction.currentStrikePrice;
    this.graphDataSets = auction.graphDataSets;
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
  }

  ngOnInit() {
    console.log('initializIng parent comp');
  }

  resetBids(id: string){
    console.log("Resetting Bids");
    this.auctionService.resetBids(this.auction._id).subscribe(auction => {
      this.auction = auction;
    });
  }


}
