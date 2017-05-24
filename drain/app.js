var EventHubClient = require('azure-event-hubs').Client;
var Config = require('./config.json');
var Promise = require('bluebird');
var request = require('request');

var connectionString = Config['EventhubsConnectionString']
var eventhubsName = Config['EventhubsName']
var eventhubsConsumerGroup = Config['EventhubsConsumerGroup']
var numberOfEventhubPartitions = Config['NumberOfEventhubPartitions']
var deviceId = Config['DeviceId']
var fakeDeviceId = Config['FakeDeviceId']
var sasToken = Config['SasToken']
var eventhubsUrl = Config['EventhubsUrl']

function PostToEventHubs(telemetry, callback) {
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

function range(begin, end) {
  return Array.apply(null, new Array(end - begin)).map(function(_, i) { return i + begin; });
}

var errorHandler = function(myIdx, err) { 
	console.warn(err);
};
var messageHandler = function (myIdx, msg) {
  var body = msg.body;
	console.log(msg.body.deviceid);
	if(body.deviceid == deviceId) {
  		console.log('Parititon ' + myIdx + ' received: ', msg.body);
			body.deviceid = fakeDeviceId;
			console.log(body);
		/*PostToEventHubs(body, function(response) {
			console.log(response.statusCode)
		})*/		
	}
};

var createPartitionReceiver = function(consumerGroup, partition, filterOptions) {
  return client.createReceiver(consumerGroup, partition, filterOptions)
    .then((rx) => {
      rx.on('message', messageHandler.bind(null, partition));
      rx.on('errorReceived', errorHandler.bind(null, partition));
    });
};

var client = EventHubClient.fromConnectionString(connectionString, eventhubsName)
client.open()
	.then(() => {
		Promise.map(range(0, numberOfEventhubPartitions), (idx) => {
			return createPartitionReceiver(eventhubsConsumerGroup, idx, { startAfterTime: Date.now() }) 	
		})
	})
