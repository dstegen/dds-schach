// index.js

const http = require('http');
const os = require('os');

const deliver = require('./lib/router-deliver');
const getIPs = require('./lib/utils-getIPs');
const model = require('./lib/model');
const view = require('./lib/view');

let obj = model.initModel();
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
	let fields = {};
	if (request.url.includes('action')) {
		console.log('MOVE');
		request.url.split('?')[1].split('&').forEach( item => {
			fields[item.split('=')[0]] = item.split('=')[1];
		});
		console.log(fields);
		obj = model.updateModel(fields, obj);
		response.writeHead(302, {
	      location: '/' });
	  response.end('');
	} else if (request.url.includes('reset')) {
		obj = model.initModel();
		response.writeHead(302, {
	      location: '/' });
	  response.end('');
	} else if (request.url.includes('revoke')) {
		console.log('REVOKE');
		obj = model.revokeLastMove(obj);
		response.writeHead(302, {
	      location: '/' });
	  response.end('');
	}	else if (request.url.includes('png') || request.url.includes('node_modules') || request.url.includes('public')) {
		let sendObj = deliver(request);
		response.writeHead(sendObj.statusCode, {
	      location: '/',
	      'content-type': sendObj.contentType });
	  response.end(sendObj.data);
	} else {
		response.writeHead(200, {
	      location: '/',
	      'content-type': 'text/html' });
	  response.end(view(obj).data);
	}
}).listen(port, host, () => console.log('DDS-Schach is online: http://'+host+':'+port));
