var fs = require('fs'),
	camera = require('camera');

module.exports = takePicture;

function takePicture(path, callback){
	var webcam = camera.createStream();

	webcam.on('error', function(err){
		return console.log('error reading data', err);
	});

	webcam.on('data', function(buffer){
		fs.writeFile(path, buffer, function(){
			callback();
		});

		return webcam.destroy();

	});

	webcam.snapshot(function(err, buffer){});

	webcam.record(1000, function(buffers){});

}