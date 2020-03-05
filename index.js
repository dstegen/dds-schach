/*!
 * index.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */

const http = require('http');
const WebSocket = require('ws');

const getIPs = require('./lib/utils-getIPs');
const router = require('./lib/router');

let port = 8080;
let host = 'localhost';
if (getIPs()['en0']) {
	host = getIPs()['en0'];
} else if (getIPs()['eth0']) {
	host = getIPs()['eth0'];
}
console.log('Available network devices: ');
console.log(getIPs());

const wss = new WebSocket.Server({
	host: host,
	port: 8000,
	clientTracking: true
 });

/*
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
		wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
				setTimeout(function () {client.send('something')}, 100);
      }
    });
  });
  //ws.send('something');
});
*/

http.createServer( function (request, response) {
  sendResponse(router(request, wss), response);
}).listen(port, host, () => console.log('DDS-Schach is online: http://'+host+':'+port));


// Additional function

function sendResponse (sendObj, response) {
  response.writeHead(sendObj.statusCode, {
      location: sendObj.location,
      'set-cookie': sendObj.cookie,
      'content-type': sendObj.contentType });
  response.end(sendObj.data);
}
