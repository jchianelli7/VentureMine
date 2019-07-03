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
    this.chartOptions = {
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            reverse: true
          },
          id: 'x-axis-0',
          type: 'linear',
          position: 'bottom',
          scaleLabel: {
            display: true,
            labelString: 'Price Per Share (PPS)'
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          id: 'y-axis-0',
          type: 'linear',
          position: 'left',
          scaleLabel: {
            display: true,
            labelString: '# of shares'
          }
        }],
      },
      annotation: {
        annotations: [
          this.strikePriceAnnotation
        ],
      },
    };
    // this.auctionService.getBids(this.auction._id).subscribe(auction => {
    //   this.auction = auction;
    // })
    console.log("Chart Initiated - Child");

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Change Detected In Graph: ");
    if(this.mainChart && changes.strikePriceAnnotation.currentValue && changes.graphData.currentValue){
      console.log(this.mainChart);
    console.log(changes);
      this.mainChart.chart.options.annotation.annotations[0]  = changes.strikePriceAnnotation.currentValue;
      // this.mainChart.chart.data = changes.auction.currentValue.graphDataSets[0];
      console.log(this.mainChart);
      this.mainChart.chart.update();
    }
    console.log(this.mainChart);
    console.log(changes);
  }


}
