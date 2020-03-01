// model.js

const checkRules = require('./rules');

function initModel () {
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
    moves: [],
    lastMoveOk: true
  }
  return obj;
}

function updateModel (fields, obj) {
  let moveOk = false;
  if (fields.oldPosition && fields.newPosition && fields.newPosition !== fields.oldPosition) {
    let actualPiece = sortObj(obj)[fields.oldPosition.toLowerCase()];
    let sign = '–';
    let capture = false;
    if (sortObj(obj)[fields.newPosition] != undefined && sortObj(obj)[fields.oldPosition] && sortObj2(obj)[fields.newPosition][1] !== fields.player) {
      capture = true;
      sign = 'x';
    }
    // check move
    if (['K','B','T','L','D','S'].includes(actualPiece[0])) {
      moveOk = checkRules(actualPiece[0], fields.oldPosition, fields.newPosition, fields.player, capture, sortObj(obj));
    } else {
      moveOk = true;
    }
    // delete
    if (capture && moveOk) {
      if (fields.player === 'schwarz') {
        obj.weiss_raus.push(sortObj(obj)[fields.newPosition.toLowerCase()]);
        delete obj.weiss[sortObj(obj)[fields.newPosition.toLowerCase()]];
      } else {
        obj.schwarz_raus.push(sortObj(obj)[fields.newPosition.toLowerCase()]);
        delete obj.schwarz[sortObj(obj)[fields.newPosition.toLowerCase()]];
      }

    }
    // move
    if (moveOk && sortObj(obj)[fields.oldPosition] && fields.newPosition && sortObj(obj)[fields.newPosition] == undefined) {
      obj[fields.player][sortObj(obj)[fields.oldPosition.toLowerCase()]] = fields.newPosition.toLowerCase();
      obj.player = fields.player;
      if (actualPiece) {
        obj.moves.push(actualPiece[0]+fields.oldPosition.toLowerCase()+sign+fields.newPosition.toLowerCase());
      }
    }
  }
  obj.lastMoveOk = moveOk;
  return obj;
}

function revokeLastMove (obj) {
  const lastPlayerObj = {weiss: 'schwarz',schwarz: 'weiss'};
  const lastMove = obj.moves.pop();
  let sign = '–';
  if (lastMove.includes('x')) {
    sign = 'x';
  }
  console.log('Last piece: '+obj[obj.player][sortObj(obj)[lastMove.split(sign)[1]]]);
  console.log('Move to last position: '+lastMove.split(sign)[0].substr(lastMove.split(sign)[0].length - 2));
  obj[obj.player][sortObj(obj)[lastMove.split(sign)[1]]] = lastMove.split(sign)[0].substr(lastMove.split(sign)[0].length - 2);
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

//Additional functions

function sortObj (obj) {
  let newObj = {};
  Object.keys(obj.weiss).forEach( piece => {
    newObj[obj.weiss[piece]] = piece;
  });
  Object.keys(obj.schwarz).forEach( piece => {
    newObj[obj.schwarz[piece]] = piece;
  });
  //console.log(newObj);
  return newObj;
}

function sortObj2 (obj) {
  let newObj = {};
  Object.keys(obj.weiss).forEach( piece => {
    newObj[obj.weiss[piece]] = [piece, 'weiss'];
  });
  Object.keys(obj.schwarz).forEach( piece => {
    newObj[obj.schwarz[piece]] = [piece, 'schwarz'];
  });
  //console.log(newObj);
  return newObj;
}


module.exports = {initModel, updateModel, revokeLastMove}
