// index.js

const http = require('http');

const getIPs = require('./lib/utils-getIPs');
const router = require('./lib/router');
const model = require('./lib/model');


let port = 8080;
let host = 'localhost';
if (getIPs()['en0']) {
	host = getIPs()['en0'];
} else if (getIPs()['eth0']) {
	host = getIPs()['eth0'];
}
console.log('Available network devices: ');
console.log(getIPs());

http.createServer( function (request, response) {
  sendResponse(router(request), response);
}).listen(port, host, () => console.log('DDS-Schach is online: http://'+host+':'+port));


// Additional function

function sendResponse (sendObj, response) {
  response.writeHead(sendObj.statusCode, {
      location: sendObj.location,
      'set-cookie': sendObj.cookie,
      'content-type': sendObj.contentType });
  response.end(sendObj.data);
}
