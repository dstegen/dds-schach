// dds-schach lib/router.js

const deliver = require('./router-deliver');
const model = require('./model');
const view = require('./view');


function router (request, obj) {
  let fields = {};
  let sendObj = {
    statusCode: 200,
    contentType: 'text/html; charset=UTF-8',
    cookie: [],
    location: '/',
    data: ''
  };
	if (request.url.includes('action')) {
		console.log('MOVE');
		request.url.split('?')[1].split('&').forEach( item => {
			fields[item.split('=')[0]] = item.split('=')[1];
		});
		console.log(fields);
		obj = model.updateModel(fields, obj);
    sendObj.statusCode = 302;
	} else if (request.url.includes('reset')) {
		obj = model.initModel();
		sendObj.statusCode = 302;
	} else if (request.url.includes('revoke')) {
		console.log('REVOKE');
		obj = model.revokeLastMove(obj);
		sendObj.statusCode = 302;
	}	else if (request.url.includes('media') || request.url.includes('node_modules') || request.url.includes('public')) {
		sendObj = deliver(request);
	} else {
    sendObj = view(obj);
  }
  return sendObj;
}


module.exports = router;
