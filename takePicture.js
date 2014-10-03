var exec = require('child_process').exec;


module.exports = takePicture;

function takePicture(path, callback){
	var cmd = 'streamer -f jpeg -o '+ path +' -s 640x480 -j 100';
	console.log("Running: '"+ cmd +"'.")
	exec(cmd, function (error, stdout, stderr){
		if(error) console.log("Error:", error);
		callback();
	});

}