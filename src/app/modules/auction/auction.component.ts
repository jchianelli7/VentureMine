import {Component, OnInit, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Auction} from 'src/app/models/Auction';
import {AuctionService} from 'src/app/services/auction-service.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from "@angular/router";
import { BaseChartDirective } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import {ChartType, ChartOptions, ChartDataSets} from 'chart.js';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css']
})
export class AuctionComponent implements OnInit, OnChanges {
  
  @ViewChild('mainChart', {static: false}) mainChart: BaseChartDirective;
  chartType: ChartType = 'scatter';
  auction: Auction;
  strikePrice: number;
  isDataReady: boolean = false;
  graphDataSets: ChartDataSets[];
  lineChartPlugins = [pluginAnnotations];

  chartOptions: (ChartOptions & {annotation: any}) = {
    responsive: true,
    scales: {
      xAxes: [{
        id: 'x-axis-0',
        type: 'linear',
        position: 'bottom',
        scaleLabel: {
          display: true,
          labelString: '# of shares'
        }
      }],
      yAxes: [{
        id: 'y-axis-0',
        type: 'linear',
        position: 'left',
        scaleLabel: {
          display: true,
          labelString: 'PPS'
        }
      }],
    },
    annotation: {
      annotations: [
        {
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
        },
    },
    ],
  },
};

  chartColors = [
    {
      backgroundColor: '#28a745',
      pointBackgroundColor: '#28a745'
    }
  ];


  private auctionSub: Subscription;

  constructor(private auctionService: AuctionService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.auctionService.getAuction(this.route.snapshot.params.id).subscribe(auction => {
        this.auction = auction;
        console.log("Subbing 1");
        console.log(this.auction);
        this.strikePrice = this.auction.currentStrikePrice;
        this.graphDataSets = this.auction.graphDataSets;
        this.mainChart.chart.config.options.annotation.annotations[0] = {
        
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
      };
      this.mainChart.chart.update();
        this.isDataReady = true;
      });
    });
    console.log('initializIng parent comp');
    this.auctionSub = this.auctionService.currentAuction.subscribe(auction => {
      this.auction = auction;
      console.log("Subbing 2");
      console.log(this.strikePrice);
      this.strikePrice = this.auction.currentStrikePrice;
        this.graphDataSets = this.auction.graphDataSets;
        this.mainChart.chart.config.options.annotation.annotations[0] = {
        
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
      };
    });
    this.mainChart.chart.update();
    this.isDataReady = true;
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Parent Changed: ");
    console.log(changes);
    
  }

  bidPlaced(auction: Auction) {
    console.log('In Parent Component - Auction');
    this.auction = auction;
  }

}
