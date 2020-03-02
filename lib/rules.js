// rules.js

const colObj = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
const letterArray = ['x','a','b','c','d','e','f','g','h','x','x','x','x','x','x'];
let limit = 8;
let signArray = [];

function checkRules (piece, oldPosition, newPosition, currentPlayer, capture, busyObj) {
  let oldP = [colObj[oldPosition[0]], Number(oldPosition[1])];
  let newP = [colObj[newPosition[0]], Number(newPosition[1])];
  limit = 8;
  if (colObj[oldPosition[0]] != colObj[newPosition[0]]) {
    limit = Math.abs(colObj[newPosition[0]] - colObj[oldPosition[0]]);
    signArray[0] = Math.sign(colObj[newPosition[0]] - colObj[oldPosition[0]]);
  }
  if (Number(oldPosition[1]) != Number(newPosition[1])) {
    limit = Math.abs(Number(newPosition[1]) - Number(oldPosition[1]));
    signArray[1] = Math.sign(Number(newPosition[1]) - Number(oldPosition[1]));
  }
  //console.log('limit: '+limit);
  //console.log(signArray);
  switch (piece[0]) {
    case 'K':
      if (oldP[0]+1 == newP[0] && oldP[1]+1 == newP[1]) {
        return true;
      } else if (oldP[0]+1 == newP[0] && oldP[1] == newP[1]) {
        return true;
      } else if (oldP[0]+1 == newP[0] && oldP[1]-1 == newP[1]) {
        return true;
      } else if (oldP[0] == newP[0] && oldP[1]+1 == newP[1]) {
        return true;
      } else if (oldP[0] == newP[0] && oldP[1]-1 == newP[1]) {
        return true;
      } else if (oldP[0]-1 == newP[0] && oldP[1]+1 == newP[1]) {
        return true;
      } else if (oldP[0]-1 == newP[0] && oldP[1] == newP[1]) {
        return true;
      } else if (oldP[0]-1 == newP[0] && oldP[1]-1 == newP[1]) {
        return true;
      } else {
        return false;
      }
      break;
    case 'B':
       if (capture) {
        if (oldP[0]+1 == newP[0] && oldP[1]+1 == newP[1] && currentPlayer === 'weiss') {
          return true;
        } else if (oldP[0]-1 == newP[0] && oldP[1]+1 == newP[1] && currentPlayer === 'weiss') {
          return true;
        } else if (oldP[0]+1 == newP[0] && oldP[1]-1 == newP[1] && currentPlayer === 'schwarz') {
          return true;
        } else if (oldP[0]-1 == newP[0] && oldP[1]-1 == newP[1] && currentPlayer === 'schwarz') {
          return true;
        } else {
          return false;
        }
      } else if (oldP[0] == newP[0] && oldP[1]+1 == newP[1] && currentPlayer === 'weiss') {
        return true;
      } else if (oldP[1] === 2 && (oldP[0] == newP[0] && oldP[1]+2 == newP[1]) && currentPlayer === 'weiss' && checkJumpOver(busyObj, oldPosition, 'B', newPosition)) {
        return true;
      } else if (oldP[0] == newP[0] && oldP[1]-1 == newP[1] && currentPlayer === 'schwarz') {
        return true;
      } else if (oldP[1] === 7 && (oldP[0] == newP[0] && oldP[1]-2 == newP[1]) && currentPlayer === 'schwarz' && checkJumpOver(busyObj, oldPosition, 'B', newPosition)) {
        return true;
      } else{
        return false;
      }
      break;
    case 'T':
    //console.log(checkJumpOver(busyObj, oldPosition, 'T', newPosition));
      for (let i=1; i<8; i++) {
        if (oldP[0]+i == newP[0] && oldP[1] == newP[1] && checkJumpOver(busyObj, oldPosition, 'T', newPosition)) {
          return true;
        } else if (oldP[0] == newP[0] && oldP[1]+i == newP[1] && checkJumpOver(busyObj, oldPosition, 'T', newPosition)) {
          return true;
        } else if (oldP[0] == newP[0] && oldP[1]-i == newP[1] && checkJumpOver(busyObj, oldPosition, 'T', newPosition)) {
          return true;
        } else if (oldP[0]-i == newP[0] && oldP[1] == newP[1] && checkJumpOver(busyObj, oldPosition, 'T', newPosition)) {
          return true;
        }
      }
      return false;
      break;
    case 'L':
      console.log(checkJumpOver(busyObj, oldPosition, 'L', newPosition));
      for (let i=1; i<8; i++) {
        if (oldP[0]+i == newP[0] && oldP[1]+i == newP[1] && checkJumpOver(busyObj, oldPosition, 'L', newPosition)) {
          return true;
        } else if (oldP[0]+i == newP[0] && oldP[1]-i == newP[1] && checkJumpOver(busyObj, oldPosition, 'L', newPosition)) {
          return true;
        } else if (oldP[0]-i == newP[0] && oldP[1]-i == newP[1] && checkJumpOver(busyObj, oldPosition, 'L', newPosition)) {
          return true;
        } else if (oldP[0]-i == newP[0] && oldP[1]+i == newP[1] && checkJumpOver(busyObj, oldPosition, 'L', newPosition)) {
          return true;
        }
      }
      return false;
      break;
    case 'D':
      for (let i=1; i<8; i++) {
        if (oldP[0]+i == newP[0] && oldP[1] == newP[1]) {
          return true;
        } else if (oldP[0] == newP[0] && oldP[1]+i == newP[1]) {
          return true;
        } else if (oldP[0] == newP[0] && oldP[1]-i == newP[1]) {
          return true;
        } else if (oldP[0]-i == newP[0] && oldP[1] == newP[1]) {
          return true;
        }
      }
      for (let i=1; i<8; i++) {
        if (oldP[0]+i == newP[0] && oldP[1]+i == newP[1]) {
          return true;
        } else if (oldP[0]+i == newP[0] && oldP[1]-i == newP[1]) {
          return true;
        } else if (oldP[0]-i == newP[0] && oldP[1]-i == newP[1]) {
          return true;
        } else if (oldP[0]-i == newP[0] && oldP[1]+i == newP[1]) {
          return true;
        }
      }
      return false;
      break;
    case 'S':
      if (oldP[0]+1 == newP[0] && oldP[1]+2 == newP[1]) {
        return true;
      } else if (oldP[0]+1 == newP[0] && oldP[1]-2 == newP[1]) {
        return true;
      } else if (oldP[0]+2 == newP[0] && oldP[1]+1 == newP[1]) {
        return true;
      } else if (oldP[0]+2 == newP[0] && oldP[1]-1 == newP[1]) {
        return true;
      } else if (oldP[0]-1 == newP[0] && oldP[1]+2 == newP[1]) {
        return true;
      } else if (oldP[0]-1 == newP[0] && oldP[1]-2 == newP[1]) {
        return true;
      } else if (oldP[0]-2 == newP[0] && oldP[1]+1 == newP[1]) {
        return true;
      } else if (oldP[0]-2 == newP[0] && oldP[1]-1 == newP[1]) {
        return true;
      }
      return false;
      break;
    default:
      return false;
  }
}

// Additional functions

function checkJumpOver (busyObj, oldPosition, piece, newPosition) {
  return true;
  /*
  // Not really working! Need to be redone!
  switch (piece) {
    case 'B':
      if (busyObj[oldPosition[0]+(Number(oldPosition[1])+1).toString()] == undefined) {
        return true;
      } else if (busyObj[oldPosition[0]+(Number(oldPosition[1])-1).toString()] == undefined) {
        return true;
      } else {
        return false;
      }
      break;
    case 'T':
      for (let i=1; i<limit; i++) {
        if (busyObj[oldPosition[0]+(Number(oldPosition[1])+i).toString()] != undefined) {
          return false;
        } else if (busyObj[oldPosition[0]+(Number(oldPosition[1])-i).toString()] != undefined) {
          return false;
        } else if (busyObj[(Number(colObj[oldPosition[0]])+i).toString()+oldPosition[1]] != undefined) {
          return false;
        } else if (busyObj[(Number(colObj[oldPosition[0]])-i).toString()+oldPosition[1]] != undefined) {
          return false;
        }
      }
      return true;
      break;
    case 'L':
      // not working to check all possibilities arround!
      return true;
      for (let i=1; i<limit; i++) {
        console.log(letterArray[Number(colObj[oldPosition[0]])+i]+(Number(oldPosition[1])+i).toString());
        console.log(busyObj[letterArray[Number(colObj[oldPosition[0]])+i]+(Number(oldPosition[1])+i).toString()]);
        if (busyObj[letterArray[colObj[oldPosition[0]]+i]+(Number(oldPosition[1])+i).toString()] != undefined) {
          console.log('++');
          return false;
        } else if (busyObj[letterArray[colObj[oldPosition[0]]+i]+(Number(oldPosition[1])-i).toString()] != undefined) {
          console.log('+-');
          return false;
        } else if (busyObj[letterArray[colObj[oldPosition[0]]-i]+(Number(oldPosition[1])-i).toString()] != undefined) {
          console.log('--');
          return false;
        } else if (busyObj[letterArray[colObj[oldPosition[0]]-i]+(Number(oldPosition[1])+i).toString()] != undefined) {
          console.log('-+');
          return false;
        }
      }
      return true;
      break;
    default:
      return true;
  }
  */
}

module.exports = checkRules;
