// // Store our API endpoint inside queryUrl
var qUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(qUrl, function(data) {
    createBubbles(data.features);
    // centerMap(data);

});

//build a function for centering the map
// function centerMap(data) {
//     var corner1 = L.latLng(data.bbox[1], data.bbox[0]),
//     corner2 = L.latLng(data.bbox[4], data.bbox[3]),
//     mc = Object.values(L.latLngBounds(corner1, corner2).getCenter());

//     return mc;
// };

// var mapCenter = d3.json(qUrl, function(data) {
//     var corner1 = L.latLng(data.bbox[1], data.bbox[0]),
//     corner2 = L.latLng(data.bbox[4], data.bbox[3]),
//     mc = Object.values(L.latLngBounds(corner1, corner2).getCenter());
//     console.log(mc)
//     return mc;
// });

function createBubbles(data) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>" + feature.properties.title + "</p>");
    }

    var quakes = L.geoJSON(data, {
        onEachFeature: onEachFeature
    });

    createMap(quakes);
}

function createMap(quakes) {

//initialize the layergroups we will use
// var layers = {
//     tier0: new L.LayerGroup(),
//     tier1: new L.LayerGroup(),
//     tier2: new L.LayerGroup(),
//     tier3: new L.LayerGroup(),
//     tier4: new L.LayerGroup(),
//     tier5: new L.LayerGroup(),
// };

    //Create a satellite view layer
    var satelliteLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    //Create a satellite view layer
    var lightLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Satellite View": satelliteLayer,
        "Outline View": lightLayer
    };

    var quakeLayer = {
        Earthquakes: quakes
    };
// // Perform a GET request to the query URL

    var map = L.map("map-id", {
        center: [5.2, -0.06],
        zoom: 3,
        layers: [satelliteLayer, quakes]
    });

    L.control.layers(baseMaps, quakeLayer, {
        collapsed: false
    }).addTo(map);
    
};





