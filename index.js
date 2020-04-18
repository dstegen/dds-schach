/*!
 * index.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */

 'use strict';

 // Required modules
const {ServerDS} = require('webapputils-ds');
const router = require('./lib/router');

// Name the process
process.title = 'DDS-Schach';

const server = new ServerDS('DDS-Schach');
server.setCallback(router);
server.startServer();
