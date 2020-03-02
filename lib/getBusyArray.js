// dd-schach lib/getBusyArray.js

function getBusyArray (sortObj) {
  const colObj = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8};
  let busyArray = [
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
    busyArray[pos[1]][colObj[pos[0]]] = 1;
  });
  busyArray.forEach( row => {
    console.log(row);
  })
  return busyArray;
}

module.exports = getBusyArray;
