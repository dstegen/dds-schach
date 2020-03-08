/*!
 * lib/router.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */


const deliver = require('./router-deliver');
const model = require('./model');
const setPlayer = require('./player.js').setPlayer;
const checkPlayers = require('./player.js').checkPlayers;
const view = require('./view');
const viewLogin = require('./viewLogin');

let obj = model.initModel();

function router (request, wss, wsport) {
  let fields = {};
  let sendObj = {
    statusCode: 200,
    contentType: 'text/html; charset=UTF-8',
    cookie: [],
    location: '/',
    data: ''
  };
  if (request.url.includes('media') || request.url.includes('node_modules') || request.url.includes('public')) {
		sendObj = deliver(request);
	} else if (!checkPlayers(request,obj) && !request.url.includes('login')) {
    sendObj.cookie = ['dds-player=; expires='+new Date(0)];
    sendObj.data = viewLogin(obj);
  } else if (request.url.includes('login')) {
    let returnObj = setPlayer(request, obj);
    obj = returnObj[0];
    sendObj.cookie = returnObj[1];
    sendObj.statusCode = 302;
  } else if (request.url.includes('action')) {
		console.log('MOVE');
		request.url.split('?')[1].split('&').forEach( item => {
			fields[item.split('=')[0]] = item.split('=')[1];
		});
		console.log(fields);
		obj = model.updateModel(fields, obj);
    wsFeddback(wss);
    sendObj.statusCode = 302;
	} else if (request.url.includes('reset')) {
    console.log('STAR AGAIN');
    obj = model.initModel()
    wsFeddback(wss);
    sendObj.cookie = ['dds-player=; expires='+new Date(0)];
		sendObj.statusCode = 302;
	} else if (request.url.includes('revoke')) {
		console.log('REVOKE MOVE');
		obj = model.revokeLastMove(obj);
    wsFeddback(wss);
		sendObj.statusCode = 302;
	}	else {
    sendObj = view(obj, wsport);
  }
  return sendObj;
}


// Additional functions

function wsFeddback (wss) {
  wss.clients.forEach(function each(client) {
    setTimeout(function () {client.send('MOVE')}, 100);
  });
}

module.exports = router;
