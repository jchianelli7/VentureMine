import { Component, ViewEncapsulation, OnInit, OnChanges, SimpleChange, Input, ViewChild, ElementRef, SimpleChanges, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { Auction } from 'src/app/models/Auction';
import { Bid } from 'src/app/models/Bid';

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


  private svgElement: HTMLElement;
  private chartProps: any;

  constructor() {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Change Detected In Graph Component: ");
    console.log(changes);
    if (this.bids &&  this.chartProps) {
      this.updateChart();
    } else if (this.bids && this.chartElement) {
      this.buildChart();
    }
  }

  ngAfterViewInit() {
    console.log("View Initialized");
    if (this.auction && this.bids) {
      console.log("Building Chart");
      this.buildChart();
    }
  }

  updateChart() {
    let _this = this;

  
    // Scale the range of the data again
    this.chartProps.x.domain(d3.extent(this.bids, function (d) {
      
        return d.pps;
      
    }));
  
    this.chartProps.y.domain(d3.extent(this.bids, function(d){
      return d.numShares;
    }));
    // this.chartProps.y.domain([0, d3.max(this.bids, function (d) { return Math.max(d.pps, d.numShares); })]);
  
    // Select the section we want to apply our changes to
    this.chartProps.svg.transition();
  
    // Make the changes to the line chart
    this.chartProps.svg.select('.line.strikePriceLine') // update the line
      .attr('d', this.chartProps.strikePriceLine(this.bids));
  
    // this.chartProps.svg.select('.line.line2') // update the line
    //   .attr('d', this.chartProps.valueline2(this.bids));
  
    this.chartProps.svg.select('.x.axis') // update x axis
      .call(this.chartProps.xAxis);
  
    this.chartProps.svg.select('.y.axis') // update y axis
      .call(this.chartProps.yAxis);

      this.chartProps.svg.append("g")
      .attr("stroke-width", 1.5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(this.bids)
  .join("g")
    .attr("transform", d => `translate(${this.chartProps.x(d.pps)},${this.chartProps.y(d.numShares)})`)
    .call(g => g.append("circle")
        .attr("stroke", "steelblue")
        .attr("fill", "none")
        .attr("r", 3))
    .call(g => g.append("text")
        .attr("dy", "0.35em")
        .attr("x", 7)
        .text(d => "PPS: " + d.pps + " # Shares: " + d.numShares));
  }


  buildChart() {
    this.chartProps = {};
    // Set the dimensions of the canvas / graph
    var margin = { top: 30, right: 20, bottom: 30, left: 50 },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // Set the ranges
    this.chartProps.x = d3.scaleLinear().range([width, 0]);
    this.chartProps.y = d3.scaleLinear().range([height, 0]);

    // Define the axes
    var xAxis = d3.axisBottom(this.chartProps.x).ticks(10);
    var yAxis = d3.axisLeft(this.chartProps.y).ticks(10);

    let _this = this;

    // Define the line
    var strikePriceLine = d3.line<Bid>()
      .x(function (d) {
        return _this.chartProps.x(d.pps);
      })
      .y(function (d) { return _this.chartProps.y(d.numShares); });

    // // Define the line
    // var valueline2 = d3.line<Bid>()
    //   .x(function (d) {

    //       return _this.chartProps.x(d.pps);

    //   })
    //   .y(function (d) { console.log('Open market'); return _this.chartProps.y(d.open); });

    var svg = d3.select(this.chartElement.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scale the range of the data
    this.chartProps.x.domain(
      d3.extent(_this.bids, function (d) {
        return d.pps;
      }));

      this.chartProps.y.domain(d3.extent(this.bids, function(d){
        return d.numShares;
      }));
    // this.chartProps.y.domain([0, d3.max(this.bids, function (d) {
    //   return Math.max(d.pps, d.numShares);
    // })]);

    // // Add the valueline2 path.
    // svg.append('path')
    //   .attr('class', 'line line2')
    //   .style('stroke', 'green')
    //   .style('fill', 'none');
    //   // .attr('d', valueline2(_this.bids));

    // Add the valueline path.
    svg.append('path')
      .attr('class', 'line strikePriceLine')
      .style('stroke', 'black')
      .style('fill', 'none')
      .attr('d', strikePriceLine(_this.bids));

    svg.append("g")
      .attr("stroke-width", 1.5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(this.bids)
  .join("g")
    .attr("transform", d => `translate(${this.chartProps.x(d.pps)},${this.chartProps.y(d.numShares)})`)
    .call(g => g.append("circle")
        .attr("stroke", "steelblue")
        .attr("fill", "none")
        .attr("r", 3))
    .call(g => g.append("text")
        .attr("dy", "0.35em")
        .attr("x", 7)
        .text(d => "PPS: " + d.pps + " # Shares: " + d.numShares));

    // Add the X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    // Add the Y Axis
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);



    // Setting the required objects in chartProps so they could be used to update the chart
    this.chartProps.svg = svg;
    this.chartProps.strikePriceLine = strikePriceLine;
    // this.chartProps.valueline2 = valueline2;
    this.chartProps.xAxis = xAxis;
    this.chartProps.yAxis = yAxis;
    // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("# of Shares");


      
      svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height - 6)
      .text("Price Per Share");



  }


}