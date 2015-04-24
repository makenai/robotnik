'use strict';

import _ from 'lodash';
import angular from 'angular';
import angularResource from 'angular-resource';
import angularRouter from 'angular-ui-router';
import angularBootstrap from 'angular-bootstrap';

import directives from './directives/directives.js';
import services from './services/services.js';
import models from './models/models.js';

import routes from './routes';

let app = angular.module('robotnik', ['ngResource', 'ui.router', 'ui.bootstrap']);

_.forIn(directives, (value, name) => app.directive(name, value));
_.forIn(services, (value, name) => app.factory(name, value));
_.forIn(models, (value, name) => app.factory(name, value));

app.config(routes);

export default app;

