// create svg canvas
const zeichenhohe = window.innerHeight,
    zeichenbreite = window.innerWidth;
const svgnetwork = d3.select("#network").append("svg")
    .attr("id", "networkBody")
    .attr("width", zeichenbreite)
    .attr("height", zeichenhohe)
    .style("border", "1px solid");

// calc the width and height depending on margins.
const marginnetwork = { top: 0, right: 0, bottom: 0, left: 0 };
const widthnetwork = zeichenbreite - marginnetwork.left - marginnetwork.right;
const heightnetwork = zeichenhohe - marginnetwork.top - marginnetwork.bottom;

// create parent group and add left and top margin
const group = svgnetwork.append("g")
    .attr("id", "chart-area")
    .attr("transform", `translate(${marginnetwork.left},${marginnetwork.top})`);


var studiengaenge = []
d3.csv("data/HochschulenData2.csv", function (data) {
    studiengaenge.push(data);
});

var firmen = []
d3.csv("data/Firmendatenbank.csv", function (data) {
    firmen.push(data);
});


function changeDistance(value) {
    const studiengaengefilterd = studiengaenge.filter(hochschule => hochschule.distanz <= value)
    const firmenfilterd = firmen.filter(firmen => firmen.Fahrtdistanz <= value)


    //---------------Firmen-------------------
    var firmendiv = document.getElementById("printfirma");
    firmendiv.innerHTML = firmenfilterd.length;


    // intialialisierung der varablen für loop
    let listDatafirmen = firmenfilterd,
        // Container wo die Liste reinkommt
        listContainerfirmen = document.createElement('div'),
        // Liste erstellen
        listElementfirmen = document.createElement('ul'),
        // Loopvariablen
        listCountfirmen = studiengaengefilterd.length,
        listItemfirmen,
        ifirmen;

    inhaltfirmen = document.getElementById("firmenbox")
    inhaltfirmen.removeChild(inhaltfirmen.firstChild)
    inhaltfirmen.appendChild(listContainerfirmen);
    listContainerfirmen.appendChild(listElementfirmen);

    for (ifirmen = 0; ifirmen < listCountfirmen && ifirmen < 190; ++ifirmen) {
        // ein listen element generieren
        listItemfirmen = document.createElement('li');
        // Text anfügen
        listItemfirmen.innerHTML = listDatafirmen[ifirmen].Name;
        // hinzufügen
        listElementfirmen.appendChild(listItemfirmen);
    }


    //---------------Studiengänge-------------------
    var studiengangdiv = document.getElementById("printstudiengang");
    studiengangdiv.innerHTML = studiengaengefilterd.length;

    // intialialisierung der varablen für loop
    let listData = studiengaengefilterd,
        // Container wo die Liste reinkommt
        listContainer = document.createElement('div'),
        // Liste erstellen
        listElement = document.createElement('ul'),
        // Loopvariablen
        listCount = studiengaengefilterd.length,
        listItem,
        i;

    // diese Elemente der Page hinzufügen
    inhalt = document.getElementById("studiengangbox")
    inhalt.removeChild(inhalt.firstChild)
    inhalt.appendChild(listContainer);
    listContainer.appendChild(listElement);

    for (i = 0; i < listCount; ++i) {
        // ein listen element generieren
        listItem = document.createElement('li');
        // Text anfügen
        listItem.innerHTML = listData[i].Studiengang + ", " + listData[i].Hochschule;
        // hinzufügen
        listElement.appendChild(listItem);
    }

    //Hochschulen
    const uniqueAddresses = new Set();
    for (let i = 0; i < studiengaengefilterd.length; i++) {
        uniqueAddresses.add(studiengaengefilterd[i].Hochschule)
    }


    var hochschulediv = document.getElementById("printhochschule");
    hochschulediv.innerHTML = uniqueAddresses.size;


    // intialialisierung der varablen für loop
    let listDataschule = Array.from(uniqueAddresses),
        // Container wo die Liste reinkommt
        listContainerschule = document.createElement('div'),
        // Liste erstellen
        listElementschule = document.createElement('ul'),
        // Loopvariablen
        listCountschule = uniqueAddresses.size,
        listItemschule,
        ischule;

    // diese Elemente der Page hinzufügen
    inhaltschule = document.getElementById("hochschulenbox")
    inhaltschule.removeChild(inhaltschule.firstChild)
    inhaltschule.appendChild(listContainerschule);
    listContainerschule.appendChild(listElementschule);

    for (ischule = 0; ischule < listCountschule; ++ischule) {
        // ein listen element generieren
        listItemschule = document.createElement('li');
        // Text anfügen
        listItemschule.innerHTML = listDataschule[ischule];

        // hinzufügen
        listElementschule.appendChild(listItemschule);
    }

}


function mouseover(canton) {
    canton.style("fill", "#EEEEEE")
}

function mouseout(canton) {
    canton.style("fill", "#EEEEEE")

}

function updateChart(binNumber) {
    // recompute density estimation
    d3.select("#SHdot")
        .attr("r", binNumber * 5)
}

//-----------------------------Zeichnet den Slider und die Map
function doPlot() {
    var dataslider = [0, 0.5, 1, 1.5, 2];
    // Step
    var sliderStep = d3
        .sliderBottom()
        .min(d3.min(dataslider))
        .max(d3.max(dataslider))
        .width(zeichenbreite * 0.4)
        .tickFormat((d, i) => ['0h', '0.5h', '1h', '1.5h', '2h'][i])
        .ticks(5)
        .step(0.5)
        .default(0.5)
        .on('onchange', val => {
            changeDistance(val * 60);
            updateChart(val * 60);
        });

    var gStep = d3
        .select('div#slider-step')
        .append('svg')
        .attr('width', '100%')
        .attr('height', 400)
        .append('g')
        .attr('transform', 'translate(30,30)');

    gStep.call(sliderStep);

    d3.select('p#value-step').text(d3.format('')(sliderStep.value()));
    var projection = d3.geoAlbers()
        .rotate([0, 0])
        .center([9.2, 47.5])
        .scale(50000)
        .translate([widthnetwork / 2, heightnetwork / 2])
        .precision(.1);

    var pathGenerator = d3.geoPath()
        .projection(projection);

    d3.json("data/readme-swiss.json").then(function (topology) {
        var cantons = topojson.feature(topology, topology.objects.cantons);

        var cant = group.selectAll("path.canton")
            .data(cantons.features)
            .enter()
            .append("path")
            .attr("id", d => d.id)
            .attr("class", "canton")
            .attr("d", pathGenerator)

        cant.on("mouseover", (event, d) => mouseover(d3.select("#" + d.id)));
        cant.on("mouseout", (event, d) => mouseout(d3.select("#" + d.id)));

        group.append("path")
            .datum(topojson.mesh(topology, topology.objects.cantons))
            .attr("class", "canton-boundary")
            .attr("d", pathGenerator);


        group.selectAll("text")
            .data(cantons.features)
            .enter().append("text")
            .attr("transform", function (d) { return "translate(" + pathGenerator.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .attr("id", d => d.id + "text")
            .text(function (d) { return d.properties.name; });

        group.selectAll('circle')
            .data(cantons.features)
            .enter().append("circle")
            .each(function (d) {

                var centroid = pathGenerator.centroid(d);
                d3.select(this)
                    .attr("cx", centroid[0])
                    .attr("cy", centroid[1])
                    .attr("r", 120)
                    .attr("id", d => d.id + "dot")
                    .style("fill", "#f8dc00")
                    .style("stroke", "black")
                    .attr("fill-opacity", "0.3");
            });

        var dot = d3.selectAll('#SHdot');
    });

}

doPlot();
