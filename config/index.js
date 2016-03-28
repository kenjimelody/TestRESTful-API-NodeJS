var mysql = require('mysql');
var redis = require('redis');

var Memcached = require( "memcached" );
Memcached.config.poolSize = 25;

var config = Config.prototype;
function Config() {

}

config.getMySQLConnection = function() {

	return mysql.createConnection({
		host : "127.0.0.1", 
		port : "8889", 
		user : "root", 
		password : "root", 
		database : "tded_db"
	});
};

config.getRedisConnection = function() {

	var port = "6379";
	var host = "127.0.0.1";
	return redis.createClient(port, host);
};

config.getMemcached = function() {

	//retries, the number of socket allocation retries per request.
	//retry, the time between a server failure and an attempt to set it up back in service.
	//remove: false, if true, authorizes the automatic removal of dead servers from the pool.
	return new Memcached( '127.0.0.1:11211', {retries:10, retry:10000, remove:true} );
};

module.exports = config;