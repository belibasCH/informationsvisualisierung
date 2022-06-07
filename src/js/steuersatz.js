
function makeVisible(value) {
  document.getElementById("infoText" + value).style.display = "block";
  document.getElementById("infoText" + value).style.visibility = "visible";
}
function hide(value) {
  document.getElementById("infoText" + value).style.display = "none";
  document.getElementById("infoText" + value).style.visibility = "hidden";
}




const steuerdaten = d3.csv("./data/MasterDaten.CSV").then(function (data) {
  // console.log("data", data);

  // Länge des Arrays steuerdaten.length
  var yearsTax = [2019, 2020, 2021];

  var line_dataTax = d3.map(data, d => {
    return {
      "values": d3.map(yearsTax, e => [e, parseInt(d[e])]),
      "kanton": d["kanton"]
    }
  });

  //console.log(steuerdaten);


  // define svn size and margin.
  const canvHeightTax = 600, canvWidthTax = 1200;
  const marginTax = { top: 50, right: 20, bottom: 30, left: 60 };


  // compute the width and height of the actual chart area.
  const widthTax = canvWidthTax - marginTax.left - marginTax.right;
  const heightTax = canvHeightTax - marginTax.top - marginTax.bottom;
  const translationConstX = 300;
  const translationConstY = -10;

  // get reference to <body>-Tag

  const steuersatzSVG = d3.select("#taxDiagram").append("svg")
    .attr("id", "taxBody")
    .attr("width", canvWidthTax)
    .attr("height", canvHeightTax);

  // create parent group and append as child to <svg>-Tag.

  const groupSteuersatz = steuersatzSVG.append("g")
    .attr("id", "chart-area")
    .attr("transform", `translate(${marginTax.left},${marginTax.top})`);

  steuersatzSVG.append("text")
    .attr("id", "chart-title")
    .attr("transform", "rotate(-90)")
    .attr("x", "-300px")
    .attr("y", 50)
    .attr("dy", "1.5em")  // line height
    .attr("font-family", "sans-serif")
    .attr("font-size", "24px")
    .style("text-anchor", "middle")
    .text("Tax rate %");

  const xScaleTax = d3.scaleBand().rangeRound([0, 800]).paddingOuter(-0.5).domain(yearsTax);
  // const xScale = d3.scaleLinear().domain([years[2], years[0]]).range([800, 0]);


  // 1. create xAxis
  const xAxisTax = d3.axisBottom(xScaleTax);

  groupSteuersatz.append("g")
    .attr("id", "xAxis")
    .attr("transform", "translate(100," + (heightTax - 30) + ")")
    .call(xAxisTax);

  // const yScale = d3.scaleLinear().domain(data).range([heightTax / 2, 0]);
  const yScaleTax = d3.scaleLinear().domain([94, 120]).range([500, 0]);
  //statisch machen mit min und max

  // create yAxis
  const yAxisTax = d3.axisLeft(yScaleTax);
  // create new group (step 2 and 3)

  groupSteuersatz.append("g")
    .attr("id", "yAxis")
    .attr("transform", "translate(100," + ((heightTax / 10) - 62) + ")")
    .call(yAxisTax);

  groupSteuersatz.append('g')
    .attr("class", "circle-plots")
    .selectAll("circle.dot")
    .data(line_dataTax)
    .enter()
    .append("circle")
    .attr("class", "dot")
    //.attr("debug", d => console.log("circle_plot_data" , d.values))
    .attr("cx", d => xScaleTax(d.values[0][0]))
    .attr("cy", d => yScaleTax(d.values[0][1]))
    .attr("r", 2)
    .attr("transform", "translate(" + translationConstX + "," + translationConstY + ")")
    .attr("class", "bar")
    .style("fill", "#B5B5B5");


  var lineGeneratorTax = d3.line()
    .x(d => xScaleTax(d[0]))
    .y(d => yScaleTax(d[1]));

  var linePlots = groupSteuersatz.append("g")
    .attr("class", "line-plots")
    .attr("transform", "translate(" + translationConstX + "," + translationConstY + ")");

  linePlots.selectAll("path.line")
    .data(line_dataTax)
    .enter()
    .append("path")
    .attr("class", "line")
    //.attr("debug", d => console.log("line_generator_data", d))
    .attr("d", d => lineGeneratorTax(d.values))
    .attr("id", d => "line" + d["kanton"])
    .attr("class", "lineProp")
    .style("fill", "none")
    .style("stroke", "#B5B5B5")
    .style("stroke-width", "4");

  d3.selectAll("#lineSchaffhausen")
    .style("stroke-width", "6")
    .style("stroke", "#FFD72E");


  var labelsTax = d3.map(data, d => [d.kanton, yScaleTax(d["2021"])]).sort(function (x, y) {
    return d3.ascending(x[1], y[1]);
  });

  //console.log(labelsTax);

  linePlots.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    //.attr("debug", d => console.log("kanton_data", d))
    .attr("x", 610)
    .attr("y", d => yScaleTax(d["2021"]) + 5)
    .text(function (d) { return d.kanton })
    .attr("style", "font-size: 20; font-family: Helvetica, sans-serif")
    .attr("id", d => "cText" + d["kanton"]);


  d3.selectAll("#cTextSchaffhausen")
    .style("fill", "#F3C814")
    .style("font-size", "24")
    .style("font-weight", "bold");

  steuersatzSVG.append("svg:image")
    .attr('x', 550)
    .attr('y', 500)
    .attr("class", "bar")
    .attr('width', 20)
    .attr('height', 48)
    .attr("xlink:href", "src/assets/down-arrow.png");

  steuersatzSVG.append("svg:image")
    .attr('x', 550)
    .attr('y', 20)
    .attr('width', 20)
    .attr('height', 48)
    .attr("xlink:href", "src/assets/up-arrow.png");

  steuersatzSVG.append("text")
    .attr("id", "element-below")
    .attr("x", 630)
    .attr("y", 507)
    .attr("dy", "1.5em")  // line height
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("class", "bar")
    .style("text-anchor", "middle")
    .style("fill", "#B5B5B5")
    .text("1 kanton below");

  steuersatzSVG.append("text")
    .attr("id", "elements-above")
    .attr("x", 630)
    .attr("y", 30)
    .attr("dy", "1.5em")  // line height
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .attr("class", "bar")
    .style("text-anchor", "middle")
    .style("fill", "#B5B5B5")
    .text("4 kantons above");

  steuersatzSVG.append("rect")
    .attr("id", "hoverboxBelow")
    .attr("width", 140)
    .attr("height", 30)
    .attr("x", 550)
    .attr("y", 507)
    .attr("rx", 10)
    .attr("fill", "transparent");


  steuersatzSVG.append("rect")
    .attr("id", "hoverboxAbove")
    .attr("width", 140)
    .attr("height", 30)
    .attr("x", 550)
    .attr("y", 30)
    .attr("rx", 10)
    .attr("fill", "transparent");


  // Kantons above 
  var tooltipAbove = d3.select("#taxBody")
    .append("g")
    .attr("id", "groupTag")
    .style("visibility", "hidden");

  d3.select("#groupTag")
    .append("rect")
    .attr("id", "rectAbove")
    .attr("x", 540)
    .attr("y", 60)
    .attr("width", 150)
    .attr("height", 130)
    .style("fill", "white")
    .style("stroke", "solid")
    .style("stroke-width", "1px")
    .style("stroke", "#B5B5B5")
    .style("rx", "5px");

  d3.select("#groupTag")
    .append("text")
    .attr("x", 605)
    .attr("y", 70)
    .attr("dy", "1.5em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .style("text-anchor", "middle")
    .style("fill", "#B5B5B5")
    .text("Herisau (330%)");

  d3.select("#groupTag")
    .append("text")
    .attr("x", 605)
    .attr("y", 95)
    .attr("dy", "1.5em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .style("text-anchor", "middle")
    .style("fill", "#B5B5B5")
    .text("Bern (306%)");

  d3.select("#groupTag")
    .append("text")
    .attr("x", 605)
    .attr("y", 120)
    .attr("dy", "1.5em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .style("text-anchor", "middle")
    .style("fill", "#B5B5B5")
    .text("Delemont (285%)");

  d3.select("#groupTag")
    .append("text")
    .attr("x", 605)
    .attr("y", 145)
    .attr("dy", "1.5em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .style("text-anchor", "middle")
    .style("fill", "#B5B5B5")
    .text("Luzern (160%)");

  d3.select("#hoverboxAbove")
    .on("mouseover", function () { return tooltipAbove.style("visibility", "visible"); })
    .on("mouseout", function () { return tooltipAbove.style("visibility", "hidden"); });





  // Kantons below
  var tooltipBelow = d3.select("#taxBody")
    .append("g")
    .attr("id", "groupTagBelow")
    .style("visibility", "hidden");

  d3.select("#groupTagBelow")
    .append("rect")
    .attr("id", "rectBelow")
    .attr("x", 540)
    .attr("y", 460)
    .attr("width", 150)
    .attr("height", 50)
    .style("fill", "white")
    .style("stroke", "solid")
    .style("stroke-width", "1px")
    .style("stroke", "#B5B5B5")
    .style("rx", "5px");

  d3.select("#groupTagBelow")
    .append("text")
    .attr("x", 615)
    .attr("y", 470)
    .attr("dy", "1.5em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "14px")
    .style("text-anchor", "middle")
    .style("fill", "#B5B5B5")
    .text("Basel (50%)");

  d3.select("#hoverboxBelow")
    .on("mouseover", function () { return tooltipBelow.style("visibility", "visible"); })
    .on("mouseout", function () { return tooltipBelow.style("visibility", "hidden"); });
});