/*!
 * lib/view.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */


function view (obj, wsport) {
  let version = '0.1.4'
  let returnObj = {
    statusCode: 200,
    contentType: 'text/html; charset=UTF-8',
    cookie: [],
    location: '/',
    data: ''
  }
  let chkWeiss = '';
  let chkSchwarz = '';
  let formBg = "white";
  let formFg = "black";
  let currentPlayer = "weiss";
  if (obj.player === 'weiss') {
    chkSchwarz = 'checked';
    formBg = "black";
    formFg = "white";
    currentPlayer = "schwarz";
  } else {
    chkWeiss = 'checked';
    formBg = "white";
    formFg = "black";
    currentPlayer = "weiss";
  }
  returnObj.data = `
    <!DOCTYPE HTML>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>DDS-Schach-Server</title>
        <link rel="stylesheet" href="/public/schach-styles.css">
      </head>
      <body>
        <h1>DDS-Schach (${version}): ${obj.players.weiss} vs ${obj.players.schwarz}</h1>
        <div id="chessboard">
          <div id="leftside">
            ${row(obj, 'white', 8)}
            ${row(obj, 'gray', 7)}
            ${row(obj, 'white', 6)}
            ${row(obj, 'gray', 5)}
            ${row(obj, 'white', 4)}
            ${row(obj, 'gray', 3)}
            ${row(obj, 'white', 2)}
            ${row(obj, 'gray', 1)}
          </div>
          <div id="rightside">
            ${outPieces(obj.schwarz_raus, 'schwarz')}
            <div>
              <form id="control" class="controls" action="/action" method="get" style="background-color: ${formBg}; color: ${formFg}">
                <input type="radio" name="player" value="weiss" ${chkWeiss} /> ${obj.players.weiss} (weiss) <input type="radio" name="player" value="schwarz" ${chkSchwarz} /> ${obj.players.schwarz} (schwarz)
                <br /><br />
                <input type="text" id="oldPosition" name="oldPosition" maxlength="2" value="" placeholder="alt" required style="width: 30px;" />
                <input type="text" id="newPosition" name="newPosition" maxlength="2" value="" placeholder="neu" required style="width: 30px;" />
                <input type="submit" value="Fertig" class="movebutton" />
              </form>
              ${displayMsg(obj.lastMoveOk)}
            </div>
            ${outPieces(obj.weiss_raus, 'weiss')}
          </div>
        </div>
        <div>
          <div id="moves">
            <small>Z&uuml;ge:<br />
              ${obj.moves.map( item => { return item; }).join('<br />')}
              <br />
            </small>
          </div>
          <form action="/revoke" class="controls" method="get">
            <input type="submit" value="Letzten Zug löschen" />
          </form>
          <br />
          <form action="/reset" class="controls" method="get">
            <input type="submit" value="Neu starten" />
          </form>
        </div>
        <script src="/node_modules/jquery/dist/jquery.min.js"></script>
        <script src="/node_modules/jquery-ui-dist/jquery-ui.min.js"></script>
        <script src="public/cookie.js"></script>
        <script>
          const currentPlayer = "${currentPlayer}";
          const lastMoveOk = "${obj.lastMoveOk}";
          // Websockets
          const hostname = window.location.hostname ;
          const socket = new WebSocket('ws://'+hostname+':${wsport}/', 'protocolOne', { perMessageDeflate: false });
          socket.onmessage = function (msg) {
            location.reload();
            console.log(msg.data);
          };
				</script>
        <script src="/public/schachscripts.js"></script>
      </body>
    </html>
  `;
  return returnObj;
}


// Additional functions

function row (obj, bgcolor, localRow) {
  const newObj = sortObj(obj);
  let pieceColor = '';
  let color = 'black';
  if (bgcolor === 'gray') color = 'white';
  let colArray = ['a','b','c','d','e','f','g','h'];
  let returnHTML = '<ul id="row'+localRow+'">';
  for (let i=0; i<8; i++) {
    let img = ``;
    if (newObj[colArray[i]+localRow] != undefined) {
      pieceColor = newObj[colArray[i]+localRow][1];
      img = `<img id="${colArray[i]}${localRow}_img" src="media/${pieceColor}/${newObj[colArray[i]+localRow][0][0]}.png" width="50" height="50" />`;
    } else {
      pieceColor = '';
    }
    returnHTML += `
      <li style="background-color: ${bgcolor};">
        <small style="color: ${color}; margin: 5px;">${colArray[i]}${localRow}</small>
        <div id="${colArray[i]}${localRow}" align="center" class="${pieceColor} sortable" onclick="setPosition('${colArray[i]}${localRow}')" style="width: 80px; height: 50px;">
          ${img}
        </div>
      </li>
    `;
    if (bgcolor === 'gray') {
      bgcolor = 'white';
      color = 'black';
    } else  {
      bgcolor = 'gray';
      color = 'white';
    }
  }
  returnHTML += '</ul>';
  return returnHTML;
}

function outPieces (itemsArray, path) {
  let returnHTML = '';
  if (itemsArray.length > 0) {
    returnHTML += `<ul>`;
    itemsArray.forEach( item => {
      returnHTML += `
        <li>
          <div align="center" style="padding-top: 15px;">
            <img src="media/${path}/${item[0]}.png" width="50" height="50"" />
          </div>
        </li>
      `;
    });
    returnHTML += `</ul>`;
    return returnHTML;
  } else {
    return '';
  }
}

function sortObj (obj) {
  let newObj = {};
  Object.keys(obj.weiss).forEach( piece => {
    newObj[obj.weiss[piece]] = [piece, 'weiss'];
  });
  Object.keys(obj.schwarz).forEach( piece => {
    newObj[obj.schwarz[piece]] = [piece, 'schwarz'];
  });
  return newObj;
}

function displayMsg (lastMoveOk) {
  if (!lastMoveOk) {
    return `
      <div id="msg" style="border: 1px solid red; font-weight: bold; padding: 10px; margin-top: 20px; color: red; height: 16px;">
        Falscher Zug! Nochmal!
      </div>
    `;
  } else {
    return '';
  }
}


module.exports = view;
