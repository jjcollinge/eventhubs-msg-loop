# Recycle
The purpose of this *recycle* application is to listen for telemetry events sent to a given [Azure Eventhubs](https://docs.microsoft.com/en-us/azure/event-hubs/) by a [message pump](https://github.com/jjcollinge/eventhubs-msg-loop/tree/master/pump) and recycle them with a specific device id. This allows downstream systems to filter a specific device id that is different to that of the source device.

## Config
The application expects a local config.json file to be created within the same directory as the app.js file. A blank config file is provided, please populate the provided fields with suitable values.

