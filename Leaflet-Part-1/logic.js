let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform GET to the query URL
d3.json(queryUrl).then(function(earthquakeData) {
    createFeatures(earthquakeData.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }

    let earthquake = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    createMap(earthquake);
}

function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 1,
        opacity: 1,
        fillOpacity: .5
    });
}

function createMap(earthquake) {
    let road = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    //Create the map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [road, earthquake]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap); 
    
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {
        let div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 60, 90],
            legendInfo = "<h5>The Magnitude</h5>";
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }    
        return div;
        };
        legend.addTo(myMap);
}

function markerColor(depth) {
    return depth > 90 ? '#4E6F57' :
            depth > 70 ? '#428C56' :
            depth > 50 ? '#3EB35D' :
            depth > 30 ? '#26DE57' :
            depth > 10 ? '#0AEE46' :
                         '#00FF43' ;          
}
function markerSize(magnitude) {
    return magnitude * 3;
}
