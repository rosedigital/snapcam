var gm = require('gm'),
	fs = require('fs'),

	sendSnap = require('./sendSnap.js'),
	takePicture = require('./takePicture.js'),
	downloadSnaps = require('./downloadSnaps.js'),

	moment = require('moment'),

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

// test image shit
// fixImage(inPath, { width: 640, height: 480 }, function(){});

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
  		.colorize(Math.random()*100, Math.random()*100, Math.random()*100)
  		.contrast(2)

		.fontSize(20)
		.font('Courier')
		.fill('#f5f5f5')
		.drawText(15, 30, 'innospacecam1', 'NorthWest')
		.drawText(15, 60, moment().format('h:mm A'), 'NorthWest')
		.drawText(15, 85, moment().format('D/M/YY'), 'NorthWest')
		.drawText(0, 80, 'cam.rose.digital', 'South')

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