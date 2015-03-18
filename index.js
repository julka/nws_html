// including modules
var http = require('http');
var parseString = require('xml2js').parseString;
var express = require('express');

// boot strapping API
var app = express();
// getting the view engine
app.set('view engine', 'jade');

var url = "http://www.weather.gov/xml/current_obs/KDCA.xml";

// set port for web server
port = 3001;

// start web server
var server=app.listen(port,function(){
  console.log("We have started our server on port " + port);
});
