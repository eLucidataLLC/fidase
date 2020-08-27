var fs = require('fs');
var turf = require('@turf/turf');
var cmd = require('node-cmd');

var photos = {
  'georeferd':  '1956_Aerial_Photos_georeferenced',
  'resampled':  '1956_Aerial_Photos_resampled_jpg',
  'thumbnail':  '1956_Aerial_Photos_thumbnail'
}
var media_path = '/media/pb/DATA/1956_Aerial_Photos_data/';
var deliver_path = '/media/pb/DATA/Requested_data/dr_20180914_Al_Baylis/';
var data_path = '/home/pb/Sites/data/';

var images  = JSON.parse(fs.readFileSync(data_path+'1956_Aerial_Imagery.geojson'));

var requested_area  = {
  "type": "FeatureCollection",
  "features": [{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-61.449, -51.000]
      },
      "properties": {
        "name": "West Cay"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-60.9015, -51.1707]
      },
      "properties": {
        "name": "Elephant Jason Rock"
      }
    }
  ]
};

var imgsCollection = turf.featureCollection([]);

try {fs.mkdirSync(deliver_path);} catch(err) {};
try {fs.mkdirSync(deliver_path+photos.georeferd);} catch(err) {};
try {fs.mkdirSync(deliver_path+photos.resampled);} catch(err) {};
try {fs.mkdirSync(deliver_path+photos.thumbnail);} catch(err) {};

turf.featureEach(images, function (currentFeature, featureIndex) {
  var int_WestCay = turf.intersect(requested_area.features[0].geometry, currentFeature.geometry);
  var int_ElephantJason = turf.intersect(requested_area.features[1].geometry, currentFeature.geometry);
  var intersect = turf.intersect(requested_area.features[1].geometry, currentFeature.geometry);
  if ((int_WestCay !=  null || int_ElephantJason !=  null) && currentFeature.properties.present == 1 && (currentFeature.properties.name == 'F_I_17_0021' || currentFeature.properties.name == 'F_I_17_0064')) {
    var polyPhoto = currentFeature.geometry.coordinates[0];
    var coorPhoto = [polyPhoto[2],polyPhoto[1],polyPhoto[0],polyPhoto[3]];
    var name = currentFeature.properties.name;
    console.log(name);
    var gdalstring = 'gdal_translate -of GTiff -a_srs EPSG:4326'
      + ' -gcp 0 0 ' + polyPhoto[2][0] + ' ' + polyPhoto[2][1]
      + ' -gcp 11671 0 ' + polyPhoto[1][0] + ' ' + polyPhoto[1][1]
      + ' -gcp 11671 12065 ' + polyPhoto[0][0] + ' ' + polyPhoto[0][1]
      + ' -gcp 0 12065 ' + polyPhoto[3][0] + ' ' + polyPhoto[3][1];
    console.log(gdalstring);
    fs.writeFileSync(deliver_path+ photos.georeferd +'/gdal_string_' +name+'.txt', gdalstring+ ' ' + name + '.jpg' + ' ' + name + '.tif');
    try {fs.copyFileSync(media_path+photos.resampled+'/'+name+'.jpg', deliver_path+photos.resampled+'/'+name+'.jpg');} catch(err) {};
    try {fs.copyFileSync(media_path+photos.thumbnail+'/'+name+'.jpg', deliver_path+photos.thumbnail+'/'+name+'.jpg');} catch(err) {};
    imgsCollection.features.push(currentFeature);
    cmd.run(gdalstring+ ' ' + deliver_path+photos.resampled + '/' + name + '.jpg' + ' ' + deliver_path+photos.georeferd + '/' + name + '.tif');
  }
});
fs.writeFileSync(data_path+'images_Al_Baylis.geojson',JSON.stringify(imgsCollection));
fs.writeFileSync(data_path+'images_Al_Baylis.geojson',JSON.stringify(imgsCollection));
fs.writeFileSync(deliver_path+ photos.georeferd +'/images.geojson',JSON.stringify(imgsCollection));
