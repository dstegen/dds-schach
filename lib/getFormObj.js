/*!
 * lib/router.js
 * dds-schach (https://github.com/dstegen/dds-schach)
 * Copyright 2020 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/dds-schach/blob/master/LICENSE)
 */
 
const formidable = require('formidable');

function getFormObj (req) {
  let formObj = {};
  let form = new formidable.IncomingForm();
	return new Promise((resolve, reject) => {
		form.parse(req, function (err, fields, files) {
			if (err) {
				reject(err);
			} else {
				formObj.fields = fields;
        formObj.files = files;
				resolve(formObj);
			}
    });
	});
}

module.exports = getFormObj;
