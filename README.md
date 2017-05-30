# Eventhubs Message Loop
The *Eventhubs message loop* allows you to listen to specific events on a [smart contract]((https://github.com/vjrantal/telemetry-contract) and publish the contents of the event to [Azure Eventhubs](https://docs.microsoft.com/en-us/azure/event-hubs/). These messages can then be filtered and transformed appropriately for downstream services to process.

This repository contains 2 separate applications:
* Pump
* Recycle

Documentation can be found in their respective folders.

### Disclaimer
These applications were built during a hack for a specific scenario and will not be maintained or generalised. Please feel free to modify these apps to meet your own needs with respect to this [license](https://github.com/jjcollinge/eventhubs-msg-loop/blob/master/LICENSE)