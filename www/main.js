/*
version 2
*/
mapboxgl.accessToken = 'pk.eyJ1IjoiZWxwYmF0aXN0YSIsImEiOiJ4YlBmNmlJIn0.x0lZKcK907BWTS4LV9dkHA';

const SAERI = 'https://ims.saeri.org/fias-1956-thumbnail/';

var images = $.ajax({
  url: "../data/process/1956-aerial-imagery.geojson",
  dataType: "json",
  // success: console.log("Data successfully loaded."),
  error: function(xhr) {
    alert(xhr.statusText)
  }
});

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-v9?optimize=true',
  center: [-59.3866, -51.7712], // Falklands
  zoom: 8,
  hash: true
});
map.on('load', function() {
  map.addSource('imagery', {
    type: 'geojson',
    data: '../data/1956-aerial-imagery.geojson '
  });
  map.addLayer({
    id: 'flightLines',
    type: 'line',
    minzoom: 9,
    maxzoom: 13,
    source: {
      type: 'geojson',
      data: '../data/1956-flight-lines.geojson'
    },
    paint: {
      'line-color': '#486DE0',
    },
    layout: {
      // 'visibility': 'none'
    }
  });
  map.addLayer({
    id: 'squares',
    type: 'line',
    source: 'imagery',
    minzoom: 9,
    maxzoom: 13,
    paint: {
      'line-color': ['match', ['get', 'present'], 0, '#cd0000', '#8dad24'],
      'line-opacity': .65,
    }
  });
  map.addLayer({
    id: 'geotiff',
    type: 'fill',
    source: 'imagery',
    maxzoom: 10,
    paint: {
      'fill-color': ['match', ['get', 'geotiff'], 1, '#ff7f00', 'transparent'],
      'fill-opacity': .75,
    }
  });
  map.addControl(new mapboxgl.ScaleControl());
  $.when(images).done(function() {
    const geotiffs = images.responseJSON.features.filter(geotiff => geotiff.properties.geotiff == 1);
    geotiffs.forEach(function(currentFeature) {
      polyPhoto = currentFeature.geometry.coordinates[0];
      imageName = currentFeature.properties.name;
      map.addLayer({
        id: imageName,
        beforeId: 'squares',
        type: 'raster',
        // minzoom: 9,
        source: {
          type: 'image',
          url: '../img/' + imageName + '.jpg',
          coordinates: [polyPhoto[2], polyPhoto[1], polyPhoto[0], polyPhoto[3]]
        },
        paint: {
          'raster-opacity': 0.65
        },
      });
    });
  });
});
