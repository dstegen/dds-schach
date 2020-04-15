/*!
 * views/view.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */

// Required modules
const {SendObj} = require('webapputils-ds');


function view (obj, wsport, playerNames) {
  let version = '0.2.0'
  let sendObj = new SendObj();
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
  sendObj.data = `
    <!DOCTYPE HTML>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <!-- Bootstrap, jquery and CSS -->
        <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="/public/schach-styles.css">
        <title>DDS-Schach-Server</title>
      </head>
      <body>
        <main class="container py-3">
          <h1>DDS-Schach (${version}): ${playerNames.weiss} vs ${playerNames.schwarz}</h1>
          <div id="chessboard">
            <div id="leftside">
              ${row(obj, '#F0D9B5', 8)}
              ${row(obj, '#B58863', 7)}
              ${row(obj, '#F0D9B5', 6)}
              ${row(obj, '#B58863', 5)}
              ${row(obj, '#F0D9B5', 4)}
              ${row(obj, '#B58863', 3)}
              ${row(obj, '#F0D9B5', 2)}
              ${row(obj, '#B58863', 1)}
            </div>
            <div id="rightside">
              ${outPieces(obj.schwarz_raus, 'schwarz')}
              <div>
                <form id="control" class="controls" action="/action" method="post" style="background-color: ${formBg}; color: ${formFg}">
                  <input type="radio" name="player" value="weiss" ${chkWeiss} /> ${playerNames.weiss} (weiss) <input type="radio" name="player" value="schwarz" ${chkSchwarz} /> ${playerNames.schwarz} (schwarz)
                  <br /><br />
                  <input type="text" id="oldPosition" name="oldPosition" maxlength="4" value="" placeholder="alt" required style="width: 3rem;" />
                  <input type="text" id="newPosition" name="newPosition" maxlength="4" value="" placeholder="neu" required style="width: 3rem;" />
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
            <br />
            <form action="/logout" class="controls" method="get">
              <input type="submit" value="Logout" />
            </form>
          </div>
        </main>
        <!-- jQuery first, then Popper.js, then Bootstrap JS -->
        <script src="/node_modules/jquery/dist/jquery.min.js"></script>
        <script src="/node_modules/jquery-ui-dist/jquery-ui.min.js"></script>
        <script src="/node_modules/popper.js/dist/umd/popper.min.js"></script>
        <script src="/node_modules/bootstrap/dist/js/bootstrap.min.js"></script>
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
  return sendObj;
}


// Additional functions

function row (obj, bgcolor, localRow) {
  const newObj = sortObj(obj);
  let pieceColor = '';
  let color = '#B58863';
  if (bgcolor === '#B58863') color = '#F0D9B5';
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
    if (bgcolor === '#B58863') {
      bgcolor = '#F0D9B5';
      color = '#B58863';
    } else  {
      bgcolor = '#B58863';
      color = '#F0D9B5';
    }
  }
  returnHTML += '</ul>';
  return returnHTML;
}

function outPieces (itemsArray, path) {
  let returnHTML = '';
  if (itemsArray.length > 0) {
    returnHTML += `<ul class="border">`;
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
