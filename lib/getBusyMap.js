// dd-schach lib/getBusyMap.js

function getBusyMap (sortObj) {
  const colObj = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
  let busyMap = [
    [],
    [1,0,0,0,0,0,0,0,0],
    [2,0,0,0,0,0,0,0,0],
    [3,0,0,0,0,0,0,0,0],
    [4,0,0,0,0,0,0,0,0],
    [5,0,0,0,0,0,0,0,0],
    [6,0,0,0,0,0,0,0,0],
    [7,0,0,0,0,0,0,0,0],
    [8,0,0,0,0,0,0,0,0],
  ];
  Object.keys(sortObj).forEach( pos => {
    busyMap[pos[1]][colObj[pos[0]]] = 1;
  });
  for (let i=8; i>0; i--) {
    console.log(busyMap[i]);
  }
  return busyMap;
}

module.exports = getBusyMap;
