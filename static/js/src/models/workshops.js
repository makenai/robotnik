'use strict';

function Workshops($resource) {
  return $resource('/api/workshops/:id');
}

export default Workshops;