var gm = require('gm'),
	fs = require('fs'),

	sendSnap = require('./sendSnap.js'),
	takePicture = require('./takePicture.js'),
	downloadSnaps = require('./downloadSnaps.js'),

	dir = '.',
	inPath = dir + '/cam.jpeg',
    outPath = dir + '/out.jpeg';

setInterval(function(){
	downloadSnaps(function(users){
		if(users.length > 0){
			console.log("Users:",users);
			takeAndSend(users);
		}else{
			console.log("No users");
		}
	});
}, 3000);

function takeAndSend(usernames){
	takePicture(inPath, function(){
		gm(inPath).size(function(err, img){
			fixImage(inPath, img, function(){
				sendSnap(10, outPath, usernames);
			});
		});

	});
}

function fixImage(inPath, img, callback){
	var x = img.height,
		y = img.width;

	gm(inPath)
		.rotate('black', 90)
		.crop(x - 120, y, 0, 0)
	

		.write(outPath, function(err){
			if (err) return console.dir(arguments)
				console.log(this.outname + " created  ::  " + arguments[3])

				gm().subCommand('composite')
					.gravity('center')
					.in('-compose', 'Over', './watermark.png', outPath)

					.write(outPath, function(err){
						if (err) return console.dir(arguments)
							console.log(this.outname + " created  ::  " + arguments[3])
							callback();
						}
					);

			}
		);
}