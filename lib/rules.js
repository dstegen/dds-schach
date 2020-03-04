// rules.js

const colObj = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};

function checkRules (piece, oldPosition, newPosition, currentPlayer, capture) {
  let oldP = [colObj[oldPosition[0]], Number(oldPosition[1])];
  let newP = [colObj[newPosition[0]], Number(newPosition[1])];
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
      } else if (oldP[1] === 2 && (oldP[0] == newP[0] && oldP[1]+2 == newP[1]) && currentPlayer === 'weiss') {
        return true;
      } else if (oldP[0] == newP[0] && oldP[1]-1 == newP[1] && currentPlayer === 'schwarz') {
        return true;
      } else if (oldP[1] === 7 && (oldP[0] == newP[0] && oldP[1]-2 == newP[1]) && currentPlayer === 'schwarz') {
        return true;
      } else{
        return false;
      }
    case 'T':
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
      return false;
    case 'L':
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
    default:
      return false;
  }
}


module.exports = checkRules;
