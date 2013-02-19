var passport = require('passport-debug');
var Hapi = require('hapi');
var util = require('util');
var FacebookStrategy = require('passport-facebook').Strategy
var HapiPassport = require('../..');

var server = new Hapi.Server('localhost', 8000);

// enable session cookie jar

var hapiPassport = new HapiPassport(server, {
    password: 'worldofwalmart'
});

server.addRoute({
    method: 'GET',
    path: '/get',
    config: {
        handler: function (request) {

            console.log(request.state)
            request.reply({'session': request.session});
        }
    }
});

server.addRoute({
    method: 'GET',
    path: '/set',
    config: {
        handler: function (request) {

            request.session.ts = new Date();
            request.reply.redirect('/get').send();
        }
    }
});

server.addRoute({
    method: 'GET',
    path: '/clear',
    config: {
        handler: function (request) {

            request.plugins.jar = request.state.jar;
            
            // var keys = Object.keys(request.state.jar)
            // for(var i in keys){
            //     console.log('deleting', keys[i], 'from', request.state.jar);
            //     delete request.state.jar[keys[i]];
            // }
            delete request.state.jar['_'];
            
            request.reply.redirect('/get').send();
        }
    }
});


/* Config.json in format of:

{
    "clientID": "xxxxxxxxxx",
    "clientSecret": "xxxxxxxxxxx"
}
*/
var config = require('./config.json');
passport._plugin = hapiPassport.plugin;

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

server.ext('onPreHandler', [
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
            // saveSession()(request, function(){
            //     request.reply("authenticated with request.user = ", request.user);
            // });
            // console.log('request.session', request.session)
            request.reply("<pre>authenticated with request.session = " + JSON.stringify(request.session, null, 2) + "</pre>");
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
});


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

server.addRoute({
    method: 'GET',
    path: '/setCookie/{val?}',
    config: {
        handler: function (request) {

            request.plugins.jar = {
                test: request.params.val || 1
            }
            
            console.log('set: ', request.plugins, this.plugins)
            console.log('session?', request.session)
            saveSession()(request, function(){
                request.reply('cookie set <a href="/getCookie">Click here</a> to see it.')
            })
            // request.reply('cookie set');
            
        }
    }
});

server.addRoute({
    method: 'GET',
    path: '/getCookie',
    config: {
        handler: function (request) {

            console.log('session?', request.session)
            request.reply(request.state.jar);
        }
    }
});

server.addRoute({
    method: 'GET',
    path: '/clearCookie',
    config: {
        handler: function (request) {

            // request.plugins.jar['test'] = null;
            // request.plugins.jar['key'] = null;
            delete request.state.jar;
            request.reply(request.state);
        }
    }
});

server.start(function(){
    console.log('server started')
});
