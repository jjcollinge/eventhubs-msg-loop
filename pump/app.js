var Web3 = require('web3');
var web3 = new Web3();
var Config = require('./config.json');
var request = require('request');

/**
 * Pull in configuration from local config.json file
 */
var jsonRpcEndpoint = Config['JsonRpcEndpoint']
var contractAddress = Config['ContractAddress']
var contractSignature = Config['ContractSignature']
var sasToken = Config['SasToken']
var eventhubsUrl = Config['EventhubsUrl']
var contractAbi = JSON.parse(Config['ContractAbi'])
var contractAddress = Config['ContractAddress']

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

// Create connection to a provided JsonRpc endpoint
web3.setProvider(new web3.providers.HttpProvider(jsonRpcEndpoint));

// Subscribe to telemetry events from given contract
var contract = web3.eth.contract(contractAbi).at(contractAddress);
evt = contract.TelemetryReceived();
evt.watch((error, result) => {
	console.log("TelemetryReceived fired")
	if (error) throw new Error(error);
	console.log("Raw result")
	console.log(result)
	console.log("")
	var telemetry = result.args.telemetry;
	console.log("Telemetry")
	console.log(telemetry)
	console.log("")
	SendToEventHubs(telemetry, (response) => {
		console.log(response.statusCode);
	});
});
