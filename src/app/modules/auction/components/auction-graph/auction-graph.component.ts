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
import { Auction } from 'src/app/models/Auction';
import { Bid } from 'src/app/models/Bid';
import { AuctionService } from 'src/app/services/auction-service.service';
import { style } from 'd3';

@Component({
  selector: 'app-auction-graph',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './auction-graph.component.html',
  styleUrls: ['./auction-graph.component.css']
})
export class AuctionGraphComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('chart', { static: false }) chartElement: ElementRef;

  @Input() auction: Auction;
  @Input() bids: Bid[];
  @Input() volumeData: any[];

  private svgElement: HTMLElement;
  private chartProps: any;

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
    const margin = { top: 45, right: 50, bottom: 45, left: 50 },
      // width = 900 - margin.left - margin.right,
      // height = 500 - margin.top - margin.bottom;
      width = this.chartElement.nativeElement.clientWidth - margin.left - margin.right,
      height = this.chartElement.nativeElement.clientHeight - margin.top - margin.bottom;

    // Set the ranges
    this.chartProps.x = d3.scaleLinear().range([width, 0]);
    this.chartProps.y = d3.scaleLinear().range([height, 0]);
    this.chartProps.y2 = d3.scaleLinear().range([height, 0]);        // TODO: Manipulate this to look good AND COLOR CODE AXIS & DATA POINTS/LINES TO MATCH

    // Define the axes
    const xAxis = d3.axisBottom(this.chartProps.x).ticks(20);
    // const yAxis = d3.axisLeft(this.chartProps.y).ticks(10);
    const yAxis2 = d3.axisRight(this.chartProps.y2).ticks(20);

    const _this = this;
    const me = this;


    const div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const svg = d3.select(this.chartElement.nativeElement)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append('svg')
      .style('fill', 'steelblue')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);


    // this.chartProps.x.domain(d3.extent(this.auction.bids, function(d){ return d.pps}));
    this.chartProps.x.domain([0, d3.max(this.auction.volumeData, function (d) { return d.pps })]);
    this.chartProps.y.domain([0, d3.max(this.auction.bids, function (d) { return d.numShares })]);
    this.chartProps.y2.domain([0, d3.max(this.volumeData, function (d) { return d.shareCount })])

    const volumeArea = d3.area()
      .x(function (b) { return _this.chartProps.x(Number(b.pps)); })
      .y0(height)
      .y1(function (b) { return _this.chartProps.y2(Number(b.shareCount)) })
      .curve(d3.curveMonotoneX)


    // Add the X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    // Add the Y Axis
    // svg.append('g')
    //   .attr('class', 'y axis')
    //   .call(yAxis);

    // Add the y2 Axis
    svg.append('g')
      .attr('transform', 'translate(' + width + ' ,0)')
      .attr('class', 'y2 axis')
      .call(yAxis2);

    var data = [];
    data.push([]);
    data.push([]);
    this.auction.volumeData.sort(function (a, b) {
      return b.pps - a.pps;
    });

    this.auction.volumeData.forEach(function (d) {
      if (d.pps >= me.auction.currentStrikePrice) {
        data[1].push(d);
        if (d.pps === me.auction.currentStrikePrice) {
          data[0].push(d);
        }
      } else {
        data[0].push(d);
      }
    })

    data.forEach(function (d) {
      let c;
      console.log(d);
      if (d[0].pps >= me.auction.currentStrikePrice) {
        c = "green";
      } else {
        c = "darkgray";
      }
      if (d[0].pps === me.auction.currentStrikePrice) {
        c = "darkgray"
      }
      svg.append('path')
        .datum(d)
        .attr("class", "area")
        .attr("stroke", c)
        .style('opacity', .6)
        .style("fill", c)
        .attr('d', volumeArea)
    });


    // Setting the required objects in chartProps so they could be used to update the chart
    this.chartProps.svg = svg;

    // text label for the y axis

    // svg.append('text')
    //   .attr('transform', 'rotate(-90)')
    //   .attr('y', 0 - margin.left)
    //   .attr('x', 0 - (height / 2))
    //   .attr('dy', '1em')
    //   .style('font-weight', 'bold')
    //   .style('color', 'black')
    //   .style('text-anchor', 'middle')
    //   .text('# of Shares');

    svg.append('text')
      .attr('x', (width / 2))
      .attr('y', height + 25)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .attr('dy', '1em')
      .text('Price Per Share ($)');

    svg.append('text')
      .attr('transform', 'rotate(90)')
      .attr('x', 255)
      .attr('y', -1 * (width + margin.right + 3))
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .attr('dy', '1em')
      .text('Volume');

    svg.append('path')
      .datum(this.volumeData.sort(function (a, b) {
        return a.pps - b.pps;
      }))
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 1.5)
      .attr('id', 'bidLine')
      .attr('d', d3.line()
        .x(function (bid) {
          return _this.chartProps.x(Number(bid.pps));
        })
        .y(function (bid) {
          return _this.chartProps.y2(Number(bid.shareCount));
        })
        .curve(d3.curveMonotoneX)
      );

    // Add the valueline path.
    svg.append('line')
      .attr('class', 'line strikePriceLine')
      .style('stroke', 'red')
      .style('opacity', .8)
      .style('stroke-width', 4)
      .style('fill', 'none')
      .attr('x1', this.chartProps.x(this.auction.currentStrikePrice))
      .style('fill', 'none')
      .attr('x2', this.chartProps.x(this.auction.currentStrikePrice))
      .attr('y1', 0)
      .attr('y2', height);
  }




  updateChart() {
    const _this = this;
    d3.selectAll("svg").remove();
    this.buildChart();

    // const margin = {top: 45, right: 50, bottom: 45, left: 50},
    //   width = this.chartElement.nativeElement.clientWidth - margin.left - margin.right,
    //   height = this.chartElement.nativeElement.clientHeight - margin.top - margin.bottom;
    // // Scale the range of the data again

    // // Select the section we want to apply our changes to
    // this.chartProps.svg.transition();

    // this.chartProps.svg.selectAll(".area").remove();
    // // Make the changes to the line chart

    // // Set Domain of Axis'
    // this.chartProps.x.domain([0, d3.max(this.auction.volumeData, function(d) { return d.pps})]);
    // this.chartProps.y.domain([0, d3.max(this.auction.bids, function(d) { return d.numShares})]);
    // this.chartProps.y2.domain([0, d3.max(this.auction.volumeData, function(d) { return d.shareCount})])

    // this.chartProps.svg.select('.line') // update the line
    //   .attr('x1', this.chartProps.x(this.auction.currentStrikePrice))
    //   .style('opacity', .8)
    //   .style('fill', 'none')
    //   .attr('x2', this.chartProps.x(this.auction.currentStrikePrice))
    //   .attr('y1', 0)
    //   .attr('y2', height - margin.top);


    // /* TESTING */
    // const me = this;
    // const volumeArea = d3.area()
    // .x(function(b) {return _this.chartProps.x(Number(b.pps)); })
    // .y0(height)
    // .y1(function(b) {return _this.chartProps.y2(Number(b.shareCount))})
    // var data = [];
    //   data.push([]);
    //   data.push([]);
    //   this.auction.volumeData.sort(function( a, b ) {
    //     return b.pps - a.pps;
    //   });

    //   this.auction.volumeData.forEach(function (d){
    //     if(d.pps >= me.auction.currentStrikePrice){
    //       data[1].push(d);
    //       if(d.pps === me.auction.currentStrikePrice){
    //         data[0].push(d);
    //       }
    //     }else{
    //       data[0].push(d);
    //     }
    //   })

    //   data.forEach(function(d) {
    //     let c;
    //     console.log(d);    
    //     if(d[0].pps >= me.auction.currentStrikePrice){
    //       c = "green";
    //     }else{
    //       c = "gray";
    //     }
    //     if(d[0].pps === me.auction.currentStrikePrice){
    //       c = "gray"
    //     }
    //     me.chartProps.svg.append('path')
    //     .datum(d)
    //     .attr("class", "area")
    //     .attr("stroke", c)
    //     .style("fill", c)
    //     .style('opacity', .5)
    //     .attr('d', volumeArea)
    //   });

    //   var line = d3.line()
    //   .x(function(bid) {
    //     return _this.chartProps.x(Number(bid.pps)); })
    //   .y(function(bid) {
    //     return _this.chartProps.y2(Number(bid.shareCount)); })
    //   // .curve(d3.curveMonotoneX)

    // this.chartProps.svg.select('#bidLine')
    //   .attr('d', line(this.auction.volumeData))
    //   // .attr('fill', "black");


  }

}
