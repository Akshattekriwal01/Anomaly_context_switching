# **Anomaly Detection with Context Switching.**

**Primary Goal-** Use [www.platform.clearblade.com](http://www.platform.clearblade.com/) for data collection and analytics over MQTT protocol and mimic and IoT device.

**Secondary Goal-** It helps in determining the possible time when context switching is high and the process queue is big. One can filter the process process running at the returned times and determine debug architecture.

**Video Walkthrough** - https://youtu.be/-PBtGxhq5Mo

**File Description.**

| collection.js | Listens for incoming data on topic &quot;data\_collection&quot; and stores the data in a collection |
| --- | --- |
| os\_module.py | This is the python client for collecting context switching data and sending it over to the clearblade platformat every 3 seconds using MQTT |
| analytics.js | Analyzes anomaly detection and published the data on topic &quot;analytics&quot; over MQTT |
| analize.ipynb | Listens for data published on &quot;analytics&quot; and plots it. |
| config.json | Stores configuration variables. |