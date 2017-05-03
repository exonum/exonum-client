'use strict';

const objectAssign = Object.assign || require('object-assign');

module.exports = objectAssign({},
  require('./integers'),
  require('./string'),
  require('./bool'),
  require('./buffer'),
  require('./sequence'),
  require('./utils'));
