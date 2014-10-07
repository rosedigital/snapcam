var fs = require('fs');

module.exports = cleanSnaps;

function cleanSnaps(data, callback){
	// if they're aren't any snaps stop everything maaan
	if(typeof data.snaps === 'undefined' || !data.snaps.length){
		console.log("No snaps!");
		return;
	}

	var snaps = clean(data.snaps).received;

	var newSnaps = [];

	for(var i = 0; i < snaps.length; i++){
		var snap = snaps[i];

		newSnaps.push(snap.username);
	}

	callback(getUnique(newSnaps));
}

function clean(snaps){

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