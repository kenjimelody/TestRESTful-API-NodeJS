var utils = Utils.prototype;
function Utils() {

}

utils.getJSONObject = function(code, message, results) {

	var header = {};
	header.res_code = code;
	header.res_desc = message;

	if( results != null )
		header.total_row = results.length;

	var data = {};
	data.header = header;

	if(results != null && results.length > 0)
		data.body = results;
	else
		data.body = "";

	return data;
};

utils.printJSON = function(res, jsonObj) {

	res.writeHead(200, {"Content-Type": "application/json"});
	res.write( JSON.stringify(jsonObj) );
	res.end();
};

utils.print = function(res, message) {

	res.writeHead(200, {"Content-Type": "application/json"});
	res.write( message );
	res.end();
};

module.exports = utils;