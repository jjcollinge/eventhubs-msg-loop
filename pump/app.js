var Web3 = require('web3');
var web3 = new Web3();
var Config = require('./config.json');
var request = require('request');

var jsonRpcEndpoint = Config['JsonRpcEndpoint']
var contractAddress = Config['ContractAddress']
var contractSignature = Config['ContractSignature']
var sasToken = Config['SasToken']
var eventhubsUrl = Config['EventhubsUrl']
var contractAbi = JSON.parse(Config['ContractAbi'])
var contractAddress = Config['ContractAddress']

web3.setProvider(new web3.providers.HttpProvider(jsonRpcEndpoint));

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

var contract = web3.eth.contract(contractAbi).at(contractAddress);
evt = contract.TelemetryReceived();
evt.watch((error, result) => {
	console.log("TelemetryReceived fired")
	if(error) {
		console.log(error)
		throw error
	}
	// Telemetry received
	console.log("Raw result")
	console.log(result)
	console.log("")
	var telemetry = result.args.telemetry;
	console.log("Telemetry")
	console.log(telemetry)
	console.log("")
	PostToEventHubs(telemetry, (response) => {
		console.log(response.statusCode);	
	});
});
