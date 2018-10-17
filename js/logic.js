// // Store our API endpoint inside queryUrl
var qUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


//Create a satellite view layer
var satelliteLayer =     L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
});

// // Perform a GET request to the query URL
var mapCenter = d3.json(qUrl, function(data) {

    //Get the center of the map for the data
    var corner1 = L.latLng(data.bbox[1], data.bbox[0]),
    corner2 = L.latLng(data.bbox[4], data.bbox[3]),
    mc = Object.values(L.latLngBounds(corner1, corner2).getCenter());
    
    console.log(mc);

    var myMap = L.map("map-id", {
        center: mc,
        zoom: 3
    });

    satelliteLayer.addTo(myMap);

});

console.log(mapCenter);




