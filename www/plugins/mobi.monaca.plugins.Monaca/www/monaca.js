cordova.define("mobi.monaca.plugins.Monaca.monaca", function(require, exports, module) {
/**
 * monaca.js is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2014, Asial Corporation
 */

	var monaca = function() {};
	
    monaca.prototype.getDeviceId = function(callback) {
               return cordova.exec(function(result) {
                       callback(result.deviceId);
                       },
                        null, 'Monaca', 'getRuntimeConfiguration', []);
    };
    module.exports = new monaca();
});
