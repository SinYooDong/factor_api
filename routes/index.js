'use strict';
var routeHelper = require('../util/routeHelper');
module.exports = function (server) {

    routeHelper.route(server, __dirname);
};