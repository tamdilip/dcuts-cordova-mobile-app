cordova.define("mobi.monaca.plugins.Share.Share", function(require, exports, module) {

var Share = function() {};
            
Share.prototype.show = function(content, success, fail) {
    return cordova.exec( function(args) {
        success(args);
    }, function(args) {
        fail(args);
    }, 'Share', '', [content]);
};
    
module.exports = new Share();
});
