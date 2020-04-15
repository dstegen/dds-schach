/*!
 * lib/controller.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const path = require('path');
const {cookie, uniSend, getFormObj, authenticate, SendObj} = require('webapputils-ds');
const model = require('./model');
const {setPlayer, getPlayer, checkPlayers, logoutPlayer, getPlayerNames} = require('./player');
const view = require('../views/view');
const viewLogin = require('../views/viewLogin');

let obj = model.initModel();
let sessionFilePath = path.join(__dirname, '../sessionids.json');
let passwdObj = {
  'Dani': '$2a$10$Lcj1Cq9ldWV4bKrnxzVHqe1uDQwvleEQi1V5pHBcWJqRQDulOFtFa',
  'Sam' : '$2a$10$Lcj1Cq9ldWV4bKrnxzVHqe1uDQwvleEQi1V5pHBcWJqRQDulOFtFa',
  'Dave': '$2a$10$Lcj1Cq9ldWV4bKrnxzVHqe1uDQwvleEQi1V5pHBcWJqRQDulOFtFa'
}
try {
  passwdObj = require('../passwd.json');
} catch (e) {
  console.log('ERROR no passwd.json file found! Using demo data! ');
}


function webView (request, response, wss, wsport) {
  if (authenticate.loggedIn(cookie(request).sessionid, sessionFilePath) || checkPlayers(obj)) {
    uniSend(view(obj, wsport, getPlayerNames(obj)), response);
  } else {
    uniSend(viewLogin(), response);
  }
}

function updateAction (request, response, wss) {
  if (authenticate.loggedIn(cookie(request).sessionid, sessionFilePath)) {
    getFormObj(request).then(
      data => {
          console.log('MOVE');
          obj = model.updateModel(data.fields, obj);
      }
    ).catch(
      error => {
        console.log('ERROR move: '+error.message);
    });
  }
  uniSend(new SendObj(302), response);
  wsFeddback(wss, 'MOVE');
}

function resetAction (request, response, wss) {
  if (authenticate.loggedIn(cookie(request).sessionid, sessionFilePath)) {
    console.log('STAR AGAIN');
    obj = model.initModel()
    // TODO: gracefully logout!
    //sendObj.cookie = ['ddsplayer=; expires='+new Date(1), 'ddssession=; expires='+new Date(1)];
    wsFeddback(wss, 'STAR AGAIN');
    uniSend(new SendObj(302, ['sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;','ddsplayer=; expires='+new Date(1)]), response);
  }
}

function revokeAction (request, response, wss) {
  if (authenticate.loggedIn(cookie(request).sessionid, sessionFilePath)) {
    console.log('REVOKE MOVE');
    obj = model.revokeLastMove(obj);
    uniSend(new SendObj(302), response);
    wsFeddback(wss, 'REVOKE MOVE');
  }
}

function login (request, response, wss) {
  getFormObj(request).then(
    data => {
      let sessionId = authenticate.login(passwdObj, data.fields.username, data.fields.password, sessionFilePath)
      if (sessionId !== undefined) {
        obj = setPlayer(data.fields, sessionId, obj);
      }
      uniSend(new SendObj(302, ['sessionid='+sessionId, 'ddsplayer='+getPlayer(sessionId, obj).color]), response);
      wsFeddback(wss, 'LOGIN');
    }
  ).catch(
    error => {
      console.log('ERROR login: '+error.message);
  });
}

function logout (request, response, wss) {
  authenticate.logout(cookie(request).sessionid, sessionFilePath)
  logoutPlayer(cookie(request).sessionid, obj);
  uniSend(new SendObj(302, ['sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;','ddsplayer=; expires='+new Date(1)]), response);
  wsFeddback(wss, 'LOGOUT');
}


// Additional functions

function wsFeddback (wss, txt) {
  if (txt == undefined || txt == '') txt ='test';
  wss.clients.forEach(client => {
    setTimeout(function () {
      client.send(txt)
    }, 100);
  });
}


module.exports = {webView, login, logout, updateAction, resetAction, revokeAction};
