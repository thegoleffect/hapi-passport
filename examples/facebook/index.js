var passport = require('passport-debug');
var Hapi = require('hapi');
var util = require('util');
var FacebookStrategy = require('passport-facebook').Strategy

var server = new Hapi.Server('localhost', 8000);

// enable session cookie jar
var cookieOptions = {
    permissions: {
        ext: true
    },
    plugin: {
        name: 'jar',
        isSingleUse: false,
        options: {
            password: 'worldofwalmart'
        }
    }
};
server.plugin().require('hapi-jar', cookieOptions, function (err) {
    if (err) {
        throw err;
    }
});


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

var getSession = function () {

    return function (request, next) {

        // console.log('getSession sees: ', request.state.jar)
        // if (request.state && request.state.jar && request.state.jar['passport']) {
        //     request.session = JSON.parse(request.state.jar['passport']);
        // }
        // else {
        //     request.session = {};
        // }
        // console.log('getting session:', request.session)
        console.log('getSession state', request.state.jar)
        console.log('getSession plugin', request.plugins.jar)
        
        next();
    };
};

var saveSession = function () {
    
    return function (request, next) {

        // console.log('saveSession sees: ', request.session)
        // if (request.session) {
        //     // request.plugins.jar = request.session;
        //     request.plugins.jar['passport'] = JSON.stringify(request.session.passport);
        // }
        // console.log('saving jar:', request.plugins.jar)
        console.log('saveSession state', request.state.jar)
        console.log('saveSession plugin', request.plugins.jar)
        console.log('adding to request.plugin')
        request.plugins.jar['key'] = 'testing'
        
        next();
    };
};


server.ext('onPreHandler', [
    getSession(),
    passport.initialize(),
    // passport.session()
]);

server.ext('onPostHandler', [
    // saveSession()
])

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
            saveSession()(request, function(){
                request.reply("authenticated with request.user = ", request.user);
            });
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

            request.plugins.jar = null;
            request.reply(request.state.jar);
        }
    }
});

server.start(function(){
    console.log('server started')
});
