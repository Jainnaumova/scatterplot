import * as d3 from "d3";

const MARGIN = { TOP: 10, BOTTOM: 80, LEFT: 70, RIGHT: 10 };
const WIDTH = 500 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 300 - MARGIN.TOP - MARGIN.BOTTOM;

class D3Chart {
  constructor(element, data) {
    let vis = this;

    vis.data = data;

    vis.g = d3
      .select(element)
      .append("svg")
      .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .append("g")
      .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

    // add scales
    vis.x = d3.scaleLinear().range([0, WIDTH]);

    vis.y = d3.scaleLinear().range([HEIGHT, 0]);

    // add axises group
    vis.xAxisGroup = vis.g
      .append("g")
      .attr("transform", `translate(0, ${HEIGHT})`);
    vis.yAxisGroup = vis.g.append("g");

    // add labels in the constructor since we're not going to change labels
    vis.g
      .append("text")
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + 40)
      .attr("font-size", 20)
      .attr("text-anchor", "middle")
      .text("Age");

    vis.g
      .append("text")
      .attr("x", -(HEIGHT / 2))
      .attr("y", -50)
      .attr("transform", "rotate(-90)")
      .text("Height in cm");

    vis.update();
  }

  update() {
    let vis = this;

    // add scales
    vis.x.domain([0, d3.max(vis.data, d => Number(d.age))]);
    vis.y.domain([0, d3.max(vis.data, d => Number(d.height))]);

    // add axises call
    const xAxisCall = d3.axisBottom(vis.x);
    const yAxisCall = d3.axisLeft(vis.y);

    vis.xAxisGroup.call(xAxisCall);
    vis.yAxisGroup.call(yAxisCall);

    // JOIN
    const circles = vis.g.selectAll("circle").data(vis.data, d => d.name);

    // EXIT
    circles.exit().remove();

    // UPDATE
    circles.attr("cx", d => vis.x(d.age)).attr("cy", d => vis.y(d.height));

    // ENTER
    circles
      .enter()
      .append("circle")
      .attr("cx", d => vis.x(d.age))
      .attr("cy", d => vis.y(d.height))
      .attr("r", 5)
      .attr("fill", "grey");
  }
}

export default D3Chart;
