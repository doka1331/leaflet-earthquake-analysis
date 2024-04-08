// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
// This gets inserted into the div with an id of "map".
let myMap = L.map("map", {
  center: [0.0, 0.0],
  zoom: 3
});

// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//store API Endpoint as query url
let queryURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
//perform a Get request to the query URL and store the data.features in the createFeatures function
d3.json(queryURL).then(function (data){
  createFeatures(data.features);
});

//define createFeatures function
// Define function to create earthquake markers
function createFeatures(earthquakes) {
  // Define a function to create popup content for each feature
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p><p>Time: ${new Date(feature.properties.time)}</p>`);
  }
  L.geoJSON(earthquakes, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: Math.max(Math.abs(feature.properties.mag) * 3, 5), // Adjust the multiplier for better visualization
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.85
      });
    },
    onEachFeature: onEachFeature
  }).addTo(myMap);

  // Create a legend
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
      depths = [-10, 10, 30, 50, 70, 90],
      labels = [];

  // Loop through depths and generate a label with a colored square for each depth range
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + 'km<br>' : '+ km');
    }

    return div;
  };

legend.addTo(myMap);

}

// Function to get color based on earthquake depth
function getColor(depth) {
  return depth > 90 ? '#d73027' :
         depth > 70  ? '#fc8d59' :
         depth > 50  ? '#fee08b' :
         depth > 30  ? '#91cf60' :
         depth > 10   ? '#d9ef8b' :
                        '#d9ef8b';
}
