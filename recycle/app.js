var EventHubClient = require('azure-event-hubs').Client;
var Config = require('./config.json');
var Promise = require('bluebird');
var request = require('request');

/**
 * Pull in configuration from local config.json file
 */
var connectionString = Config['EventhubsConnectionString'];
var eventhubsName = Config['EventhubsName'];
var eventhubsConsumerGroup = Config['EventhubsConsumerGroup'];
var numberOfEventhubPartitions = Config['NumberOfEventhubPartitions'];
var deviceId = Config['DeviceId'];
var fakeDeviceId = Config['FakeDeviceId'];
var sasToken = Config['SasToken'];
var eventhubsUrl = Config['EventhubsUrl'];

/**
 * Posts telemetry to a given eventhubs HTTP endpoint
 * @param {*} telemetry
 * @param {*} callback
 */
function SendToEventHubs(telemetry, callback) {
	var options =
		{
			method: 'POST',
			uri: eventhubsUrl,
			headers:
			{
				authorization: sasToken
			},
			body: telemetry
		}
	request(options, (error, response, body) => {
		if (error) throw new Error(error);
		callback(response);
	});
}

/**
 * Generates an array for the given range
 * @param {*} begin
 * @param {*} end
 */
function range(begin, end) {
	return Array.apply(null, new Array(end - begin)).map(function (_, i) { return i + begin; });
}

/**
 * Handler function for errors
 * @param {*} partitionId
 * @param {*} err
 */
var errorHandler = function (partitionId, err) {
	console.warn(err);
};

/**
 * Handler function for each message received from eventhubs
 * @param {*} partitionId
 * @param {*} msg
 */
var messageHandler = function (partitionId, msg) {
	var body = msg.body;
	console.log('Received message from: ' + body.deviceid);
	if (body.deviceid == deviceId) {
		console.log('Filter match, expanding message body');
		console.log(msg.body);
		body.deviceid = fakeDeviceId;	// Overwrite device id
		SendToEventHubs(body, function(response) {
			console.log(response.statusCode)
		});
	}
};

/**
 * Create an eventhubs client receiver
 * @param {*} consumerGroup
 * @param {*} partitionId
 * @param {*} filterOptions
 */
var createPartitionReceiver = function (consumerGroup, partitionId, filterOptions) {
	return client.createReceiver(consumerGroup, partitionId, filterOptions)
		.then((rx) => {
			rx.on('message', messageHandler.bind(null, partitionId));
			rx.on('errorReceived', errorHandler.bind(null, partitionId));
		});
};

// Create eventhubs client connectiong
var client = EventHubClient.fromConnectionString(connectionString, eventhubsName)

// Create a receiver for each eventhubs partition
client.open()
	.then(() => {
		Promise.map(range(0, numberOfEventhubPartitions), (partitionId) => {
			return createPartitionReceiver(eventhubsConsumerGroup, partitionId, { startAfterTime: Date.now() })
		})
	})
