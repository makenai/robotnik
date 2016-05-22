'use strict';

/*
 * Third party vendor modules, split out to speed app building.
 */

window.$ = window.jQuery = require('jquery');

window.PouchDB = require('pouchdb');
window.PouchDB.plugin( require('pouchdb-find') );

window.angular = require('angular');
require('angular-ui-router');
require('angular-bootstrap');
require('angular-pouchdb');

window.jsBeautify = require('js-beautify').js_beautify;

window.socket.on('consoledata', function(data) {
    // we use this to write data back to the console for the user
    // to be able to see.
    if (data.data != undefined) {
        var consolestr = data.data;

        if (consolestr.search("Initialized") >= 0) {
            var title = document.querySelector('h4.modal-title');
            if (title != undefined) {
                title.textContent = "Now running";
            }
        }
        console.log(consolestr);
    }
});
