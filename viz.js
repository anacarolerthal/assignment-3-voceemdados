var width = 960;
var height = 400;

var viz1 = d3.select("#viz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
	
var projection = d3.geoMercator()
  .center([-43.1729, -22.9068]) // centro em RJ
  .scale(7500)
  .translate([width / 2, height / 2+110]);
 
var data = d3.map();

var path = d3.geoPath()
  .projection(projection);
  
var colorScale = d3.scaleLinear()
.domain([5, 10])
.range(["white", "#5E50D9"]);


var brush = d3.brush()
  .extent([[0, 0], [width, height]])

var brushGroup = viz1.append("g")
  .attr("class", "brush")
 
var selectedYear = "2020"; 

  
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/cidades.geojson")
  .defer(d3.csv, "https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/apgar1Mean_" + selectedYear + ".csv", function(d) {    
	data.set(d.id_municipio.replace("$", ""), 
	{apgar1: +d.apgar1,
      nome_municipio: d.nome_municipio,
	  year: d.ano
	  })
	;})
  .await(ready);
  
console.log(data);

d3.select("#year") // listen for changes to the year dropdown menu
  .on("change", function() {
    selectedYear = this.value;
    updateData(selectedYear);
  });


brushGroup.call(brush);

function updateData(year) {
	console.log(year)
d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/cidades.geojson")
  .defer(d3.csv, "https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/apgar1Mean_" + year + ".csv", function(d) {    
	data.set(d.id_municipio.replace("$", ""), 
	{apgar1: +d.apgar1,
      nome_municipio: d.nome_municipio,
	  year: d.ano
	  })
	;})
  .await(function(error, topo) {
      if (error) throw error;

      // Clear the existing paths
      viz1.selectAll("path").remove();

      // Redraw the visualization with the updated data
      viz1.selectAll("path")
        .data(topo.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke", "white")
        .attr("fill", function(d) {
          var cityData = data.get(d.properties.id_municipio);
          return cityData ? colorScale(cityData.apgar1) : "gray";
        })
        .on("mouseover", function() {
          d3.select(this)
            .attr("stroke", "red");
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke", "white");
        })
        .append("svg:title")
        .style("fill", "red")
        .text(function(d) {
          var cityData = data.get(d.properties.id_municipio);
          return (cityData && cityData.nome_municipio) ? (cityData.nome_municipio + ": " + cityData.apgar1) : "N/A";
        });
    });
}

function ready(error, topo) {
  viz1.selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "white")
    .attr("fill", function(d) {
      var cityData = data.get(d.properties.id_municipio);
      return cityData ? colorScale(cityData.apgar1) : "gray";
    })
    .on("mouseover", function() {
      d3.select(this)
        .attr("stroke", "red");
    })
    .on("mouseout", function() {
      d3.select(this)
        .attr("stroke", "white");
    })
    .append("svg:title")
    .style("fill", "red")
    .text(function(d) {
      var cityData = data.get(d.properties.id_municipio);
      return (cityData && cityData.nome_municipio) ? (cityData.nome_municipio + ": " + cityData.apgar1) : "N/A";
    });
}

var legendWidth = 20;
var legendHeight = 200;

// Define the legend SVG element
var legend = d3.select("#viz")
  .append("svg")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .attr("id", "legend");

// Define the color scale for the legend
var colorScaleLegend = d3.scaleLinear()
  .domain([0, 10])
  .range(["white", "#5E50D9"]);

// Create a linear gradient for the color legend
legend.append("defs")
  .append("linearGradient")
  .attr("id", "color-gradient")
  .attr("x1", 0)
  .attr("x2", 0)
  .attr("y1", 1)
  .attr("y2", 0)
  .selectAll("stop")
  .data(colorScaleLegend.range())
  .enter().append("stop")
  .attr("offset", function(d,i) { return i/(colorScaleLegend.range().length-1); })
  .attr("stop-color", function(d) { return d; });

// Draw the color legend
legend.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .attr("fill", "url(#color-gradient)");

// Add tick marks and labels to the color legend
var legendTicks = legend.append("g")
  .attr("class", "legend-ticks")
  .selectAll("g")
  .data(colorScaleLegend.ticks(10))
  .enter().append("g")
  .attr("transform", function(d,i) { return "translate(0," + ((i/10)*legendHeight) + ")"; });


legendTicks.append("text")
  .attr("x", 0)
  .attr("y", legendHeight/10)
  .attr("dy", -10)
  .attr("dx", 3)
  .attr("fill", "white")
  .text(function(d) { return 10 - d.toFixed(1); });
  
// Position the legend
legend.attr("transform", "translate(" + (550) + "," + (-350) + ")");

var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#viz2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/apgar1Mean_Combined.csv", function(data) {
  console.log(data);
  // X axis: scale and draw:
  var x = d3.scaleLinear()
      .domain([0, 10])    
      .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("fill", "white")
      .style("font-size", "12px");

  // set the parameters for the histogram
  var histogram = d3.histogram()
      .value(function(d) { return d.apgar1; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(10)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);  
  svg.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("fill", "white")
      .style("font-size", "12px");

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) - 2 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "white")

});
