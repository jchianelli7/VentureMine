import { Component, ViewEncapsulation, OnInit, OnChanges, SimpleChange, Input, ViewChild, ElementRef, SimpleChanges, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { Auction } from 'src/app/models/Auction';
import { Bid } from 'src/app/models/Bid';
import { AuctionService } from 'src/app/services/auction-service.service';

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

  constructor(private auctionService: AuctionService) {

  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Change Detected In Graph Component: ");
    console.log(changes);
    if (this.bids && this.chartProps) {
      this.updateChart();
      console.log("UPDATING CHART");
    } else if (this.bids && this.chartElement) {
      this.buildChart();
      console.log("ELSE - BUILDING CHART");
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
    var xExtent = d3.extent(this.bids, function(b) { return b.pps; }),
  xRange = xExtent[1] - xExtent[0],
  yExtent = d3.extent(this.bids, function(b) { return b.numShares; }),
  yRange = yExtent[1] - yExtent[0];

// set domain to be extent +- 5%
this.chartProps.x.domain([xExtent[0] - (xRange * .05), xExtent[1] + (xRange * .05)]);
this.chartProps.y.domain([yExtent[0] - (yRange * .05), yExtent[1] + (yRange * .05)]);
  
    // Select the section we want to apply our changes to
    this.chartProps.svg.transition();
  
    // Make the changes to the line chart
    // this.chartProps.svg.select('.line.strikePriceLine') // update the line
    //   .attr('d', this.chartProps.strikePriceLine(this.bids));
  
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  this.chartProps.svg.select('.x.axis') // update x axis
      .call(this.chartProps.xAxis);
  
  this.chartProps.svg.select('.y.axis') // update y axis
      .call(this.chartProps.yAxis);



  var points = this.chartProps.svg.selectAll("circle").data(this.bids);
  points.enter().append("circle");  // create a new circle for each value

  points  
  .attr("r", 3) 
  .attr("cx", function(d) { return _this.chartProps.x(d.pps); })
  .attr("cy", function(d) { return _this.chartProps.y(d.numShares); }).on("mouseover", function(d) {
    div.transition()
      .duration(200)
      .style("opacity", .9)
      .style("width", "auto")
      .style("height", "auto");
    div.html("PPS: $" + d.pps + "<br/> # Shares: " + d.numShares)
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
    })
  .on("mouseout", function(d) {
    div.transition()
      .duration(500)
      .style("opacity", 0);
    });

  points.exit().remove();
  }


  buildChart() {
    this.chartProps = {};
    // Set the dimensions of the canvas / graph
    var margin = { top: 45, right: 20, bottom: 45, left: 50 },
      // width = 900 - margin.left - margin.right,
      // height = 500 - margin.top - margin.bottom;
      width = this.chartElement.nativeElement.clientWidth - margin.left - margin.right,
      height = this.chartElement.nativeElement.clientHeight - margin.top - margin.bottom;

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

      var div = d3.select("body").append("div")
    .attr("class", "tooltip") 
    .style("opacity", 0);

    var svg = d3.select(this.chartElement.nativeElement)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);


      var xExtent = d3.extent(this.bids, function(b) { return b.pps; }),
      xRange = xExtent[1] - xExtent[0],
      yExtent = d3.extent(this.bids, function(b) { return b.numShares; }),
      yRange = yExtent[1] - yExtent[0];
    
    // set domain to be extent +- 5%
    this.chartProps.x.domain([xExtent[0] - (xRange * .05), xExtent[1] + (xRange * .05)]);
    this.chartProps.y.domain([yExtent[0] - (yRange * .05), yExtent[1] + (yRange * .05)]);

    // Add the valueline path.
    // svg.append('path')
    //   .attr('class', 'line strikePriceLine')
    //   .style('stroke', 'black')
    //   .style('fill', 'none')
    //   .attr('d', strikePriceLine(_this.bids));


    // Add the X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    // Add the Y Axis
    svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

      svg.selectAll("dot")
     .data(this.bids)
   .enter().append("circle")
     .attr("r", 3)
     .attr("cx", function(d) { return _this.chartProps.x(d.pps); })
     .attr("cy", function(d) { return _this.chartProps.y(d.numShares); })
     .on("mouseover", function(d) {
       div.transition() 
         .duration(200)
         .style("opacity", .9)
         .style("width", "auto")
         .style("height", "auto");
       div.html("PPS: $" + d.pps + "<br/> # Shares: " + d.numShares)
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
       })
     .on("mouseout", function(d) {
       div.transition()
         .duration(500)
         .style("opacity", 0);
       });


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
      .attr("x", (width/2))
      .attr("y", height + 25)
      .style("text-anchor", "middle") 
      .attr("dy", "1em")
      .text("Price Per Share ($)");
  }


}