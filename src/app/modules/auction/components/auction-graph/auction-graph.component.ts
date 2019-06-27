import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { AuctionService } from 'src/app/services/auction-service.service';
import { Auction } from 'src/app/models/Auction';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-auction-graph',
  templateUrl: './auction-graph.component.html',
  styleUrls: ['./auction-graph.component.css']
})
export class AuctionGraphComponent implements OnInit, OnChanges {

  @ViewChild('mainChart', { static: false }) mainChart: BaseChartDirective;

  private auctionSub: Subscription;

  @Input() strikePrice: number;
  @Input() auction: Auction;
  @Input() graphData: ChartDataSets[];
  @Input() strikePriceAnnotation: any;

  lineChartPlugins = [pluginAnnotations];
  chartType: ChartType = 'scatter';
  chartOptions: (ChartOptions & { annotation: any }) = {
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
        this.strikePriceAnnotation
      ],
    },
  };

  chartColors = [
    {
      backgroundColor: '#28a745',
      pointBackgroundColor: '#28a745'
    }
  ];

  constructor(private auctionService: AuctionService, private route: ActivatedRoute) {
    console.log("Graph Constructed");

  }

  ngOnInit() {
    console.log("Graph Initialized");
    const me = this;
    // console.log(this.mainChart);
    this.auctionSub = this.auctionService.currentAuction.subscribe(auction => {
      console.log("sub 2");
      this.auction = auction;
      this.graphData = this.auction.graphDataSets;
      this.strikePrice = this.auction.currentStrikePrice;
      // this.mainChart.chart.config.options.annotation.annotations[0] = {

      //   type: 'line',
      //   mode: 'horizontal',
      //   scaleID: 'y-axis-0',
      //   // value: this.auction.currentStrikePrice,
      //   value: me.strikePrice,
      //   borderColor: 'orange',
      //   borderWidth: 1,
      //   label: {
      //     enabled: true,
      //     fontColor: 'black',
      //     content: 'Strike Price'

      //   }
      // };
    }, (err) => console.log("Error subbing"),
    );


  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Change Detected In Graph: ");
    console.log(this.mainChart);
    console.log(changes);
  }


}
