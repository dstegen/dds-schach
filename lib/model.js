/*!
 * lib/model.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */

'use strict';

//Required Modules
const fs = require('fs');
const path = require('path');
const checkRules = require('./rules');
const getBusyMap = require('./getBusyMap');
const checkBusyMap = require('./checkBusyMap');
const reorderChessObj = require('./reorderChessObj');

function initModel () {
  try {
    if (fs.existsSync(path.join(__dirname, '../sessionids.json'))) {
      fs.unlinkSync(path.join(__dirname, '../sessionids.json'));
    }
  } catch (e) {
    console.log('ERROR removing sessionids.json: '+e);
  }
  let obj = {
    weiss : {
      K : 'e1',
      D : 'd1',
      L1 : 'c1',
      L2 : 'f1',
      S1 : 'b1',
      S2 : 'g1',
      T1 : 'a1',
      T2 : 'h1',
      B1 : 'a2',
      B2 : 'b2',
      B3 : 'c2',
      B4 : 'd2',
      B5 : 'e2',
      B6 : 'f2',
      B7 : 'g2',
      B8 : 'h2',

    },
    weiss_raus : [],
    schwarz : {
      K : 'e8',
      D : 'd8',
      L1 : 'c8',
      L2 : 'f8',
      S1 : 'b8',
      S2 : 'g8',
      T1 : 'a8',
      T2 : 'h8',
      B1 : 'a7',
      B2 : 'b7',
      B3 : 'c7',
      B4 : 'd7',
      B5 : 'e7',
      B6 : 'f7',
      B7 : 'g7',
      B8 : 'h7',
    },
    schwarz_raus : [],
    player : 'schwarz',
    players : [],
    players1 : {
      weiss: '',
      weissId: '',
      schwarz: '',
      schwarzId: ''
    },
    moves: [],
    lastMoveOk: true
  }
  return obj;
}

function updateModel (fields, obj) {
  let moveOk = false;
  let jumpOk = false;
  if (fields.oldPosition && fields.newPosition && fields.newPosition !== fields.oldPosition) {
    let actualPiece = reorderChessObj(obj)[fields.oldPosition.toLowerCase()];
    let sign = '–';
    let capture = false;
    if (reorderChessObj(obj)[fields.newPosition] != undefined && reorderChessObj(obj)[fields.oldPosition] && reorderChessObj(obj, true)[fields.newPosition][1] !== fields.player) {
      capture = true;
      sign = 'x';
    }
    // check move
    if (actualPiece[0] && ['K','B','T','L','D'].includes(actualPiece[0])) {
      jumpOk = checkBusyMap(fields, getBusyMap(reorderChessObj(obj)));
    } else {
      jumpOk = true;
    }
    moveOk = checkRules(actualPiece[0], fields.oldPosition, fields.newPosition, fields.player, capture);
    // delete
    if (capture && moveOk && jumpOk) {
      if (fields.player === 'schwarz') {
        obj.weiss_raus.push(reorderChessObj(obj)[fields.newPosition.toLowerCase()]);
        delete obj.weiss[reorderChessObj(obj)[fields.newPosition.toLowerCase()]];
      } else {
        obj.schwarz_raus.push(reorderChessObj(obj)[fields.newPosition.toLowerCase()]);
        delete obj.schwarz[reorderChessObj(obj)[fields.newPosition.toLowerCase()]];
      }

    }
    // move
    if (moveOk && jumpOk && reorderChessObj(obj)[fields.oldPosition] && fields.newPosition && reorderChessObj(obj)[fields.newPosition] == undefined) {
      obj[fields.player][reorderChessObj(obj)[fields.oldPosition.toLowerCase()]] = fields.newPosition.toLowerCase();
      obj.player = fields.player;
      if (actualPiece) {
        obj.moves.push(actualPiece[0]+fields.oldPosition.toLowerCase()+sign+fields.newPosition.toLowerCase());
      }
    }
  }
  obj.lastMoveOk = moveOk && jumpOk;
  getBusyMap(reorderChessObj(obj))
  return obj;
}

function revokeLastMove (obj) {
  const lastPlayerObj = {weiss: 'schwarz',schwarz: 'weiss'};
  const lastMove = obj.moves.pop();
  let sign = '–';
  if (lastMove.includes('x')) {
    sign = 'x';
  }
  console.log('Last piece: '+obj[obj.player][reorderChessObj(obj)[lastMove.split(sign)[1]]]);
  console.log('Move to last position: '+lastMove.split(sign)[0].substr(lastMove.split(sign)[0].length - 2));
  obj[obj.player][reorderChessObj(obj)[lastMove.split(sign)[1]]] = lastMove.split(sign)[0].substr(lastMove.split(sign)[0].length - 2);
  if (lastMove.includes('x')) {
    // bring captured back in
    const playerCaptured = lastPlayerObj[obj.player];
    const capturedPiece = obj[playerCaptured+'_raus'].pop();
    obj[playerCaptured][capturedPiece] = lastMove.split(sign)[1];
    console.log('Moved back: '+capturedPiece+' to '+lastMove.split(sign)[1]);
  }
  obj.player = lastPlayerObj[obj.player];
  return obj;
}


module.exports = {initModel, updateModel, revokeLastMove}
