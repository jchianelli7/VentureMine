import {Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges} from '@angular/core';
import {ViewChild} from '@angular/core';
import {ChartType, ChartOptions, ChartDataSets} from 'chart.js';
import {Auction} from 'src/app/models/Auction';
import {BaseChartDirective} from 'ng2-charts';
import {Subscription} from 'rxjs';
import {AuctionService} from '../../../../services/auction-service.service';
import * as pluginAnnotations from 'chartjs-plugin-annotation';


@Component({
  selector: 'app-auction-graph',
  templateUrl: './auction-graph.component.html',
  styleUrls: ['./auction-graph.component.css']
})
export class AuctionGraphComponent implements OnInit, OnChanges {
  
  private auctionSub: Subscription;
  lineChartPlugins = [pluginAnnotations];

  @Input() auction: Auction;
  @Input() graphDataSets: ChartDataSets[];
  @Input() strikePrice: number;
 

  @ViewChild('mainChart', {static: false}) mainChart: BaseChartDirective;

  chartType: ChartType = 'scatter';
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
    ]
    }
  };
  chartColors = [
    {
      backgroundColor: '#28a745',
      pointBackgroundColor: '#28a745'
    }
  ];

  constructor(private auctionService: AuctionService) {
  }


  ngOnInit() {
    this.auctionSub = this.auctionService.currentAuction.subscribe(auction => {
      this.auction = auction;
      this.strikePrice = auction.currentStrikePrice;
    });
    // console.log(this.graphDataSets);
    console.log('Initializing Auction Graph Component');
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Graph Component - Change Detected: ");
    // console.log(changes.auc);
    console.log(changes);
    console.log("*********************************");
    this.mainChart.chart.update();
    // @ts-ignore
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
  console.log("Annotatgion: ");
  console.log(this.mainChart.chart.config.options.annotation);
  }

}
