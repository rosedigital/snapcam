var snapchat = require('snapchat'),
	client = new snapchat.Client(),
	config = require('./snapchat-config.json'),

	sendSnap = require('./sendSnap.js'),

	fs = require('fs');

module.exports = downloadSnaps;

function downloadSnaps(callback){

	// console.log("Logging in as '" + config.username + "'...");
	client.login(config.username, config.password).then(function(data){
		
		// console.log("Logged in.");

		// if they're aren't any snaps stop everything maaan
		if(typeof data.snaps === 'undefined' || !data.snaps.length){
			console.log("No snaps!");
			return;
		}

		var snaps = cleanSnaps(data.snaps).received;
		var ids = require('./snapchat-ids.json').ids;

		var newSnaps = [];

		for(var i = 0; i < snaps.length; i++){
			var snap = snaps[i];

			// checking every second so if time is more than 2 secs then its an old snap
			var timeNow = new Date().getTime();
			var snapTime = new Date(snap.timestamp_sent).getTime();
			var time = (timeNow - snapTime) / 1000;

			if(time > 3){
				break;
			}

			// if the id is already there s
			// for(var j = 0; j < ids.length; j++){
			// 	var id = ids[j]; 

			// 	if(id === snap.id){
			// 		break;
			// 	}
			// }

			newSnaps.push(snap.username);
			// id.push(snap.id);

		}

		// fs.writeFile("./snapchat-ids.json", JSON.stringify(ids, null, 2), function(err) {
		// 	if(err) {
		// 		console.log(err);
		// 	} else {
		// 		console.log("The file was saved!");
		// 	}
		// });

		callback(getUnique(newSnaps));

		// send
		// sendSnap(5, outPath, ["kephail",]);
		
		// fs.writeFile("./snapchat-data.json", JSON.stringify(cleanSnaps(data.snaps), null, 2), function(err) {
		//     if(err) {
		//         console.log(err);
		//     } else {
		//         console.log("The file was saved!");
		//     }
		// });

	},
	function(err) {
		console.error("Failed to login");
		console.error(err)
	});

}

function cleanSnaps(snaps){

	var newSnaps = { "sent": [], "received": [], "other": [] };

	snaps.forEach(function(snap){

		var newSnap = {};

		// video
		if(typeof snap.m !== "undefined"){
			if(snap.m == 1){
				snap.type = "video";
			}else if(snap.m == 3){
				snap.type = "added";
			}else{
				snap.type = "image";
			}
			delete snap.m;
		}

		// screenshot
		if(typeof snap.c !== "undefined"){
			snap.screenshot = snap.c;
			delete snap.c
		}

		// username
		if(typeof snap.sn !== "undefined"){
			snap.username = snap.sn;
			delete snap.sn;
		}

		// timestamp
		if(typeof snap.ts !== "undefined"){
			snap.timestamp = snap.ts;
			delete snap.ts;
		}

		// sent timestmap
		if(typeof snap.sts !== "undefined"){
			snap.timestamp_sent = snap.sts;
			delete snap.sts;
		}

		// recipient
		if(typeof snap.rp !== "undefined"){
			snap.recipient = snap.rp;
			delete snap.rp;
		}

		// rounded timer
		if(typeof snap.t !== "undefined"){
			delete snap.t;
		}

		// state
		if(typeof snap.st !== "undefined"){

			if(snap.st == 1){
				snap.state = "unopened";
			}
			else if(snap.st == 2){
				snap.state = "opened";
			}
			else{
				snap.state = snap.st;
			};

			delete snap.st;
		}

		if(snap.type == "image" || snap.type == "video"){

			// if there is a recipient then it was sent
			if(typeof snap.recipient !== "undefined"){
				newSnaps.sent.push(snap);
			}else{
				newSnaps.received.push(snap);
			}

		}else{
			delete snap.t;
			delete snap.timer;
			newSnaps.other.push(snap);
		}

	});

	return newSnaps;
}

function getUnique(arr){

	var newArr = [];

	arr.forEach(function(element, index, array){
	  
	  var found = false;
	  var newId = element;
	  
	  newArr.forEach(function(element, index, array){
	    if(element === newId) found = true;
	  });
	  
	  if(!found){
	    newArr.push(element);  
	  }
	    
	});

	return newArr;

}