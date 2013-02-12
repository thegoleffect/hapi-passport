var passport = require('passport-debug');
var Hapi = require('hapi');
var util = require('util');
var FacebookStrategy = require('passport-facebook').Strategy

var server = new Hapi.Server('localhost', 8000);


/* Config.json in format of:

{
    "clientID": "xxxxxxxxxx",
    "clientSecret": "xxxxxxxxxxx"
}
*/
var config = require('./config.json');
passport._plugin = require('../../lib/').plugin;

passport.use(new FacebookStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: "http://localhost:8000/auth/facebook/callback"
}, function (accessToken, refreshToken, profile, done) {
    // console.log('accessToken', accessToken)
    return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


server.ext('onRequest', [
    passport.initialize(),
    passport.session()
]);

var ensureAuthenticated = function (request, next) {

    console.log('isAuthenticated', request.isAuthenticated())
    if (request.isAuthenticated()) {
        return next();
    }
    request.reply.redirect('/login').send();
};


// Handlers
var authFB = {
    handler: passport.authenticate('facebook')
};
var authFBCB = {
    handler: function (request) {

        passport.authenticate('facebook')(request, function () {

            // console.log('request._passport', request._passport)
            // console.log(util.inspect(request), null, 2)
            request.reply("authenticated with request.user = ", request.user);
        })
    }
};
server.addRoute({
    method: 'GET',
    path: '/auth/facebook',
    config: authFB
});
server.addRoute({
    method: 'GET',
    path: '/auth/facebook/callback',
    config: authFBCB
});
server.addRoute({
    method: 'GET',
    path: '/login',
    config: {
        handler: function (request) {

            request.reply('<a href="/auth/facebook">Login with Facebook</a>')
        }
    }
})

server.addRoute({
    method: 'GET',
    path: '/admin',
    config: {
        handler: function (request) {

            // console.log('request.user about to auth:', request.user)
            ensureAuthenticated(request, function () {

                request.reply("Access Granted");
            });
        }
    }
});

server.start(function(){
    console.log('server started')
});
