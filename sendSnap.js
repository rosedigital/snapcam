var Q = require('q'),
	fs = require('fs');

module.exports = sendSnaps;

function sendSnaps(client, time, filename, recipients, callback){

	var blob = fs.createReadStream(filename);
	
	client.upload(blob, false)
	.then(function(mediaId){
		return Q.allSettled(recipients.map(function(recipient){
			return client.send(mediaId, recipient, time).catch(function(err) {
				console.error("Failed to send snap to", recipient);
				console.error(err);
			});
		}));
	}, function(error){
		console.error("Unable to upload file", filename);
		console.error(error);
	})
	.then(function(statuses){
		callback(statuses);
	}, function(err) {
		console.error("There was an error")
		console.error(err);
	});

}