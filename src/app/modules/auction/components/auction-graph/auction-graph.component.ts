import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ViewChild } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Auction } from 'src/app/models/Auction';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-auction-graph',
  templateUrl: './auction-graph.component.html',
  styleUrls: ['./auction-graph.component.css']
})
export class AuctionGraphComponent implements OnInit {
  @Input() auction: Auction;
  @Input() graphDataSets: ChartDataSets[];

  chartType: ChartType = 'scatter';
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom',
        scaleLabel: {
          display: true,
          labelString: '# of shares'
        }
      }],
      yAxes: [{
        type: 'linear',
        position: 'left',
        scaleLabel: {
          display: true,
          labelString: 'PPS'
        }
      }],
    }
  }
  constructor() { }

  ngOnInit() {
    console.log(this.graphDataSets);
  }

}
