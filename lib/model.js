// model.js

const checkRules = require('./rules');
const getBusyMap = require('./getBusyMap');
const reorderChessObj = require('./reorderChessObj');

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
    if (['K','B','T','L','D'].includes(actualPiece[0])) {
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


//Additional functions

function checkBusyMap (fields, busyMap) {
  const colObj = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
  const localOP = [colObj[fields.oldPosition[0]],Number(fields.oldPosition[1])];
  const localNP = [colObj[fields.newPosition[0]],Number(fields.newPosition[1])];
  const localLimit = [localNP[0]-localOP[0],localNP[1]-localOP[1]];
  console.log('distance: '+localLimit);
  // get limit
  let limit = 8;
  if (Math.abs(localLimit[0]) > Math.abs(localLimit[1])) {
    limit = Math.abs(localLimit[0]);
  } else {
    limit = Math.abs(localLimit[1]);
  }
  // get sign for x and y
  let signX = Math.sign(localLimit[0]);
  let signY = Math.sign(localLimit[1]);
  let tempPo = [];
  for (let i=1; i<limit; i++) {
    tempPo[0] = localOP[0]+(i*signX);
    tempPo[1] = localOP[1]+(i*signY);
    //console.log(busyMap[tempPo[1]][tempPo[0]]);
    if (busyMap[tempPo[1]][tempPo[0]]) {
      console.log(tempPo+' is busy!');
      return false;
    } else {
      console.log(tempPo+' is empty!');
    }
  }
  return true;
}


module.exports = {initModel, updateModel, revokeLastMove}
