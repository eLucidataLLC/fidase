var fs = require('fs');
var turf = require('@turf/turf');
var fmatrix = {
  'REC_SIZE': 4.46,
  'H_OFFSET': .42,
  'V_OFFSET': .715,
  'S_RECTFN': .176
}
var pmatrix = {};

try {
  var flines = JSON.parse(fs.readFileSync('data/FlightLines_4326.geojson', 'utf8'));
  //console.log(data);
} catch (e) {
  console.log('Error:', e.stack);
}

turf.featureEach(flines, function (currentFeature, featureIndex) {
  film = currentFeature.properties.FILM;
  frames = (currentFeature.properties.FRAME != null)?currentFeature.properties.FRAME:currentFeature.properties.FRAMES;
  heading = currentFeature.properties.HEADING;
  layer = currentFeature.properties.LAYER;
  // fline = JSON.parse('{"'+frames+'": {}}');
  // fline[frames] = fmatrix;
  if (!pmatrix[film])pmatrix[film] = {};
  pmatrix[film][frames] = fmatrix;
  // console.log(pmatrix[film]);
  // console.log(fline['fr_'+frames].REC_SIZE);
  // console.log(featureIndex+' - '+film+' frames '+frames+' heading '+ heading);
});
console.log(pmatrix);
fs.writeFileSync('data/pmatrix.json',JSON.stringify(pmatrix));
