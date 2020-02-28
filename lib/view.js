// view.js

function view (obj) {
  let version = '0.0.5'
  let returnObj = {
    statusCode: 200,
    contentType: 'text/html; charset=UTF-8',
    data: ''
  }
  let chkWeiss = '';
  let chkSchwarz = '';
  let formBg = "white";
  let formFg = "black";
  //console.log(obj.player);
  if (obj.player === 'weiss') {
    chkSchwarz = 'checked';
    formBg = "black";
    formFg = "white";
  } else {
    chkWeiss = 'checked';
    formBg = "white";
    formFg = "black";
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
        <h1>DDS-Schach - ${version}</h1>
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
              <form id="control" action="/action" method="get" style="background-color: ${formBg}; color: ${formFg}">
                <input type="radio" name="player" value="weiss" ${chkWeiss} /> weiss <input type="radio" name="player" value="schwarz" ${chkSchwarz} /> schwarz
                <br /><br />
                <input type="text" id="oldPosition" name="oldPosition" maxlength="2" value="" placeholder="alt" required style="width: 30px;" onfocus="stopReload()" />
                <input type="text" id="newPosition" name="newPosition" maxlength="2" value="" placeholder="neu" required style="width: 30px;" onfocus="stopReload()" />
                <input type="submit" value="Senden" class="movebutton" />
              </form>
            </div>
            ${outPieces(obj.weiss_raus, 'weiss')}
          </div>
        </div>
        <div>
          <div id="moves">
            <small>Z&uuml;ge:<br />
              ${obj.moves.map( item => { return item; }).join('<br />')}
            </small>
          </div>
          <form action="/reset" method="get">
            <input type="submit" value="Neu starten" />
          </form>
        </div>
        <script src="/node_modules/jquery/dist/jquery.min.js"></script>
        <script src="/node_modules/jquery-ui-dist/jquery-ui.min.js"></script>
        <script src="/public/schach.js"></script>
        <script>
          var timeout = setTimeout(reloadBoard, 10000);
					function reloadBoard () {
						//$("#chessboard").load(location.href + " #chessboard");
            location.reload();
						timeout = setTimeout(reloadBoard, 10000);
					}
          function stopReload () {
            clearTimeout(timeout)
            timeout = 0;
            //console.log('stopped')
          }
          /*
          // jQuery-ui sortable
          $( function() {
            $(".sortable").sortable({
              placeholder: "sortable-placeholder",
              update: function( event, ui ) {}
            });
            $(".sortable").sortable( "option", "placeholder", "sortable-placeholder" );
          } );
          $(".sortable").on("sortupdate", function(event, ui) {
            console.log(event);
          });
          */
				</script>
      </body>
    </html>
  `;
  return returnObj;
}


// Additional functions

function row (obj, bgcolor, localRow) {
  const newObj = sortObj(obj);
  let color = 'black';
  if (bgcolor === 'gray') color = 'white';
  let colArray = ['a','b','c','d','e','f','g','h'];
  let returnHTML = '<ul>';
  for (let i=0; i<8; i++) {
    let img = ``;
    if (newObj[colArray[i]+localRow] != undefined) {
      img = `<img src="media/${newObj[colArray[i]+localRow][1]}/${newObj[colArray[i]+localRow][0][0]}.png" width="50" height="50" />`;
    }
    returnHTML += `
      <li id="${colArray[i]}${localRow}" style="background-color: ${bgcolor};">
        <small style="color: ${color}; margin: 5px;">${colArray[i]}${localRow}</small>
        <div align="center" class="sortable" onclick="setOldPosition('${colArray[i]}${localRow}')" style="width: 80px; height: 50px;">
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
  //console.log(newObj);
  return newObj;
}

module.exports = view;
