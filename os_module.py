#!/usr/bin/env python
'''
Author: Akshat Tekriwal

This is the python client for collecting context switching data and sending it over to the clearblade platform 
at every 3 seconds using MQTT

Note that I am following UDP approach, and after sending my data I am looking for any response because if if wouldn't 
matter if a few packets arre lost.
'''
from clearblade.ClearBladeCore import System, Query, Developer
import time
import json
import threading
import psutil


with open('config.json', 'r') as f:
    config = json.load(f)

print(config)
#Configure
SystemKey = config["SystemKey"]
SystemSecret = config["SystemSecret"]
mySystem = System(SystemKey, SystemSecret)
email = config["email"]
password = config["password"]
akshat = mySystem.User(email, password)

#Establish MQTT
mqtt = mySystem.Messaging(akshat)

mqtt.connect()
#Send data every 3 second
while (True):
    try:
        payload = { "ctx_switches" : psutil.cpu_stats().ctx_switches,
                    "processor_count": psutil.cpu_count(), # count keeps changing on linux and windows.
                    "process_queue": psutil.getloadavg()[0], } # length of process queue.

        mqtt.publish("data_collection", json.dumps(payload))
        time.sleep(3)
    except:
        print("exception occured")
        
#Close MQTT
mqtt.disconnect()