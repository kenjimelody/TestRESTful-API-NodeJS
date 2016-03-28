var express = require('express');
var config = require('../config/index');
var utils = require('../utils/index');

var router = express.Router();
var redis_connection;
var memcached;

function setData2Redis( key, value ) {

	redis_connection.set( key, value);
	redis_connection.expire( key, 30 );
	redis_connection.end(true);
}

function setData2Memcached( key, value ) {

	memcached.set( key, value, 60, function(err) {

		console.log(err);
	});
	memcached.end();
}

function getDataFromRedis(req, res, id) {

	var key = "";
	if (id == null) {
		key = "tournament/all";
	} else {
		key = "tournament/" + id;
	}

	redis_connection = config.getRedisConnection();
	redis_connection.on('connect', function() {
    	
    	console.log('Redis connected');
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
				console.log( "Get from Memcached." );
				getDataFromMemcached( req, res, id, key );
				//selectforlist(req, res, id, key, true);
			}
		})
	});
	

	redis_connection.on("error", function (err) {
    	
    	//console.log("Error " + err);
    	console.log( "Get from Memcached." );
    	getDataFromMemcached(req, res, id, key);
	});
}

function getDataFromMemcached(req, res, id, key) {

	memcached = config.getMemcached();

	memcached.get( key, function( err, data ) {

		if( !err ) {

			if(data == undefined) {

				console.log( "Get from MySQL." );
				selectforlist(req, res, id, key, true);

			} else {

				setData2Redis( key, data );
				memcached.end();

				utils.print(res, data);
			}

		} else {
			console.log("Error " + err);
			redis_connection.end(true);
			memcached.end();

			var obj = selectforlist(req, res, id, key, false);
	    	if( obj != null ) {
				utils.printJSON(res, obj);
			}
		}
	});
}

function selectforlist(req, res, id, key, cache) {

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
				setData2Redis( key, jsonStr );
				setData2Memcached( key, jsonStr );
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