'use strict';

import _ from 'lodash';

import components from './components/components.js';
import services from './services/services.js';
import models from './models/models.js';

import routes from './routes';

let app = angular.module('robotnik', ['pouchdb', 'ui.router', 'ui.bootstrap']);

_.forIn(components, (value, name) => app.directive(name, value));
_.forIn(services, (value, name) => app.factory(name, value));
_.forIn(models, (value, name) => app.factory(name, value));

app.config(routes);

export default app;
