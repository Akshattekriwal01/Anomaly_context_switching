/**
 * Type: Micro Service
 * Description: A system has a problem when not only it's context switching is high,
 * but also the process queue length is big. We will figure the "time" when these 2 things 
 * occur simultaneously. This "time" will help us filter the processes to debug. One only needs
 * to look at process running at time = "time" 
 * 
 * This service runs every 15 minutes. 
 * 
 * @param {CbServer.BasicReq} req
 */

 function Analytics_test(req,resp){
    try{
    // These are parameters passed into the code service
    var params = req.params
    
    var query = ClearBlade.Query({collectionID: "eef5dd860cd4b6c4ec9ffcadd1f101"});
	var rawQueryJson = {
        timestamp: { // 15 minutes ago (from now)
            $gt: new Date(new Date(new Date().getTime() - (1000*60*15)))
        }
    }
	query.rawQuery(JSON.stringify(rawQueryJson));
    query.ascending("timestamp");
    query.setPage(400, 1);

    var cb = function (err, data) {
   	    if (err) {
   	    	resp.error("fetch error : " + JSON.stringify(data));
   	    } else {
            var data = data["DATA"] 
            // analytics
            var total_load = 0
            var total_ctx_switches = 0;
            data.forEach(function(e){

                e.ctx_switches = (e.ctx_switches/e.processor_count)/100
                total_ctx_switches = total_ctx_switches + e.ctx_switches

                // find load 
                e.load = e.process_queue/e.processor_count * 100
                total_load = total_load + e.load

            })
            var avg_load = total_load/data.length 
            var avg_ctx_switches = total_ctx_switches/data.length 
            var anomaly_time = [] 

            data.forEach(function(e){
                if(e.load > avg_load && e.ctx_switches > avg_ctx_switches){
                    anomaly_time.push(e.timestamp)
                }
            })

            var payload = {"data":data, "anomaly_time": anomaly_time}

            //publish the payload to topic "analytics"
            function myCodeService(req, resp){
                var client = new MQTT.Client();
               client.publish("analytics", JSON.stringify(payload))
                    .then(function (resolve) {
                        resp.success("success");
                    }, function (reason) {
                        log(reason)
                        resp.error('failure');
                    });

            }
            myCodeService(req, resp)
   	    }
   	};
   	query.fetch(cb);
   
    }catch(err){
        resp.error(err)
    }
}
