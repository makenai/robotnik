'use strict';

// Load up jquery globally first to avoid weird errors like
// "TypeError: Cannot read property 'env' of undefined
import jQuery from '../../vendor/jquery/dist/jquery.js';
window.$ = window.jQuery = jQuery;

import angular from 'angular';
import angularBootstrap from 'angular-bootstrap';

import directives from './directives/directives.js';
import services from './services/services.js';

let app = angular.module('robotnik', ['ui.bootstrap']);

directives.forEach(d => app.directive(d.name, d.directive));
services.forEach(s => app.factory(s.name, s.service));

export default app;
