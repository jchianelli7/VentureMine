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
    this.chartProps.x2 = d3.scaleOrdinal().range([width, 0]);
    this.chartProps.y = d3.scaleLinear().range([height, 0]);
    this.chartProps.y2 = d3.scaleLinear().range([height, height / 2]);        // TODO: Manipulate this to look good

    // Define the axes
    const xAxis = d3.axisBottom(this.chartProps.x).ticks(10);
    const yAxis = d3.axisLeft(this.chartProps.y).ticks(10);
    const yAxis2 = d3.axisRight(this.chartProps.y2).ticks(10);

    const _this = this;

    // Define the line
    const strikePriceLine = d3.line<Bid>()
      .x(this.auction.currentStrikePrice);


    const div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const svg = d3.select(this.chartElement.nativeElement)
      .append('svg')
      .style('fill', 'steelblue')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);


    const xExtent = d3.extent(this.bids, function(b) {
        return b.pps;
      }),
      xRange = xExtent[1] - xExtent[0],
      x2Extent = d3.extent(this.bids, function(b) {
        return b.pps;
      }),
      x2Range = x2Extent[1] - xExtent[0],
      yExtent = d3.extent(this.bids, function(b) {
        return b.numShares;
      }),
      yRange = yExtent[1] - yExtent[0],
      y2Extent = d3.extent(this.volumeData, function(v) {
        return v.shareCount;
      }),
      y2Range = y2Extent[1] - y2Extent[0];

    // set domain to be extent +- 5%
    this.chartProps.x.domain([xExtent[0] - (xRange * .05), xExtent[1] + (xRange * .05)]);
    this.chartProps.x2.domain([x2Extent[0] - (x2Range * .05), x2Extent[1] + (x2Range * .05)]);
    this.chartProps.y.domain([yExtent[0] - (yRange * .05), yExtent[1] + (yRange * .05)]);
    this.chartProps.y2.domain([y2Extent[0] - (y2Range * .05), y2Extent[1] + (y2Range * .05)]);

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


      // Add Volume Data Line  --- TODO: Is this how I really want to do it...?
    var volumeLine = d3.line()
    .x(function(pps, shareCount) { return _this.chartProps.x(pps); }) // set the x values for the line generator
    .y(function(pps, shareCount) { return _this.chartProps.y(shareCount); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX)



    // Add the X Axis
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      // .style("fill", "white")
      .call(xAxis);

    // Add the Y Axis
    svg.append('g')
      .attr('class', 'y axis')
      // .style("fill", "white")
      .call(yAxis);

    // Add the y2 Axis
    svg.append('g')
      .attr('transform', 'translate(' + width + ' ,0)')
      .attr('class', 'y axis')
      .call(yAxis2);

    svg.selectAll('dot')
      .data(this.bids)
      .enter().append('circle')
      .attr('fill', 'steelblue')
      .attr('r', 3)
      .attr('cx', function(d) {
        return _this.chartProps.x(d.pps);
      })
      .attr('cy', function(d) {
        return _this.chartProps.y(d.numShares);
      })
      .on('mouseover', function(d) {
        div.transition()
          .duration(200)
          .style('opacity', .9)
          .style('width', 'auto')
          .style('height', 'auto');
        div.html('PPS: $' + d.pps + '<br/> # Shares: ' + d.numShares)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', function(d) {
        div.transition()
          .duration(500)
          .style('opacity', 0);
      });

    const me = this;

    // svg.selectAll('bar')
    //   .data(this.volumeData)
    //   .enter().append('rect')
    //   .style('fill', 'black')
    //   .style('opacity', .25)
    //   .attr('x', function(b) {
    //     return me.chartProps.x(b.pps);
    //   })
    //   .attr('width', 10)
    //   .attr('y', function(b) {
    //     return me.chartProps.y2(b.shareCount);
    //   })
    //   .attr('height', function(b) {
    //     return height - me.chartProps.y2(b.shareCount);
    //   })
    //   .on('mouseover', function(d) {
    //     div.transition()
    //       .duration(200)
    //       .style('opacity', .9)
    //       .style('width', 'auto')
    //       .style('height', 'auto');
    //     div.html('PPS: ' + d.pps + '<br/>Vol:  ' + d.shareCount)
    //       .style('left', (d3.event.pageX) + 'px')
    //       .style('top', (d3.event.pageY - 28) + 'px');
    //   })
    //   .on('mouseout', function(d) {
    //     div.transition()
    //       .duration(500)
    //       .style('opacity', 0);
    //   })
    //   .exit().remove();



    // Setting the required objects in chartProps so they could be used to update the chart
    this.chartProps.svg = svg;
    this.chartProps.strikePriceLine = strikePriceLine;
    // this.chartProps.valueline2 = valueline2;
    this.chartProps.xAxis = xAxis;
    // this.chartProps.x2Axis = x2Axis;
    this.chartProps.yAxis = yAxis;
    this.chartProps.yAxis2 = yAxis2;
    // text label for the y axis
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('font-weight', 'bold')
      .style('color', 'black')
      .style('text-anchor', 'middle')
      .text('# of Shares');

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

      svg.append("path")
      .datum(this.volumeData.sort(function(a, b) {
        return a.pps - b.pps;
      }))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(bid) {
          return _this.chartProps.x(Number(bid.pps)) })
        .y(function(bid) {
          return _this.chartProps.y2(Number(bid.shareCount))})
        .curve(d3.curveMonotoneX)
        )
  }

  updateChart() {
    const _this = this;

    const margin = {top: 45, right: 50, bottom: 45, left: 50},
      // width = 900 - margin.left - margin.right,
      // height = 500 - margin.top - margin.bottom;
      width = this.chartElement.nativeElement.clientWidth - margin.left - margin.right,
      height = this.chartElement.nativeElement.clientHeight - margin.top - margin.bottom;
    // Scale the range of the data again
    const xExtent = d3.extent(this.bids, function(b) {
        return b.pps;
      }),
      xRange = xExtent[1] - xExtent[0],
      x2Extent = d3.extent(this.bids, function(b) {
        return b.pps;
      }),
      x2Range = x2Extent[1] - xExtent[0],
      yExtent = d3.extent(this.bids, function(b) {
        return b.numShares;
      }),
      yRange = yExtent[1] - yExtent[0],
      y2Extent = d3.extent(this.volumeData, function(v) {
        return v.shareCount;
      }),
      y2Range = y2Extent[1] - y2Extent[0];

// set domain to be extent +- 5%
    this.chartProps.x.domain([xExtent[0] - (xRange * .05), xExtent[1] + (xRange * .05)]);
    this.chartProps.x2.domain([x2Extent[0] - (x2Range * .05), x2Extent[1] + (x2Range * .05)]);
    this.chartProps.y.domain([yExtent[0] - (yRange * .05), yExtent[1] + (yRange * .05)]);
    this.chartProps.y2.domain([y2Extent[0] - (y2Range * .05), y2Extent[1] + (y2Range * .05)]);

    // Select the section we want to apply our changes to
    this.chartProps.svg.transition();


    // Make the changes to the line chart


    const div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    this.chartProps.svg.select('.x.axis') // update x axis
      .call(this.chartProps.xAxis);
  
    this.chartProps.svg.select('.y.axis') // update y axis
      .call(this.chartProps.yAxis);
    this.chartProps.svg.select('.y2.axis')
      .call(this.chartProps.yAxis2);

    this.chartProps.svg.select('.line') // update the line
      .attr('x1', this.chartProps.x(this.auction.currentStrikePrice))
      .style('opacity', .8)
      .style('fill', 'none')
      .attr('x2', this.chartProps.x(this.auction.currentStrikePrice))
      .attr('y1', 0)
      .attr('y2', height - margin.top);


    const points = this.chartProps.svg.selectAll('circle').data(this.bids);
    points.enter().append('circle');  // create a new circle for each value

    points
      .attr('r', 3)
      .attr('cx', function(d) {
        return _this.chartProps.x(d.pps);
      })
      .attr('cy', function(d) {
        return _this.chartProps.y(d.numShares);
      })
      .on('mouseover', function(d) {
      div.transition()
        .duration(200)
        .style('opacity', .9)
        .style('width', 'auto')
        .style('height', 'auto');
      div.html('PPS: $' + d.pps + '<br/> # Shares: ' + d.numShares)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px');
    })
      .on('mouseout', function(d) {
        div.transition()
          .duration(500)
          .style('opacity', 0);
      });
    points.exit().remove();


    const volumeBars = this.chartProps.svg.selectAll('bar').data(this.volumeData);
    volumeBars.enter().append('bar');
    const me = this;
    volumeBars
      .style('fill', 'black')
      .style('opacity', .25)
      .attr('x', function(b) {
        return me.chartProps.x(b.pps);
      })
      .attr('width', 10 / this.volumeData.length)
      .attr('y', function(b) {
        return me.chartProps.y2(b.shareCount);
      })
      .attr('height', function(b) {
        return height - me.chartProps.y2(b.shareCount);
      })
      .on('mouseover', function(d) {
        div.transition()
          .duration(200)
          .style('opacity', .9)
          .style('width', 'auto')
          .style('height', 'auto');
        div.html('PPS: ' + d.pps + '<br/>Vol:  ' + d.shareCount)
          .style('left', (d3.event.pageX) + 'px')
          .style('top', (d3.event.pageY - 28) + 'px');
      })
      .on('mouseout', function(d) {
        div.transition()
          .duration(500)
          .style('opacity', 0);
      });
    volumeBars.exit().remove();
  }

}
