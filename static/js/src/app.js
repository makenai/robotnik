'use strict';

import angular from 'angular';
import angularResource from 'angular-resource';
import angularBootstrap from 'angular-bootstrap';

import directives from './directives/directives.js';
import services from './services/services.js';
import models from './models/models.js';

let app = angular.module('robotnik', ['ngResource', 'ui.bootstrap']);

directives.forEach(d => app.directive(d.name, d.directive));
services.forEach(s => app.factory(s.name, s.service));
models.forEach(m => app.factory(m.name, m.model));


export default app;

