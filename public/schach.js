// DDS-Schach frontend JavaScript

function setPosition (item) {
  stopReload();
  if ($('#oldPosition').val()) {
    $('#newPosition').val(item);
  } else {
    $('#oldPosition').val(item);
  }
  //console.log(item);
}

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


// jQuery-ui sortable
$( function() {
  $(".sortable").sortable({
    update: function( event, ui ) {}
  });
  $(".sortable").sortable( "option", "connectWith", ".sortable" );
} );
let oldP = '';
let newP = '';
$(".sortable").on("sortstart", function(event, ui) {
  oldP = event.target.id;
  console.log('oldPosition: '+event.target.id);
});
$(".sortable").on("sortreceive", function(event, ui) {
    newP = event.target.id;
    console.log('newPosition: '+event.target.id);
    $.ajax({
                url: '/action', // url where to submit the request
                type : "GET", // type of action POST || GET
                dataType : 'json', // data type
                data : {"player": currentPlayer, "oldPosition": oldP, "newPosition": newP}, // post data || get data
                success : function(result) {
                    // you can see the result from the console
                    // tab of the developer tools
                    console.log(result);
                }
          });
          timeout = setTimeout(reloadBoard, 1);
});
