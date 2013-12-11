/**
 * Wraps and exports a logger
 *
 * @since: 5/16/2013 
 *
 * @author: rpitchai@qti.qualcomm.com  
 *
 * Copyright (c) 2013 Qualcomm, Inc. All rights reserved.
 * Qualcomm, Inc. Proprietary and Confidential.
 */

var winston = require('winston');
var moment = require('moment');

// Logging levels
var levels = {
  trace : 0,
  debug : 1,
  info : 2,
  warn : 3,
  error : 4,
  fatal : 5
};
var colors = {
  trace : 'magenta',
  debug : 'cyan',
  info : 'green',
  warn : 'grey',
  error : 'yellow',
  fatal : 'red'
};

var transports = [];

transports.push(new (winston.transports.File)({
  level : 'trace',
  colorize : true,
  timestamp : ts,
  filename : 'logs/bingo.log',
  maxsize : 10485760, // 10mb
  maxFiles : 10,
  json : false
}));

transports.push(new (winston.transports.Console)({
  level : 'debug',
  colorize : true,
  timestamp : ts
}));

function ts() {
  return moment().format("YYYY-MM-DD HH:mm:ss,SSS");
}

module.exports = new (winston.Logger)({
  transports : transports,
  levels : levels,
  colors : colors
});
