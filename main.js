var gm = require('gm'),
	fs = require('fs'),

	snapchat = require('snapchat'),
	client = new snapchat.Client(),
	config = require('./snapchat-config.json'),

	sendSnap = require('./sendSnap.js'),
	takePicture = require('./takePicture.js'),
	cleanSnaps = require('./cleanSnaps.js'),

	moment = require('moment'),

	dir = '.',
	imgPath = dir+'/img',
	inPath = imgPath+'/cam.jpeg',
    outPath = imgPath+'/out.jpeg'; // jpeg is important because the 'streamer' package depends on it


console.log("Logging in as '" + config.username + "'...");
client.login(config.username, config.password).then(function(){
	
	console.log("Logged in.");

	// sync initially and then syc every 'timeInterval'
	syncSnaps(client);
	
	console.log('Start loop for new snaps.');
	(function loop() {
		// random number between min and max
		var timeMin =  45, timeMax = 60,
			timeInterval =  (Math.floor(Math.random() * (timeMax - timeMin + 1)) + timeMin) * 1000;
		console.log("Timeout in: "+ timeInterval/1000 +"s");
	
		setTimeout(function(){
			console.log('\n\n=========\nLoop!');
			syncSnaps(client);

			loop();
		}, timeInterval);
	}());

},
function(err){
	console.error("Failed to login");
	console.error(err)
});

function syncSnaps(client){
	console.log('Syncing snaps...');

	client.sync(function(err, data){

		if(err){
			console.error("Failed to sync");
			console.error(err);
			return;
		}
		
		console.log('Synced snaps!');

		// if theres snaps clear the feed as soon as we sync
		if(data.snaps.length != 0){
			console.log("Clearing feed...");
			client.clear(function(){
				console.log("Feed cleared");
			});
		}

		// clean up snapchat data
		cleanSnaps(data, function(users){
			if(users.length > 0){
				console.log("Users:", users);
				takeAndSend(users);
			}else{
				console.log("No users");
			}
		});

	});
}

// test image shit
// fixImage(inPath, { width: 640, height: 480 }, function(){});

function takeAndSend(usernames){
	takePicture(inPath, function(){
		console.log('Picture taken and saved.');
		gm(inPath).size(function(err, img){
			
			fixImage(inPath, img, function(){
				console.log('Sending out snapchats!');
				sendSnap(10, outPath, usernames);
			});
		});

	});
}

function fixImage(inPath, img, callback){
	console.log('')
	var x = img.height,
		y = img.width,

		data = client.lastSync.data;

	gm(inPath)
		.rotate('black', 90)
		.crop(x - 120, y, 0, 0)
  		.colorize(Math.random()*100, Math.random()*100, Math.random()*100)
  		.contrast(2)

		.fontSize(20)
		.font('Courier')
		.fill('#f5f5f5')
		.drawText(15, 30, data.username, 'NorthWest')
		.drawText(15, 60, moment().format('h:mm A'), 'NorthWest')
		.drawText(15, 85, moment().format('D/M/YY'), 'NorthWest')
		.drawText(15, 110, data.score+' / '+ data.sent, 'NorthWest')
		.drawText(0, 80, 'cam.rose.digital', 'South')


		.write(outPath, function(err){
			if (err) return console.dir(arguments)
				console.log('Rotated, cropped, coloured and added text to picture.');
				// console.log(this.outname + " created  ::  " + arguments[3]);

				gm().subCommand('composite')
					.gravity('center')
					.in('-compose', 'Over', './watermark.png', outPath)


					.write(outPath, function(err){
						if (err) return console.dir(arguments)
							console.log('Applied watermark to picture.');
							// console.log(this.outname + " created  ::  " + arguments[3]);
							callback();
						}
					);

			}
		);
}