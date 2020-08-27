var fs = require('fs');
var path = require('path')

var photos = {
  'original':  '1956_Aerial_Photos_original_tif',
  'resampled':  '1956_Aerial_Photos_resampled_jpg',
  'thumbnail':  '1956_Aerial_Photos_thumbnail'
}
var media_path = '/media/pb/DATA/1956_Aerial_Photos_data/';
var data_path = '/home/pb/Sites/data/';
var original_path = media_path+photos.original;

function traverseDirectory(dirname, callback) {
  var directory = [];
  fs.readdir(dirname, function(err, list) {
    dirname = fs.realpathSync(dirname);
    if (err) {
      return callback(err);
    }
    var listlength = list.length;
    list.forEach(function(file) {
      file = dirname + '/' + file;
      fs.stat(file, function(err, stat) {
        directory.push(file);
        if (stat && stat.isDirectory()) {
          traverseDirectory(file, function(err, parsed) {
            directory = directory.concat(parsed);
            if (!--listlength) {
              callback(null, directory);
            }
          });
        } else {
          if (!--listlength) {
            callback(null, directory);
          }
        }
      });
    });
  });
}
traverseDirectory(original_path, function(err, result) {
  if (err) {
    console.log(err);
  }
  // console.log(result);
  var files = result;
  var images = [];
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    // var name = path.basename(file, '.jpeg');
    var name = path.basename(file, '.tif');
      if (name.includes('F_I_')) {
        images.push(name);
        // console.log(name);
      }
    }
    console.log(images.length);
    // console.log(images);
    fs.writeFileSync(data_path+'1956_Aerial_Imagery_inv.json',JSON.stringify(images));
  });

// function fileswalker(files, callback) {
//   for (var i = 0; i < files.length; i++) {
//     var file = files[i];
//     /**********************************/
//     var extn = path.extname(file);
//     if (extn == '.tif') {
//       console.log('...');
//     }
//   }
// }
// function modfile (file){
//   console.log('***');
//   var name = path.basename(file, '.tif')
//   if (name.includes('F_I_')) {
//     gm(file)
//       .resize(1500)
//       .writeresult(convertd_path + '/' + name + '.jpg', function(err) {
//         if (!err) console.log('done');
//         else console.log(err);
//       });
//   }
// }
// function modfile(file){
//   console.log('***');
//   var name = path.basename(file,'.tif')
//   if (name.includes('F_I_')) {
//     gm(file)
//       .resize(1500)
//       .writeresult(convertd_path + '/' + name + '.jpg', function(err) {
//         if (!err) console.log('done');
//         else console.log(err);
//       });
//   };
// };
