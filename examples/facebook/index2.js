var Hapi = require('hapi');
var HapiSession = require('hapi-session');
var HapiPassport = require('../../');
var Config = require('./config.json');

var passport = require('passport-debug');
var FacebookStrategy = require('passport-facebook').Strategy

var options = {
    session: {
        permissions: {
            ext: true
        },
        plugin: {
            name: 'session',
            isSingleUse: false,
            options: {
                password: 'worldofwalmart'
            }
        }
    }
};
var server = new Hapi.Server('localhost', 8000, options);
server.plugin().register(HapiSession, options.session, function (err) {

    if (err) throw err;
});


passport._plugin = HapiPassport.plugin;
passport.use(new FacebookStrategy({
    clientID: Config.clientID,
    clientSecret: Config.clientSecret,
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

server.ext('onPreHandler', [
    passport.initialize(),
    passport.session()
]);

server.addRoute({
    method: 'GET',
    path: '/auth/facebook',
    config: {
        handler: passport.authenticate('facebook')
    }
});

server.addRoute({
    method: 'GET',
    path: '/auth/facebook/callback',
    config: {
        handler: function (request) {

            passport.authenticate('facebook')(request, function () {

                // request.reply("<pre>authenticated with request.session = " + JSON.stringify(request.session, null, 2) + "</pre>");
                request.session = request._passport.session;
                console.log('request.session', request.session)
                request.reply.redirect('/get').send();
            })
        }
    }
});

server.addRoute({
    method: 'GET',
    path: '/login',
    config: {
        handler: function (request) {

            request.reply('<a href="/auth/facebook">Login with Facebook</a>')
        }
    }
});

server.addRoute({
    method: 'GET',
    path: '/clear',
    config: {
        handler: function (request) {

            request.session = null;
            request.reply.redirect('/get').send();
        }
    }
});

server.addRoute({
    method: 'GET',
    path: '/get',
    config: {
        handler: function (request) {

            request.reply(request.session);
        }
    }
});


server.start(function(){
    console.log('server started on port 8000')
});