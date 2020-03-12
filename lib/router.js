/*!
 * lib/router.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */


const deliver = require('./router-deliver');
const model = require('./model');
const player = require('./player');
const setPlayer = require('./player').setPlayer;
const checkPlayers = require('./player').checkPlayers;
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
    sendObj.cookie = ['ddsplayer=; expires='+new Date(1), 'ddssession=; expires='+new Date(1)];
    sendObj.data = viewLogin(obj);
  } else if (request.url.includes('login')) {
    let returnObj = setPlayer(request, obj);
    obj = returnObj[0];
    sendObj.cookie = returnObj[1];
    sendObj.statusCode = 302;
    wsFeddback(wss, 'LOGIN');
  } else if (request.url.includes('logout')) {
    player.logoutPlayer(request, obj);
    wsFeddback(wss, 'LOGOUT');
    sendObj.cookie = ['ddsplayer=; expires='+new Date(1), 'ddssession=; expires='+new Date(1)];
    sendObj.statusCode = 302;
  } else if (request.url.includes('action')) {
		console.log('MOVE');
		request.url.split('?')[1].split('&').forEach( item => {
			fields[item.split('=')[0]] = item.split('=')[1];
		});
		obj = model.updateModel(fields, obj);
    wsFeddback(wss, 'MOVE');
    sendObj.statusCode = 302;
	} else if (request.url.includes('reset')) {
    console.log('STAR AGAIN');
    obj = model.initModel()
    // TODO: gracefully logout!
    //player.resetPlayers(); NOT WORKING!!!
    sendObj.cookie = ['ddsplayer=; expires='+new Date(1), 'ddssession=; expires='+new Date(1)];
		sendObj.statusCode = 302;
    wsFeddback(wss, 'STAR AGAIN');
	} else if (request.url.includes('revoke')) {
		console.log('REVOKE MOVE');
		obj = model.revokeLastMove(obj);
    wsFeddback(wss, 'REVOKE MOVE');
		sendObj.statusCode = 302;
	}	else {
    sendObj = view(obj, wsport);
  }
  return sendObj;
}


// Additional functions

function wsFeddback (wss, txt) {
  wss.clients.forEach(function each(client) {
    setTimeout(function () {client.send(txt)}, 100);
  });
}

module.exports = router;
