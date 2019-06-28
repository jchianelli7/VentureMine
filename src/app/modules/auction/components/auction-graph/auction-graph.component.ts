import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { AuctionService } from 'src/app/services/auction-service.service';
import { Auction } from 'src/app/models/Auction';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';
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
  initialData: ChartDataSets[] = [{ data: [] }];
  isReady: boolean = false;
  

  lineChartPlugins = [pluginAnnotations];
  chartType: ChartType = 'scatter';
  chartLabels: Label[] = ['Test 1', 'Test 2'];
  chartOptions: (ChartOptions & { annotation: any }) = null;
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
    this.auctionSub = this.auctionService.currentAuction.subscribe(auction => {
      this.auction = auction;
      this.graphData = auction.graphDataSets;
      this.strikePrice = auction.currentStrikePrice / 2;
      this.strikePriceAnnotation = {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: this.strikePrice,
        borderColor: 'orange',
        borderWidth: 3,
        label: {
          enabled: true,
          fontColor: 'black',
          content: 'Strike Price'
        }
      }
      this.mainChart.chart.update();
      // this.strikePriceAnnotation = 
    }, (err) => console.log("Error subbing"),
    );
    this.chartOptions = {
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

    console.log("Chart Initiated - Child");


  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Change Detected In Graph: ");
    if(this.mainChart){
      this.mainChart.chart.options.annotation.annotations[0] = changes.strikePriceAnnotation.currentValue;
      this.mainChart.chart.update();
    }
    console.log(this.mainChart);
    console.log(changes);
  }


}
