import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {ViewChild} from '@angular/core';
import {ChartType, ChartOptions, ChartDataSets} from 'chart.js';
import {Auction} from 'src/app/models/Auction';
import {BaseChartDirective} from 'ng2-charts';
import {Subscription} from 'rxjs';
import {AuctionService} from '../../../../services/auction-service.service';

@Component({
  selector: 'app-auction-graph',
  templateUrl: './auction-graph.component.html',
  styleUrls: ['./auction-graph.component.css']
})
export class AuctionGraphComponent implements OnInit {
  @Input() auction: Auction;
  @Input() graphDataSets: ChartDataSets[];
  private auctionSub: Subscription;

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
    });
    // console.log(this.graphDataSets);
    console.log('Initializing Auction Graph Component');
  }

}
