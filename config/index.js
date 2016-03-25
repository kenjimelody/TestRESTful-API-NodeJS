var mysql = require('mysql');
var redis = require('redis');

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

	return redis.createClient("6379", "127.0.0.1");
};

module.exports = config;