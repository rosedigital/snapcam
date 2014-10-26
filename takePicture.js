var exec = require('child_process').exec;

module.exports = takePicture;

function takePicture(path, callback){

	var cmd = 'ffmpeg -f video4linux2 -i /dev/video0 -vframes 1 -y '+ path;
	console.log('Taking picture...');
	// console.log("Running: '"+ cmd +"'.");
	exec(cmd, function (error, stdout, stderr){
		if(error) console.log("Error:", error);
		callback();
	});
}