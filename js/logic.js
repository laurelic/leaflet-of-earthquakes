// // Store our API endpoint inside queryUrl
var qUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var pUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

//query USGS for earthquake information
d3.json(qUrl, function(data) {
    createBubbles(data.features);
});

function createBubbles(data) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<p>" + feature.properties.title + "</p>");
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
        }

    });

    createMap(quakes);
}

function createMap(quakes) {

    //Create a satellite view layer
    var satelliteLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    //Create a greyscale view layer
    var lightLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    var faultLines = new L.layerGroup();



    //initialize base maps
    var baseMaps = {
        "Satellite View": satelliteLayer,
        "Outline View": lightLayer
    };

    var overlayMaps = {
        "Earthquakes": quakes,
        "Fault Lines": faultLines
    };

    //build the map
    var map = L.map("map-id", {
        center: [19.8968, -155.5828],
        zoom: 3,
        layers: [satelliteLayer, quakes, faultLines]
    });

    // build the legend
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

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    map.on('zoomed', onZoomend);
    function onZoomend(){
        if(map.getZoom()>0){
            map.removeControl(info);
        }
    };

    d3.json(pUrl, function(data) {
        L.geoJSON(data, {
            style: {
                color: "#fdae61",
                weight: 2,
                fillOpacity: 0
            }
        }).addTo(faultLines);
        //drawFaults(data.features);
    });

    // function drawFaults(plateData) {
    //     var
    // }
    //query tectonic plate information for 
    // var plates = d3.json(pUrl, function(data) {
    //     console.log(Object.keys(data.features));
    //     var plateObject = data.features;
    //     plateObject.forEach(function(plate){
    //         var polyline = L.polyline(plate.geometry.coordinates, {
    //             weight: 2,
    //             color: "#ffffbf"
    //         }).addTo(fault);
    //     })
    //     }
        //     var polyline = L.polyline(plate.geometry.coordinates, {
        //         weight: 2,
        //         color: "#ffffbf"
        //     }).addTo(map)
        // })


    //);
    
};



