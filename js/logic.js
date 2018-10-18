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
        // lat = feature.geometry.coordinates[1],
        // lng = feature.geometry.coordinates[0],
        layer.bindPopup("<p>" + feature.properties.title + "</p>");
        // layer.circleMarker([lat, lng], {radius: feature.properties.mag * 10});
    }

    var quakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng){
            var mag = feature.properties.mag;
            if(mag < 1) {
                magColor = "#1a9850"
            } else if (mag < 2) {
                magColor = "#91cf60"
            } else if (mag < 3) {
                magColor = "#d9ef8b"
            } else if (mag < 4) {
                magColor = "#fee08b"
            } else if (mag < 5) {
                magColor = "#fc8d59"
            } else {
                magColor = "#d73027"
            };
            
            var markerStyles = {
                radius: feature.properties.mag * 2,
                color: magColor,
                weight: 1,
                fillColor: magColor,
                fillOpacity: 0.6,
            }        
            return L.circleMarker(latlng, markerStyles);
            // if(latlng.lng < 0){
            //     latlng.lng = latlng.lng + 360
            // }
            // return L.circleMarker(latlng, markerStyles);
            // console.log(latlng)
        }

    });

    //var vectorGrid = L.vectorGrid.slicer()

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
        center: [19.8968, -155.5828],
        zoom: 3,
        layers: [satelliteLayer, quakes]
    });
// initialize legend
    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        var labels = ["<1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var colors = ["#1a9850", "#91cf60", "#d9ef8b", "#fee08b", "#fc8d59", "#d73027"];
        div.innerHTML = "<div><b>Magnitudes</b></div>";
        for (var i=0; i < labels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '">&nbsp;</i>&nbsp;&nbsp;' + labels[i] + '<br/>';
        }
        return div;
    };

    info.addTo(map);

    L.control.layers(baseMaps, quakeLayer, {
        collapsed: false
    }).addTo(map);

    map.on('zoomed', onZoomend);
    function onZoomend(){
        if(map.getZoom()>0){
            map.removeControl(info);
        }
    };
    
};





