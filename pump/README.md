# Pump
The purpose of this *pump* application is to subscribe to telemetry events on [this](https://github.com/vjrantal/telemetry-contract) smart contract and pump them into [Azure Eventhubs](https://docs.microsoft.com/en-us/azure/event-hubs/) for downstream processing.

## Config
The application expects a local config.json file to be created within the same directory as the app.js file. A blank config file is provided, please populate the provided fields with suitable values.

