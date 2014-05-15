'use strict';

var database      = require('dbjs/valid-dbjs')
  , resolve       = require('path').resolve
  , writeSnapshot = require('./lib/write-snapshot')
  , writeLog      = require('./lib/write-log');

module.exports = function (db, logPath) {
	var dateString = (new Date()).toISOString();
	database(db);
	logPath = resolve(String(logPath));
	return writeSnapshot(db, resolve(logPath, dateString + '-init.db.snapshot'))(function () {
		return writeLog(db, resolve(logPath, dateString + '.db.log'));
	});
};
