
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var azure = require('azure');
var serviceBusService = azure.createServiceBusService('[namespace]', '[key]');
var sendCommand = function(command, callback) {
    serviceBusService.sendQueueMessage('pilot', command, function(error) {
      if(!error){
          callback();
       }
  });
}

app.get('/takeoff', function(req, res) {
  sendCommand('takeoff', function() {
    res.redirect('/');
  });
});
app.get('/land', function(req, res) {
  sendCommand('land', function() {
    res.redirect('/');
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
