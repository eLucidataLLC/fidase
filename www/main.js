/*
version 2
*/
mapboxgl.accessToken = 'pk.eyJ1IjoiZWxwYmF0aXN0YSIsImEiOiJ4YlBmNmlJIn0.x0lZKcK907BWTS4LV9dkHA';
const SAERI = 'https://ims.saeri.org/fias-1956-thumbnail/';
var sources = {
  imagery: {
    'type': 'geojson',
    'data': '../data/1956-aerial-imagery.geojson'
  },
  flightLines: {
    type: 'geojson',
    data: '../data/1956-flight-lines.geojson'
  }
}
var layers = {
  flightLines: {
    id: 'flightLines',
    type: 'line',
    source: sources.flightLines,
    paint: {
      'line-color': '#486DE0',
    },
    layout: {
      // 'visibility': 'none'
    }
  },
  squares: {
    id: 'squares',
    type: 'line',
    source: sources.imagery,
    paint: {
      'line-color': ['match', ['get', 'present'], 0, '#cd0000', '#8dad24'],
      'line-opacity': .65,
    }
  }
};
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-v9?optimize=true',
  center: [-59.3866, -51.7712], // Falklands
  zoom: 8,
  hash: true
});
map.on('load', function() {
  map.addLayer(layers.flightLines);
  map.addLayer(layers.squares);
  map.addControl(new mapboxgl.ScaleControl());
  var images = $.ajax({
    url: "../data/process/1956-aerial-imagery.geojson",
    dataType: "json",
    success: console.log("Data successfully loaded."),
    error: function(xhr) {
      alert(xhr.statusText)
    }
  });
  $.when(images).done(function() {
    images.responseJSON.features.forEach(function(currentFeature) {
      if (currentFeature.properties.geotiff == 1) {
        polyPhoto = currentFeature.geometry.coordinates[0];
        imageName = currentFeature.properties.name;
        map.addLayer({
          id: imageName,
          type: 'raster',
          source: {
            type: 'image',
            url: '../img/' + imageName + '.jpg',
            coordinates: [polyPhoto[2], polyPhoto[1], polyPhoto[0], polyPhoto[3]]
          },
          paint: {
            'raster-opacity': 0.75
          },
        });
      };
    });
  });
});
