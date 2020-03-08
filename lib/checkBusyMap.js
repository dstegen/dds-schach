/*!
 * lib/checkBusyMap.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */


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

module.exports = checkBusyMap;
