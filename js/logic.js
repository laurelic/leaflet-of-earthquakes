// // Store our API endpoint inside queryUrl
var qUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var pUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

//query USGS for earthquake information
d3.json(qUrl, function(data) {
    createBubbles(data.features);
});

var quakeLayers = {
    tier0: new L.LayerGroup(),
    tier1: new L.LayerGroup(),
    tier2: new L.LayerGroup(),
    tier3: new L.LayerGroup(),
    tier4: new L.LayerGroup(),
    tier5: new L.LayerGroup()
};

function createBubbles(data) {
    // function onEachFeature(feature, layer) {
    //     layer.bindPopup("<p>" + feature.properties.title + "</p>");
    // }

    var tierLevel;

    var quakes = L.geoJSON(data, {
        //onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng){
            var mag = feature.properties.mag;
            if(mag < 1) {
                magColor = "#1a9850"
                tierLevel = "tier0"
            } else if (mag < 2) {
                magColor = "#91cf60"
                tierLevel = "tier1"
            } else if (mag < 3) {
                magColor = "#d9ef8b"
                tierlLevel = "tier2"
            } else if (mag < 4) {
                magColor = "#fee08b"
                tierLevel = "tier3"
            } else if (mag < 5) {
                magColor = "#fc8d59"
                tierLevel = "tier4"
            } else {
                magColor = "#d73027"
                tierLevel = "tier5"
            };
            
            var markerStyles = {
                radius: feature.properties.mag * 2,
                color: magColor,
                weight: 1,
                fillColor: magColor,
                fillOpacity: 0.6,
            }        
            return L.circleMarker(latlng, markerStyles).addTo(quakeLayers[tierLevel]);
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

    //initialize the faultlines layer
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

    //ensure the legend can flow with the zoom and position view
    map.on('zoomed', onZoomend);
    function onZoomend(){
        if(map.getZoom()>0){
            map.removeControl(info);
        }
    };

    //layer the ampes on each other
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    //draw the plate lines
    d3.json(pUrl, function(data) {
        L.geoJSON(data, {
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.PlateName + " Plate");
            },
            style: {
                color: "#fdae61",
                weight: 2,
                fillOpacity: 0
            }
        }).addTo(faultLines);
    });
    
};



