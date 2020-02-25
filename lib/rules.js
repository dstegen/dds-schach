// rules.js

function checkRules (piece, oldPosition, newPosition) {
  let colObj = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
  let oldP = [colObj[oldPosition[0]], oldPosition[1]];
  let newP = [colObj[newPosition[0]], newPosition[1]];
  switch (piece[0]) {
    case 'K':
      if (oldP[0]+1 == newP[0] && oldP[1]+1 == newP[1]) {
        return true;
      } else if (oldP[0]+1 == newP[0] && oldP[1] == newP[1]) {
        return true;
      } else {
        return false;
      }
      break;
    case 'D':

      break;
    default:
      return false;
  }
}
