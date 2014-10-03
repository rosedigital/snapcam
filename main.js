var gm = require('gm'),
	fs = require('fs'),

	sendSnap = require('./sendSnap.js'),
	takePicture = require('./takePicture.js'),
	downloadSnaps = require('./downloadSnaps.js'),

	dir = '.',
	inPath = dir + '/cam.jpg',
    outPath = dir + '/out.jpg';

setInterval(function(){
	downloadSnaps(function(users){
		if(users.length > 0){
			console.log("Users:",users);
			takeAndSend(users);
		}else{
			console.log("No users");
		}
	});
}, 10000);

function takeAndSend(usernames){
	takePicture(inPath, function(){
		gm(inPath).size(function(err, img){
			fixImage(inPath, img, function(){
				sendSnap(5, outPath, usernames);
			});
		});

	});
}

function fixImage(inPath, img, callback){
	var x = img.height,
		y = img.width;

	gm(inPath)
		.rotate('black', 90)
		.crop(x, y, 0, 0)

		.fill('#00000066')
		.drawRectangle(0, 0, img.width, 70)
		.fontSize(20)
		.fill('#f5f5f5')
		.drawText(0, 50, 'Hello from Floor 2, Innovation Space', 'North')

		.write(outPath, function(err){
			if (err) return console.dir(arguments)
				console.log(this.outname + " created  ::  " + arguments[3])
				callback();
			}
		);
}