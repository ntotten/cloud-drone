var arDrone = require('ar-drone');
var client  = arDrone.createClient({ 'ip': '[drone ip address]' });

console.log('running...');

var takeoff = function() {
  console.log('takeoff...');
  client.takeoff();
};

var land = function() {
  console.log('landing...')
  client.land();
};

var rotate = function() {
  console.log('rotating...');
  client.clockwise(0.5);
}


var azure = require('azure');

var serviceBusService = azure.createServiceBusService('[namespace]', '[key]');
var recieveMessage = function() {
  serviceBusService.receiveQueueMessage('pilot', function(error, serverMessage){
      if(!error){
          switch (serverMessage.body) {
            case 'takeoff':
            takeoff();
            break;
            case 'land':
            land();
            break;
            case 'rotate':
            rotate();
            break;
          }
      }
  });
};

var blobService = azure.createBlobService('[name]', '[key]');
var saveData = function(data) {
  var t = new Date().getTime();
  if ((t % 100) == 0) {
    var name = 'data_' + t + '.json';
    console.log('saving log data ' + name);
    var json = JSON.stringify(data);
    blobService.createBlockBlobFromText('logs', name, json, function(error){
        if(error){
          console.error(error);
        }
    });
  }
};

client.on('navdata', saveData);
setInterval(function() { recieveMessage(); }, 1000);
