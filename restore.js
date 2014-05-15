'use strict';

var delay      = require('deferred').delay
  , resolveLog = require('./lib/resolve-log')

  , unserialize;

unserialize = function (db, events, sourceId) {
	db._postponed_ += 1;
	events.forEach(function (data) { db.unserializeEvent(data, sourceId); });
	db._postponed_ -= 1;
};

module.exports = function (db, logPath/*, options*/) {
	var options = Object(arguments[2]), sourceId = options.sourceId
	  , interval = options.interval;
	if (isNaN(interval)) interval = 100;
	return resolveLog(logPath, options)(function (data) {
		var load;
		// Load snapshot
		unserialize(db, data.snapshot, sourceId);

		// Load log
		if (!data.log[0]) return;
		load = delay(function () {
			unserialize(db, data.log.shift(), sourceId);
			if (data.log[0]) return load();
		}, interval);
		return load();
	});
};
