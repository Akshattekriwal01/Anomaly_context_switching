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
import matplotlib.pyplot as plt
import matplotlib.dates as md
import numpy as np
import datetime as dt

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
def plot(payload):
    print(payload)
    dates=[dt.datetime.fromtimestamp(ts["timestamp"]) for ts in payload["data"]]
    datenums=md.date2num(dates)
    values= [elem["ctx_switches"] for elem in payload["data"]]
    plt.subplots_adjust(bottom=0.2)
    plt.xticks( rotation=25 )
    ax=plt.gca()
    xfmt = md.DateFormatter('%Y-%m-%d %H:%M:%S')
    ax.xaxis.set_major_formatter(xfmt)
    plt.plot(datenums,values)
    matplotlib.pyplot.show()
   # plt.show(block=True)

def processData(payload):
    plot(payload)

def on_connect(client, userdata, flags, rc):
    # When we connect to the broker, subscribe to the southernplayalisticadillacmuzik topic
    client.subscribe("analytics")
    
def on_message(client, userdata, message):
    # When we receive a message, print it out
    processData(json.loads(message.payload))
    #print "Received message '" + message.payload + "' on topic '" + message.topic + "'"


    

# Connect callbacks to client
mqtt.on_connect = on_connect
mqtt.on_message = on_message

# Connect and wait for messages
mqtt.connect()
while(True):
    time.sleep(1)  # wait for messages

