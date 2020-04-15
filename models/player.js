/*!
 * lib/player.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */

'use strict';

function setPlayer (fields, sessionId, obj) {
  let tmpObj = {};
  tmpObj.id = sessionId;
  tmpObj.name = fields.username;
  if (obj.players.length === 1) {
    tmpObj.color = 'schwarz';
    obj.players.push(tmpObj);
  } else if (obj.players.length === 0) {
    tmpObj.color = 'weiss';
    obj.players.push(tmpObj);
  }
  console.log(obj.players);
  return obj;
}

function getPlayer (sessionId, obj) {
  if (obj.players.filter( item => item.id === sessionId).length > 0) {
    return obj.players.filter( item => item.id === sessionId)[0];
  } else {
    return { id: '', name: '', color: ''};
  }
}

function getPlayerNames (obj) {
  let playerNames = { weiss: '', schwarz: ''};
  if (obj.players.filter(item => item.color === 'weiss').length > 0) {
    playerNames.weiss = obj.players.filter(item => item.color=='weiss')[0].name;
  }
  if (obj.players.filter(item => item.color === 'schwarz').length > 0) {
    playerNames.schwarz = obj.players.filter(item => item.color=='schwarz')[0].name;
  }
  return playerNames;
}

function checkPlayers (obj) {
  if (obj.players.length === 2) {
    return true
  } else {
    return false;
  }
}

function logoutPlayer (sessionId, obj) {
  try {
    //console.log('Player '+obj.players.filter( item => item.id === [sessionId])[0].name+' logged out');
    obj.players.splice(obj.players.indexOf(obj.players.filter( item => item.id === sessionId)[0]), 1);
    //console.log(obj.players);
  } catch (e) {
    console.log('ERROR logging out player: '+e);
  }
  return obj;
}


module.exports = {setPlayer, getPlayer, checkPlayers, logoutPlayer, getPlayerNames}
