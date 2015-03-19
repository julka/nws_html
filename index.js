// including modules
var http = require('http');
var parseString = require('xml2js').parseString;
var express = require('express');

// boot strapping API
var app = express();
// getting the view engine
app.set('view engine', 'jade');

// function for grabbing a URL (the XML)
var downloadFile = function(url, callback) {
  // doing async url get
  http.get(url, function(res) {
    if(res.statusCode >= 300 && res.statusCode <= 400 ) {
      // check for a redirect status codes
      // recursing with redirected URL
      downloadFile(res.headers.location, callback);
    } else if(res.statusCode >= 400 && res.statusCode <= 600 ) {
      // checking for other kinds of error status codes
      // let's not do real error handling today..
      console.log('crap, an error status code of ' + res.statusCode);
    } else {
      // otherwise, prep a local variable for the content
      var content = '';
      res.on('data', function(data) {
        // put content in variable as it comes in
        // while converting the buffer to a string
        content = content + data.toString();
      }).on('end', function() {
        // after the entire file is recieved, call callback function
        callback(content);
      });
    }
  });
};

// create an object with the variables used in the template
var createTemplateObject = function(xmlObject) {
  var templateObject = {};
  templateObject['source'] = xmlObject.current_observation.credit;
  templateObject['sourceUrl'] = xmlObject.current_observation.credit_URL;
  templateObject['location'] = xmlObject.current_observation.location;
  templateObject['time'] = xmlObject.current_observation.observation_time;
  templateObject['properties'] = [];
  templateObject['properties'].push({
    property: 'Summary',
    value: xmlObject.current_observation.weather
  });
  templateObject['properties'].push({
    property: 'Temperature',
    value: xmlObject.current_observation.temperature_string
  });
  templateObject['properties'].push({
    property: 'Wind Chill',
    value: xmlObject.current_observation.windchill_string
  });
  templateObject['properties'].push({
    property: 'Relative Humidity',
    value: xmlObject.current_observation.relative_humidity + '%'
  });
  templateObject['properties'].push({
    property: 'Wind',
    value: xmlObject.current_observation.wind_string
  });
  templateObject['properties'].push({
    property: 'Visibility',
    value: xmlObject.current_observation.visibility_mi + ' miles'
  });
  templateObject['properties'].push({
    property: 'Pressure',
    value: xmlObject.current_observation.pressure_string
  });
  templateObject['properties'].push({
    property: 'Dewpoint',
    value: xmlObject.current_observation.dewpoint_string
  });
  templateObject['properties'].push({
    property: 'Station Identifier',
    value: xmlObject.current_observation.station_id
  });
  templateObject['properties'].push({
    property: 'Latitude',
    value: xmlObject.current_observation.latitude
  });
  templateObject['properties'].push({
    property: 'Longitude',
    value: xmlObject.current_observation.longitude
  });

  return templateObject;
}

// create a route and response to go with it
app.get('/', function(req, res) {
  // set the URL
  var url = "http://www.weather.gov/xml/current_obs/KDCA.xml";

  // call back function to parse XML to an object and then use that object to
  // render an html page using a jade template
  var parseXml = function(xml) {
    parseString(xml, function (err, result) {
      // create an object with the variables used in the template
      var templateObject = createTemplateObject(result);

      // render an html page using a jade template
      res.render('index', templateObject);
    });
  }

  // grab the URL and provide a callback
  downloadFile(url, parseXml);
});

// set port for web server
port = 3001;

// start web server
var server=app.listen(port,function(){
  console.log("We have started our server on port " + port);
});