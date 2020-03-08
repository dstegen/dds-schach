/*!
 * lib/player.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */

function setPlayer (request,obj) {
  let cookie = [];
  let fields = {};
  //console.log(request.url);
  if (request.url.includes('?')) {
    request.url.split('?')[1].split('&').forEach( item => {
      fields[item.split('=')[0]] = item.split('=')[1];
    });
    console.log(fields);
    if (obj.players.weiss === '') {
      obj.players.weiss = fields.playername;
      cookie = ['dds-player=weiss'];
    } else {
      obj.players.schwarz = fields.playername;
      cookie = ['dds-player=schwarz'];
    }
  }
  return [obj, cookie];
}

function checkPlayers (request,obj) {
  if (request.headers.cookie) {
    let cookie = request.headers.cookie;
    //console.log(cookie);
    if (cookie.includes('dds-player=weiss') && obj.players.weiss !== '') {
      return true;
    } else if (cookie.includes('dds-player=schwarz') && obj.players.schwarz !== '') {
      return true;
    } else {
      return false;
    }
  } else if (obj.players.weiss !== '' && obj.players.schwarz !== '') {
    return true;
  } else {
    return false;
  }
}

module.exports = {setPlayer, checkPlayers}
