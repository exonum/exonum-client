'use strict';

const objectAssign = Object.assign || require('object-assign');

module.exports = objectAssign({},
  require('./integers'),
  require('./string'),
  require('./buffer'),
  require('./sequence'),
  require('./utils'));
