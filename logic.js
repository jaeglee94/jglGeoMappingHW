// queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

markers = [];

function getColor(d) {
  return d <= 1 ? '#ffffb2' :
        d <= 2 ? '#fed976' :
        d <= 3 ? '#feb24c' :
        d <= 4 ? '#fd8d3c' :
        d <= 5 ? '#f03b20' :
                    '#bd0026';
}


// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  for(i=0;i<data.features.length;i++){
    var intensity = ""
    if(data.features[i].properties.mag*1<=1){
      intensity = "#ffffb2"
    }else if(data.features[i].properties.mag*1<=2){
      intensity="#fed976"
    }else if(data.features[i].properties.mag*1<=3){
      intensity="#feb24c"
    }else if(data.features[i].properties.mag*1<=4){
      intensity="#fd8d3c"
    }else if(data.features[i].properties.mag*1<=5){
      intensity="#f03b20"
    }else{
      intensity="#bd0026"
    }
    markers.push(
      L.circle([data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]], {
        stroke: false,
        fillOpacity: 0.75,
        color: "black",
        fillColor: intensity,
        radius: data.features[i].properties.mag*10000
      })
      .bindPopup("<h3>" + data.features[i].properties.place + "</h3><hr><p> Magnitude: " + data.features[i].properties.mag + "</p>")
    )
  }
  var earthquakes = L.layerGroup(markers);
  createMap(earthquakes)
});

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend");
    var labels = [];
    var categories = ['0-1','1-2','2-3','3-4','4-5','5+'];

    for(var i=0;i<categories.length;i++){
      div.innerHTML +=
      labels.push(
        '<i class="circle" style="background:' + getColor(i)+ '"></i> ' +(categories[i]?categories[i]:'+')
      );
      console.log(getColor(i))
    }
    div.innerHTML=labels.join('<br>');
    return div;
  };

// Adding legend to the map
legend.addTo(myMap);
}
