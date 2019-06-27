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
              // value: this.auction.currentStrikePrice,
              value: this.strikePrice,
              borderColor: 'orange',
              borderWidth: 3,
              label: {
                enabled: true,
                fontColor: 'black',
                content: 'Strike Price'
  
              }
            }
          this.isReady = true;
          
        },
        (err) => console.log("Error subbing"),
        () => {
          this.isReady = true;
          console.log("SUB COMPLETE - #1");
        }
      );

    });
    
  }

  ngOnInit() {
    console.log('initializIng parent comp');
  }


}
