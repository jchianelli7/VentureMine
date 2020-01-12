import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  SimpleChange,
  Input,
  ViewChild,
  ElementRef,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';
import * as d3 from 'd3';
import {Auction} from 'src/app/models/Auction';
import {Bid} from 'src/app/models/Bid';
import {AuctionService} from 'src/app/services/auction-service.service';
import {style} from 'd3';

@Component({
  selector: 'app-auction-graph',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './auction-graph.component.html',
  styleUrls: ['./auction-graph.component.css']
})
export class AuctionGraphComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('chart', {static: false}) chartElement: ElementRef;

  @Input() auction: Auction;
  @Input() bids: Bid[];
  @Input() volumeData: any[];

  private svgElement: HTMLElement;
  private chartProps: any;
  private showStrikePrice = false;

  constructor(private auctionService: AuctionService) {

  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.bids && this.chartProps) {
      this.updateChart();
    } else if (this.bids && this.chartElement) {
      this.buildChart();
    }
  }

  ngAfterViewInit() {
    if (this.auction && this.bids) {
      console.log('Building Chart');
      this.buildChart();
    }
  }

  buildChart() {
    this.chartProps = {};
    // Set the dimensions of the canvas / graph
    const margin = {top: 45, right: 50, bottom: 45, left: 50},
      // width = 900 - margin.left - margin.right,
      // height = 500 - margin.top - margin.bottom;
      width = this.chartElement.nativeElement.clientWidth - margin.left - margin.right,
      height = this.chartElement.nativeElement.clientHeight - margin.top - margin.bottom;

    // Set the ranges
    this.chartProps.x = d3.scaleLinear().range([width, 0]);
    this.chartProps.y = d3.scaleLinear().range([height, 0]);
    this.chartProps.y2 = d3.scaleLinear().range([height, 0]);        // TODO: Manipulate this to look good AND COLOR CODE AXIS & DATA POINTS/LINES TO MATCH

    var xExtent = d3.extent(this.auction.volumeData, function(d) { return d.pps; }),
      xRange = xExtent[1] - xExtent[0],
      yExtent = d3.extent(this.auction.volumeData, function(d) { return d.shareCount; }),
      yRange = yExtent[1] - yExtent[0];

    // Define the axes
    const xAxis = d3.axisBottom(this.chartProps.x).ticks(55);
    // const yAxis = d3.axisLeft(this.chartProps.y).ticks(10);
    const yAxis2 = d3.axisRight(this.chartProps.y2).ticks(10);

    const _this = this;
    const me = this;


    const div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const svg = d3.select(this.chartElement.nativeElement)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('svg')
      .style('fill', 'steelblue')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);


    // this.chartProps.x.domain(d3.extent(this.auction.bids, function(d){ return d.pps}));

    this.chartProps.x.domain([xExtent[0] - (xRange * .05) + 1, xExtent[1] + (xRange * .05) - 1]);
    this.chartProps.y.domain([yExtent[0] - (yRange * .05), yExtent[1] + (yRange * .05)]);
    this.chartProps.y2.domain([yExtent[0] - (yRange * .05), yExtent[1] + (yRange * .05)]);

    const volumeArea = d3.area()
      .x(function(b) {
        return _this.chartProps.x(Number(b.pps));
      })
      .y0(height)
      .y1(function(b) {
        return _this.chartProps.y2(Number(b.shareCount));
      })
      .curve(d3.curveMonotoneX);


    // Add the X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .style('stroke', 'black')
      .style('fill', 'white')
      .call(xAxis);

    // Add the y2 Axis
    svg.append('g')
      .attr('transform', 'translate(' + width + ' ,0)')
      .attr('class', 'y2 axis')
      .style('fill', 'white')
      .style('stroke', 'black')
      .call(yAxis2);


    // Setting the required objects in chartProps so they could be used to update the chart
    this.chartProps.svg = svg;

    /* Text Labels For Axis' */
    svg.append('text')
      .attr('x', (width / 2))
      .attr('y', height + 25)
      .style('text-anchor', 'middle')
      // .style('font-weight', 'bold')
      .style('fill', 'black')
      .attr('dy', '1em')
      .text('Price Per Share ($)');

    svg.append('text')
      .attr('transform', 'rotate(90)')
      .attr('x', 255)
      .attr('y', -1 * (width + margin.right + 3))
      .style('text-anchor', 'middle')
      // .style('font-weight', 'bold')
      .attr('dy', '1em')
      .style('fill', 'black')
      .text('Volume');

    svg.selectAll('.bar')
      .data(this.auction.volumeData)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('fill', function(d) {
        console.log(d);
        return ((d.pps >= me.auction.currentStrikePrice) && (me.auction.reserveMet)) ? '#3FBF48' : 'steelblue';
      })
      .attr('x', function(d) {
        return me.chartProps.x(d.pps) - 15 / 2;
      })
      .attr('width', Number(15))
      .attr('y', function(d) {
        return me.chartProps.y2(d.shareCount);
      })
      .attr('height', function(d) {
        return height - me.chartProps.y2(d.shareCount);
      });

    // Add the valueline path.
    if (this.auction.reserveMet)  {
      svg.append('line')
        .attr('class', 'line strikePriceLine')
        .style('stroke', 'red')
        .style('opacity', .8)
        .style('stroke-width', 4)
        .style('fill', 'none')
        .attr('x1', this.chartProps.x(this.auction.currentStrikePrice))
        .style('fill', 'none')
        .attr('x2', this.chartProps.x(this.auction.currentStrikePrice))
        .attr('y1', 2)
        .attr('y2', height);
    }
  }


  updateChart() {
    d3.selectAll('svg').remove();
    this.buildChart();
  }

}
