var util = require('util');
var augmentRequest = require('./request');

module.exports = function initialize() {

    return function initialize(request, next) {

        var passport = this;
        request._passport = {};
        request._passport.instance = passport;

        // console.log('!! session: ' + util.inspect(request.session));
        
        if (request.session && request.session[passport._key]) {
            // load data from existing session
            request._passport.session = request.session[passport._key];
        } else if (request.session) {
            // initialize new session
            request.session[passport._key] = {};
            request._passport.session = request.session[passport._key];
        } else {
            // no session is available
            request._passport.session = {};
        }
        
        augmentRequest(request, next);
    }
};