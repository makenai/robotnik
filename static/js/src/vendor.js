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

