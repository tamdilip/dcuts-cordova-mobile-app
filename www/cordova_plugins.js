cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/mobi.monaca.plugins.Monaca/www/monaca.js",
        "id": "mobi.monaca.plugins.Monaca.monaca"
    },
    {
        "file": "plugins/mobi.monaca.plugins.Share/www/share.js",
        "id": "mobi.monaca.plugins.Share.Share",
        "clobbers": [
            "plugins.share"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
        "id": "cordova-plugin-inappbrowser.inappbrowser",
        "clobbers": [
            "cordova.InAppBrowser.open",
            "window.open"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.2",
    "mobi.monaca.plugins.Monaca": "3.1.0",
    "mobi.monaca.plugins.Share": "1.0.0",
    "cordova-plugin-splashscreen": "3.2.2",
    "cordova-custom-config": "2.0.3",
    "cordova-plugin-inappbrowser": "1.5.0"
};
// BOTTOM OF METADATA
});