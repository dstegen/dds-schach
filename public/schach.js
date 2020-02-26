// DDS-Schach frontend JavaScript
function setOldPosition (item) {
  stopReload();
  if ($('#oldPosition').val()) {
    $('#newPosition').val(item);
  } else {
    $('#oldPosition').val(item);
  }
  //console.log(item);
}
