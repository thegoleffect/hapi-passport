var HapiPassport = function () {

    this.Hapi = require('hapi');
    this.plugin = {
        authenticate: require('./passport/authenticate'),
        initialize: require('./passport/initialize')
    };
    
    return this;
};


HapiPassport.prototype.enable = function (options) {

    // TODO: convenience wrapper for boilerplate setup code
};


exports = module.exports = new HapiPassport();
exports.HapiPassport = HapiPassport;