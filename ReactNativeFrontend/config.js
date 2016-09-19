USE_HEROKU_HOST = true;
var hostname = "";

if(! USE_HEROKU_HOST){
	hostname = "localhost:3000"; //and port
}
else{
	hostname = "pitstoppal-backend.herokuapp.com";
}

var config = {
	hostname:hostname
};


module.exports = config;