var express = require('express');
var config = require('../config/index');
var utils = require('../utils/index');

var router = express.Router();
var redis_connection;

function getDataFromRedis(req, res, id) {

	redis_connection = config.getRedisConnection();
	redis_connection.on('connect', function() {
    	
    	console.log('Redis connected');

    	//SET
    	var key = "";
    	if (id == null) {
    		key = "tournament/all";
    	} else {
    		key = "tournament/" + id;
    	}

    	redis_connection.exists(key, function(err, reply) {

			if (err) {
				utils.printJSON(res, utils.getJSONObject(500, err.stack, null));
				return;
			}

			if(reply == true) {

				console.log( "Get from Redis." );
				redis_connection.get( key, function(error, obj) {
					utils.print(res, obj);
					redis_connection.end(true);
    			});

			} else {
				console.log( "Get from MySQL." );
				selectforlist(req, res, id, true);
			}
		})
	});
	

	redis_connection.on("error", function (err) {
    	
    	console.log("Error " + err);
    	redis_connection.end(true);
    	
    	var obj = selectforlist(req, res, id, false);
    	if( obj != null ) {
			utils.printJSON(res, obj);
		}
	});
}

function selectforlist(req, res, id, cache) {

	var query = "";
	var tournament_id = "";

	var mysql_connection = config.getMySQLConnection();
	mysql_connection.connect(function(err) {

		if (err) {
			utils.printJSON(res, utils.getJSONObject(500, err.stack, null));
			return;
		}

		console.log( 'MySQL connected as id ' + mysql_connection.threadId )

		if( id == null ) {
			query = "SELECT * FROM sp_tournament WHERE status=1";
		} else {
			query = "SELECT * FROM sp_tournament WHERE tournament_id=" + id + " AND status=1";
		}

		mysql_connection.query({
			sql : query, 
			timeout : 2000, //2 Sec.
		}, function(error, results, fields) {

			mysql_connection.end();

			if (error) {
				utils.printJSON(res, utils.getJSONObject(500, err.stack, null));
				return;
			}

			var jsonObj = utils.getJSONObject(200, "Success", results);
			var jsonStr = JSON.stringify(jsonObj);

			if ( cache ) {

				//SET
				if( id == null ) {
					redis_connection.set( "tournament/all", jsonStr);
					redis_connection.expire( "tournament/all", 30 );
				} else {
					redis_connection.set( "tournament/" + id, jsonStr);
					redis_connection.expire( "tournament/" + id, 30 );
				}

    			redis_connection.end(true);
			}

			utils.printJSON(res, jsonObj);
		});
	});
}

router.get('/', function(req, res, next) {

	getDataFromRedis(req, res, req.params.id);
});

router.get('/:id', function(req, res, next) {

	getDataFromRedis(req, res, req.params.id);
});

module.exports = router;