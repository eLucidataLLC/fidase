var fs = require('fs');
var turf = require('@turf/turf');
var cmd = require('node-cmd');

var photos = {
  'georeferd':  '1956_Aerial_Photos_georeferenced',
  'resampled':  '1956_Aerial_Photos_resampled_jpg',
  'thumbnail':  '1956_Aerial_Photos_thumbnail'
}
var media_path = '/media/pb/DATA/1956_Aerial_Photos_data/';
var deliver_path = '/media/pb/DATA/Requested_data/dr_20181911_Falkland_Conservation/';
var data_path = '/home/pb/Sites/data/';

var requested_area  = JSON.parse(fs.readFileSync(data_path+'requested_area_PortHoward.geojson'));
var images  = JSON.parse(fs.readFileSync(data_path+'1956_Aerial_Imagery.geojson'));

var imgsCollection = turf.featureCollection([]);

try {fs.mkdirSync(deliver_path);} catch(err) {};
try {fs.mkdirSync(deliver_path+photos.georeferd);} catch(err) {};
try {fs.mkdirSync(deliver_path+photos.resampled);} catch(err) {};
try {fs.mkdirSync(deliver_path+photos.thumbnail);} catch(err) {};

turf.featureEach(images, function (currentFeature, featureIndex) {
  var intersect = turf.intersect(requested_area.features[0].geometry, currentFeature.geometry);
  if (intersect !=  null && currentFeature.properties.present == 1) {
    var polyPhoto = currentFeature.geometry.coordinates[0];
    var coorPhoto = [polyPhoto[2],polyPhoto[1],polyPhoto[0],polyPhoto[3]];
    var name = currentFeature.properties.name;
    console.log(name);
    var gdalstring = 'gdal_translate -of GTiff -a_srs EPSG:4326'
      + ' -gcp 0 0 ' + polyPhoto[2][0] + ' ' + polyPhoto[2][1]
      + ' -gcp 11671 0 ' + polyPhoto[1][0] + ' ' + polyPhoto[1][1]
      + ' -gcp 11671 12065 ' + polyPhoto[0][0] + ' ' + polyPhoto[0][1]
      + ' -gcp 0 12065 ' + polyPhoto[3][0] + ' ' + polyPhoto[3][1];
    // console.log(gdalstring);
    fs.writeFileSync(deliver_path+ photos.georeferd +'/gdal_string_' +name+'.txt', gdalstring+ ' ' + name + '.jpg' + ' ' + name + '.tif');
    // try {fs.copyFileSync(media_path+photos.original+'/'+name+'.tif', deliver_path+photos.original+'/'+name+'.tif');} catch(err) {};
    try {fs.copyFileSync(media_path+photos.resampled+'/'+name+'.jpg', deliver_path+photos.resampled+'/'+name+'.jpg');} catch(err) {};
    try {fs.copyFileSync(media_path+photos.thumbnail+'/'+name+'.jpg', deliver_path+photos.thumbnail+'/'+name+'.jpg');} catch(err) {};
    imgsCollection.features.push(currentFeature);
    cmd.run(gdalstring+ ' ' + deliver_path+photos.resampled + '/' + name + '.jpg' + ' ' + deliver_path+photos.georeferd + '/' + name + '.tif');
  }
});
// console.log(imgsCollection.features);
fs.writeFileSync(data_path+'images_PortHoward.geojson',JSON.stringify(imgsCollection));
fs.writeFileSync(deliver_path+ photos.georeferd +'/images.geojson',JSON.stringify(imgsCollection));
fs.copyFileSync(data_path+'requested_area_PortHoward.geojson',deliver_path+ photos.georeferd +'/requested_area.geojson');
// console.log(images.features[0].geometry.coordinates[0]);
// console.log(requested_area.features[0].geometry.coordinates[0]);


// Move all files, but not folders:

// find path_to_the_top_folder_containing_images_and_forms -type f -exec mv --backup=numbered -t path_to_the_destination_folder {} +

/*
gdal_translate -of GTiff -a_srs EPSG:4326 -gcp 0 0 -59.5019 -51.6605 -gcp 11671 0 -59.5048 -51.6091 -gcp 11671 12065 -59.5876 -51.6109 -gcp 0 12065 -59.5848 -51.6623  "/media/pb/DATA/Requested_data/PortHoward/1956_Aerial_Photos_resampled_jpg/F_I_15_0024.jpg" "/media/pb/DATA/Requested_data/PortHoward/1956_Aerial_Photos_resampled_jpg/F_I_15_0024.tif"

gdal_translate
-of GTiff
-a_srs EPSG:4326
-gcp 0 0 poly[2][1] poly[2][0]
-gcp 11671 0 poly[1][1] poly[1][0]
-gcp 11671 12065 poly[0][1] poly[0][0]
-gcp 0 12065 poly[3][1] poly[3][0]
"source_file"
"temporal_file"

gdalwarp -r near -order 1 -co COMPRESS=NONE
"temporal_file"
"destination_file"

var cmd=require('node-cmd');
cmd.run('touch example.created.file');

/home/pb/npm/lib
├── @turf/turf@5.1.6
├── csv@3.1.0
├── csvtojson@2.0.8
├── exif-parser@0.1.12
├── node-cmd@3.0.0
└── simple-exiftool@1.1.0


*/
