'use strict';

// This is the existing Robotnik code.  Eventually, everything inside it
// will get refactored into Angular structure and this will go away.
import robotnik from './robotnik.js';
robotnik.init();

import directives from './directives/directives.js';
import services from './services/services.js';

let app = angular.module('robotnik', []);

directives.forEach(d => app.directive(d.name, d.directive));
services.forEach(s => app.factory(s.name, s.service));

export default app;

