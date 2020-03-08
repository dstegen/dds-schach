/*!
 * public/schachscripts.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */


 if (Cookies.get('dds-player') == undefined) {
   $('.controls').hide();
 } else if (Cookies.get('dds-player') !== currentPlayer) {
   $('#control').hide();
 } else if (Cookies.get('dds-player') === currentPlayer) {
   $('#control').show();
 }


function setPosition (item) {
  if ($('#oldPosition').val()) {
    $('#newPosition').val(item);
  } else {
    $('#oldPosition').val(item);
  }
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
  if (event.target.className.split(' ')[0] === currentPlayer && Cookies.get('dds-player') === currentPlayer) {
    oldP = event.target.id;
    console.log('oldPosition: '+event.target.id);
  } else {
    location.reload();
  }
});

$(".sortable").on("sortreceive", function(event, ui) {
  if (oldP !== '') {
    socket.send('move');
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
      }
    });
    $("control").trigger("reset");;
  }
});
