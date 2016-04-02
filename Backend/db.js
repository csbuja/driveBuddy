var mysql = require("mysql");

	// First you need to create a connection to the db
var con = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '123456',
	socketPath  : '/var/run/mysqld/mysqld.sock', // use mysqladmin variables | grep sock to get the socket path
	database: 'eecs498',

});

con.connect(function(err){
	if(err){
		console.log('Error connecting to Db');
		return;
	}
	console.log('Connection established');
});
module.exports = con;
