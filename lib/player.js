/*!
 * lib/player.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */

//const auth = require('./authenticate');
const uuidv4 = require('uuid').v4;
const fs = require('fs');
const path = require('path');
//const passwd = require('../passwd.json');

function setPlayer (request,obj) {
  let cookie = [];
  let fields = {};
  if (request.url.includes('?')) {
    request.url.split('?')[1].split('&').forEach( item => {
      fields[item.split('=')[0]] = item.split('=')[1];
    });
    //const loginResult = auth.login(passwd, fields.playername, fields.playerpasswd ,path.join(path.resolve(),'sessionids.json'));
    const loginResult = [uuidv4(), true];
    if (loginResult[1]) {
      if (obj.players.weiss === '') {
        obj.players.weiss = fields.playername;
        obj.players.weissId = loginResult[0];
        cookie = ['ddsplayer=weiss', 'ddssession='+loginResult[0]];
        console.log('Player '+fields.playername+' logged in and plays "weiss"');
      } else {
        obj.players.schwarz = fields.playername;
        obj.players.schwarzId = loginResult[0];
        cookie = ['ddsplayer=schwarz', 'ddssession='+loginResult[0]];
        console.log('Player '+fields.playername+' logged in and plays "schwarz"');
      }
    }
  }
  return [obj, cookie];
}

function checkPlayers (request, obj) {
  if (request.headers.cookie) {
    let curCookie = {};
    request.headers.cookie.split(';').forEach( cookie => {
      curCookie[cookie.split('=')[0].replace(/\s/,'')] = cookie.split('=')[1];
    })
    if (true) { // auth.loggedIn(curCookie['ddssession'], path.join(path.resolve(),'sessionids.json'))
      if (curCookie.ddsplayer === 'weiss' && obj.players.weiss !== '') {
        return true;
      } else if (curCookie.ddsplayer === 'schwarz' && obj.players.schwarz !== '') {
        return true;
      }
    } else {
      return false;
    }
  } else if (obj.players.weiss !== '' && obj.players.schwarz !== '') {
    return true;
  } else {
    return false;
  }
}

function resetPlayers () {
  try {
    fs.unlinkSync(path.join(path.resolve(),'sessionids.json'));
  } catch (e) {
    console.log('ERROR deleting SessionObj: '+e);
  }
}

function logoutPlayer (request, obj) {
  let curCookie = {};
  if (request.headers.cookie) {
    request.headers.cookie.split(';').forEach( cookie => {
      curCookie[cookie.split('=')[0].replace(/\s/,'')] = cookie.split('=')[1];
    });
    console.log('Player '+obj.players[curCookie.ddsplayer]+' logged out');
    obj.players[curCookie.ddsplayer] = '';
    obj.players[curCookie.ddsplayer+'Id'] = '';
    //auth.logout(curCookie['ddssession'], path.join(path.resolve(),'sessionids.json'));
  }
}

module.exports = {setPlayer, checkPlayers, resetPlayers, logoutPlayer}
