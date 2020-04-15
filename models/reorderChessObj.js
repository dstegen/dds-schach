/*!
 * lib/reorderChessObj.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */


function reorderChessObj (obj, withPlayer) {
  let newObj = {};
  if (withPlayer) {
    Object.keys(obj.weiss).forEach( piece => {
      newObj[obj.weiss[piece]] = [piece, 'weiss'];
    });
    Object.keys(obj.schwarz).forEach( piece => {
      newObj[obj.schwarz[piece]] = [piece, 'schwarz'];
    });
    return newObj;
  } else {
    Object.keys(obj.weiss).forEach( piece => {
      newObj[obj.weiss[piece]] = piece;
    });
    Object.keys(obj.schwarz).forEach( piece => {
      newObj[obj.schwarz[piece]] = piece;
    });
    return newObj;
  }
}

module.exports = reorderChessObj;
