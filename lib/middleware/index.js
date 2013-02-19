module.exports = function (options) {

    this.options = options || {};
    this.authenticate = require('./authenticate')(options);
    this.initialize = require('./initialize')(options);
};