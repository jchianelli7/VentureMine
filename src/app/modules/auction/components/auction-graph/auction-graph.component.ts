import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
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

    var xExtent = d3.extent(this.auction.volumeData, function (d) {
        return d.pps;
      }),
      xRange = xExtent[1] - xExtent[0],
      yExtent = d3.extent(this.auction.volumeData, function (d) {
        return d.shareCount;
      }),
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

    var svg = d3.select(this.chartElement.nativeElement)
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

    var data = this.parseVolumeData()

    // List of subgroups = header of the csv files = soil condition here
    var subgroups = data.columns.slice(1)
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function (d) {
      return (d.pps)
    }).keys()

    // Add the X Axis
    var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .style('stroke', 'black')
      .style('fill', 'white')
      .call(xAxis);

    // Add the y2 Axis
    var y = d3.scaleLinear()
      .domain([0, 300])
      .range([height, 0]);
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

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#4daf4a', '#e41a1c'])

    //stack per subgroup
    var stackedData = d3.stack()
      .keys(subgroups)
      (data)

    // ----------------
    // Create a tooltip
    // ----------------
    var tooltip = d3.select("#chart")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
      var subgroupName = d3.select(this.parentNode).datum().key;
      var subgroupValue = d.data[subgroupName];
      tooltip
        .html(subgroupValue)
        .style("opacity", 1)
    }
    var mousemove = function (d) {
      tooltip
        .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function (d) {
      tooltip
        .style("opacity", 0)
    }

    // Show the bars
    svg.append("g")
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter().append("g")
      .attr("fill", function (d) {
        return color(d.key);
      })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(function (d) {
        return d;
      })
      .enter().append("rect")
      .attr("x", function (d) {
        return x(d.data.pps);
      })
      .attr("y", function (d) {
        return y(d[1]);
      })
      .attr("height", function (d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x.bandwidth())
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

    // Add the valueline path.
    if (this.auction.reserveMet) {
      svg.append('line')
        .attr('class', 'line strikePriceLine')
        .style('stroke', 'blue')
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

  /**
   * Method to parse the data into object readable by stacked bar
   */
  parseVolumeData() {
    var tmpVolumeData = this.auction.volumeData
    tmpVolumeData = this.removeDuplicates(tmpVolumeData, 'pps')
    var shares = this.auction.sharesOffered
    tmpVolumeData.sort((a, b) => (a.pps > b.pps) ? -1 : 1)
    tmpVolumeData.forEach(function (bid: any) {
      bid.winning = 0
      bid.losing = 0
      if (shares - bid.shareCount > 0) {
        bid.winning = bid.shareCount == undefined ? 0 : bid.shareCount
        bid.losing = 0
        shares -= bid.shareCount
      } else {
        // The remaining losing bids for this bid (pps)
        var bidLosing = bid.shareCount - shares
        bid.winning = shares
        bid.losing = bidLosing
        shares = 0
      }
      delete bid.shareCount
    })
    tmpVolumeData['columns'] = ['pps', 'winning', 'losing']
    return tmpVolumeData
  }

  /**
   * Method to remove duplicate
   * (used in buildChart to remove duplicate pps objects)
   */
  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  updateChart() {
    d3.selectAll('svg').remove();
    this.buildChart();
  }

}
