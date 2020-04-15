/*!
 * lib/router.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */

'use strict';

// Required modules
const {deliver} = require('webapputils-ds');
const {webView, login, logout, updateAction, resetAction, revokeAction} = require('./controller');


function router (request, response, wss, wsport) {
  let route = request.url.substr(1).split('?')[0];
  if (request.url.includes('media') || request.url.includes('node_modules') || request.url.includes('public') || request.url.includes('favicon')) route = 'static';
  switch (route) {
   case 'static':
     deliver(request, response);
     break;
   case 'login':
     login(request, response, wss);
     break;
   case 'logout':
     logout(request, response, wss);
     break;
   case 'action':
     updateAction(request, response, wss);
     break;
   case 'reset':
     resetAction(request, response, wss);
     break;
   case 'revoke':
     revokeAction(request, response, wss);
     break;
   default:
     webView(request, response, wss, wsport)
  }
}

module.exports = router;
