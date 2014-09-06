// Module dependencies.
var express = require('express');

var app = express.createServer();

// Configuration
app.configure( function() {
});

// Routes
app.get('/', function(req, res) {
    
     
    
});




app.get('/yelp', function(req, res) {
	var typeParam = req.body.type;
	


});


app.listen(3000);
