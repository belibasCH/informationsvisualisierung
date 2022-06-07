var distances = [
    { "path": "Berlin  - München", "distance": 584, "id": "2" },
    { "path": "New York - Washington D.C.", "distance": 367, "id": "1" },
    { "path": "Zürich - Schaffhausen", "distance": 50, "id": "3" },
    { "path": "Your route", "distance": 0, "id": "4" },
];

var options = {
    types: ['(cities)']
}


var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options)

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options)


// define svn size and margin.
const canvHeightHistrogram = 300,
    canvWidthHistrogram = window.innerWidth;
const marginHistrogram = { top: 0, right: 100, bottom: 50, left: 100 };

// compute the width and height of the actual chart area.
const widthHistrogram = canvWidthHistrogram - marginHistrogram.left - marginHistrogram.right;
const heightHistrogram = canvHeightHistrogram - marginHistrogram.top - marginHistrogram.bottom;

// API Service
var directionsService = new google.maps.DirectionsService();

function calcRoute() {
    var request = {
        origin: document.getElementById('from').value,
        destination: document.getElementById('to').value,
        travelMode: google.maps.TravelMode.DRIVING
    }

    directionsService.route(request, (result, status) => {
        const xScaleHistrogram2 = d3.scaleLinear().rangeRound([0, widthHistrogram])
            .domain([0, d3.max(_.map(distances, d => d.distance))]);

        if (status == google.maps.DirectionsStatus.OK) {

            resultinkm = result.routes[0].legs[0].distance.value / 1000
            distances[3] = { "path": document.getElementById('from').value + " - " + document.getElementById('to').value, "distance": +resultinkm, "id": "4" };

            d3.select("#bar_4")
                .transition().duration(5000)
                .attr("width", xScaleHistrogram2(resultinkm));
            d3.select("#car_4")
                .transition().duration(5000)
                .attr("x", xScaleHistrogram2(resultinkm) + 6);
        } else {

        }
    })
}


const svg = d3.select("#distancepage").append("svg")
    .attr("width", canvWidthHistrogram)
    .attr("height", canvHeightHistrogram)
    .attr("id", "canvas")

function displaygraph() {
    console.log("displaygraph");

    const g = svg.append("g")
        .attr("id", "chart-area-histo")
        .attr("transform", `translate(${marginHistrogram.left},${marginHistrogram.top})`);

    g.append("text")
        .attr("x", widthHistrogram + 10)

        .attr("y", heightHistrogram + 5)
        .text("km");


    const xScaleHistrogram = d3.scaleLinear().rangeRound([0, widthHistrogram])
        .domain([0, d3.max(_.map(distances, d => d.distance))]);

    const xAxisHistrogram = d3.axisBottom(xScaleHistrogram);
    const yScaleHistrogram = d3.scaleBand().rangeRound([heightHistrogram, 0]).padding(0.6)
        .domain(_.map(distances, d => d.path));

    g.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${heightHistrogram} )`)
        .call(xAxisHistrogram);

    var texts = g.selectAll(".myTexts")
        .data(distances)
        .enter()
        .append("text");

    texts.attr("x", "0 km")
        .attr("y", function (d, i) { return 190 - i * 55 })
        .text(d => d.path);

    g.append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(0,0)`)
        .call(yScaleHistrogram);


    const rectangle = g.selectAll("rect")
        .data(distances)
        .enter()
        .append("rect")
        .attr("id", d => "bar_" + d.id)
        .attr("class", "bar")
        .attr("x", "0")
        .attr("y", d => yScaleHistrogram(d.path) + 4)
        .attr("height", yScaleHistrogram.bandwidth() / 3)
        .attr("width", d => 0)
        .transition().duration(5000)
        .attr("width", d => xScaleHistrogram(d.distance));

    const auto = g.selectAll("circle")
        .data(distances)
        .enter()
        .append("svg:image")
        .attr("x", d => 6)
        .attr("id", d => "car_" + d.id)
        .attr("y", d => yScaleHistrogram(d.path) - 6)
        .attr('width', 20)
        .attr("xlink:href", "src/assets/car.svg")
        .attr("fill", "white")
        .attr('height', 24)
        .transition().duration(5000)
        .attr("x", d => xScaleHistrogram(d.distance) + 6)


}

function cleanGraph() {
    console.log("cleanGraph");
    d3.selectAll("#chart-area-histo").remove();
}