/*!
 * lib/viewLogin.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */

function viewLogin (obj) {
  return `
    <!DOCTYPE HTML>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>DDS-Schach-Server</title>
        <link rel="stylesheet" href="/public/schach-styles.css">
      </head>
      <body>
        <h1>DDS-Schach - Login</h1>
        <form id="login" action="/login" method="get">
          <input type="text" id="playername" name="playername" placeholder="Name" value="" required/>
          <input type="password" id="playerpasswd" name="playerpasswd" placeholder="Passwort" value="" required/>
          <input type="submit" value="Einloggen" />
        </from>
      </body>
    </html>
  `;
}

module.exports = viewLogin;
