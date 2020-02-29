// DDS-Schach frontend JavaScript

function setPosition (item) {
  stopReload();
  if ($('#oldPosition').val()) {
    $('#newPosition').val(item);
  } else {
    $('#oldPosition').val(item);
  }
}

var timeout = setTimeout(reloadBoard, 5000);
function reloadBoard () {
  //$("#chessboard").load(location.href + " #chessboard");
  $("#control").trigger("reset");
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
  if (event.target.className.split(' ')[0] === currentPlayer) {
    oldP = event.target.id;
    console.log('oldPosition: '+event.target.id);
  } else {
    location.reload();
  }
});

$(".sortable").on("sortreceive", function(event, ui) {
  if (oldP !== '') {
    newP = event.target.id;
    console.log('newPosition: '+event.target.id);
    $(':input[type="submit"]').prop('disabled', true);
    $.ajax({
      url: '/action', // url where to submit the request
      type : "GET", // type of action POST || GET
      dataType : 'json', // data type
      data : {"player": currentPlayer, "oldPosition": oldP, "newPosition": newP}, // post data || get data
        success : function(result) {
        // you can see the result from the console
        // tab of the developer tools
        console.log(result);
        location.reload();
      }
    });
    $("control").trigger("reset");
    timeout = setTimeout(reloadBoard, 10);
  }
});
