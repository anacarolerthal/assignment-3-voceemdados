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
.domain([0, 10])
.range(["white", "#5E50D9"]);

  // Preparar os dados
  var dadosPorAno = d3.nest()
    .key(function(d) { return d.data.getFullYear(); })
    .entries(data);
	
	
var slider = d3.select("#slider")
  .on("input", function() {
    var anoSelecionado = this.value;
    var dadosFiltrados = dadosPorAno.find(function(d) { return d.key == anoSelecionado; }).values;
    atualizarVisualizacao(dadosFiltrados);
  });

d3.queue()
  .defer(d3.json, "https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/cidades.geojson")
  .defer(d3.csv, "https://raw.githubusercontent.com/felipelmc/Nascidos-Vivos-Viz/main/apgar1Mean.csv", function(d) {    
	data.set(d.id_municipio.replace("$", ""), 
	{apgar1: +d.apgar1,
      nome_municipio: d.nome_municipio,
	  ano: new Date(d.ano)})
	;})
  .await(ready);
  
console.log(data);


function ready(error, topo) {
  viz1.selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("fill", function(d) {
      var cityData = data.get(d.properties.id_municipio);
      return cityData ? colorScale(cityData.apgar1) : "gray";
    })
    .on("mouseover", function() {
      d3.select(this)
        .attr("stroke", "red")
        .attr("stroke-width", 2);
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



const data2 = [10, 20, 30, 40, 50];

const svg2 = d3.select("#viz2")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500);

const pie2 = d3.pie()(data2);

const arc2 = d3.arc()
  .innerRadius(0)
  .outerRadius(200);

const colors2 = d3.scaleOrdinal()
  .range(d3.schemeCategory10);

const arcs2 = svg2.selectAll("g.arc")
  .data(pie2)
  .enter()
  .append("g")
  .attr("class", "arc")
  .attr("transform", "translate(250, 250)");

arcs2.append("path")
  .attr("fill", (d, i) => colors2(i))
  .attr("d", arc2);
