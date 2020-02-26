// view.js

function view (obj) {
  let returnObj = {
    statusCode: 200,
    contentType: 'text/html; charset=UTF-8',
    data: ''
  }
  let chkWeiss = '';
  let chkSchwarz = '';
  //console.log(obj.player);
  if (obj.player === 'weiss') {
    chkSchwarz = 'checked';
  } else {
    chkWeiss = 'checked';
  }
  returnObj.data = `
    <!DOCTYPE HTML>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>DDS-Schach-Server</title>
      </head>
      <body>
        <h1>DDS-Schach</h1>
        <div id="chessboard" style="height: 100vH;">
          <table border="1" style="float: left; margin-right: 20px">
            ${row(obj, 'white', 8)}
            ${row(obj, 'gray', 7)}
            ${row(obj, 'white', 6)}
            ${row(obj, 'gray', 5)}
            ${row(obj, 'white', 4)}
            ${row(obj, 'gray', 3)}
            ${row(obj, 'white', 2)}
            ${row(obj, 'gray', 1)}
          </table>
          ${outPieces(obj.schwarz_raus, 'schwarz')}
          <div style=" height: 472px; padding: 20px 0;">
            <form action="/action" method="get">
              <input type="radio" name="player" value="weiss" ${chkWeiss} /> weiss <input type="radio" name="player" value="schwarz" ${chkSchwarz} /> schwarz
              <br /><br />
              <input type="text" id="oldPosition" name="oldPosition" maxlength="2" value="" placeholder="alt" required style="width: 20px;" onfocus="stopReload()" />
              <input type="text" id="newPosition" name="newPosition" maxlength="2" value="" placeholder="neu" required style="width: 20px;" onfocus="stopReload()" />
              <input type="submit" value="Submit" style="margin-left: 10px;" />
            </form>
          </div>
          ${outPieces(obj.weiss_raus, 'weiss')}
        </div>
        <div style="width: 100%">
          <form action="/reset" method="get">
            <input type="submit" value="Reset" style="margin-left: 10px;">
          </form>
        </div>
        <script src="/node_modules/jquery/dist/jquery.min.js"></script>
        <script src="/node_modules/jquery-ui-dist/jquery-ui.min.js"></script>
        <script src="/public/schach.js"></script>
        <script>
          var timeout = setTimeout(reloadBoard, 5000);
					function reloadBoard () {
						//$("#chessboard").load(location.href + " #chessboard");
            location.reload();
						timeout = setTimeout(reloadBoard, 5000);
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
  let returnHTML = '<tr>';
  for (let i=0; i<8; i++) {
    let img = ``;
    if (newObj[colArray[i]+localRow] != undefined) {
      img = `<img src="media/${newObj[colArray[i]+localRow][1]}/${newObj[colArray[i]+localRow][0][0]}.png" width="50" height="50" style="margin: 0 auto;" />`;
    }
    returnHTML += `
      <td class="placeholder" style="background-color: ${bgcolor}; width: 80px; height: 80px;">
        <small style="color: ${color}">${colArray[i]}${localRow}</small>
        <div align="center" class="sortable" onclick="setOldPosition('${colArray[i]}${localRow}')" style="width: 80px; height: 50px;">
          ${img}
        </div>
      </td>
    `;
    if (bgcolor === 'gray') {
      bgcolor = 'white';
      color = 'black';
    } else  {
      bgcolor = 'gray';
      color = 'white';
    }
  }
  returnHTML += '</tr>';
  return returnHTML;
}

function outPieces (itemsArray, path) {
  let returnHTML = '';
  if (itemsArray.length > 0) {
    returnHTML += `<table border="1">`;
    itemsArray.forEach( item => {
      returnHTML += `
        <td style="width: 80px; height: 80px;">
          <div align="center">
            <img src="media/${path}/${item[0]}.png" width="50" height="50" style="margin: 0 auto;" />
          </div>
        </td>
      `;
    });
    returnHTML += `</table>`;
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
