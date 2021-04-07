/**
 * Type: Stream Service
 * Description: Listens for incoming data on topic "data_collection" and stores it 
 * in the Collection
 * Parameter: Request,Response Objects. 
 */

 function stream_test(req, resp) {
    ClearBlade.init({ request: req });
    var messaging = ClearBlade.Messaging();
    const TOPIC = "data_collection";
    messaging.subscribe(TOPIC, WaitLoop);
  
    function WaitLoop(err, data) {
  
      if (err) {
        messaging.publish("error", "Subscribe failed: " + data);
        resp.error(data);
      }
      messaging.publish("success", "Subscribed to Shared Topic. Starting Loop.");
  
      while (true) {
        
        messaging.waitForMessage([TOPIC], function(err, msg, topic) {
          if (err) {
            messaging.publish("error", "Failed to wait for message: " + err + " " + msg + "  " + topic);
            resp.error("Failed to wait for message: " + err + " " + msg + "    " + topic);
          } 
          processMessage(msg, topic);
        });
      }
    }
  
    function processMessage(msg, topic) {
     //TODO : sanatize message and check if it is valid
        var row = JSON.parse(msg);
        
        row["timestamp"] = new Date().valueOf(); // adding timestamp to the message
  
         var callback = function (err, data) {
          if (err) {
           messaging.publish("processedmessage", "unable to add  " +msg+ " in  "+ topic+" to collection ");
           log("err"+err); // use winston to log
          }
      };
        var col = ClearBlade.Collection( {collectionID:"eef5dd860cd4b6c4ec9ffcadd1f101"});
        col.create(row, callback);
   }
  }