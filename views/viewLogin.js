/*!
 * views/viewLogin.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */

// Required Modules
const {SendObj} = require('webapputils-ds');

function viewLogin () {
  let sendObj = new SendObj();
  sendObj.data = `
  <!DOCTYPE HTML>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <!-- Bootstrap, jquery and CSS -->
      <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
      <link rel="stylesheet" href="/public/schach-styles.css">
      <title>DDS-Schach Login</title>
    </head>
    <body>
      <div class="container p-5">
        <h1>DDS-Schach Login</h1>
        <form id="login" action="/login" method="post">
          <input type="text" class="mb-3" id="username" name="username" placeholder="Name" value="" required/>
          <input type="password" class="mb-3" id="password" name="password" placeholder="Passwort" value="" required/>
          <input type="submit" class="btn-sm btn-primary" value="Einloggen" />
        </from>
      </div>
      <!-- jQuery first, then Popper.js, then Bootstrap JS -->
      <script src="/node_modules/jquery/dist/jquery.min.js"></script>
      <script src="/node_modules/jquery-ui-dist/jquery-ui.min.js"></script>
      <script src="/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
      <script src="public/cookie.js"></script>
    </body>
  </html>
  `;
  return sendObj;
}

module.exports = viewLogin;
