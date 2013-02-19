var Hapi = require('hapi');
var Diplomat = require('../../');
var Passport = require('passport');

var config = require('./config.json');
var server = new Hapi.Server('localhost', config.port, config);
Diplomat.configure(server, Passport, config.session);

Passport.use(new FacebookStrategy(config.session.passport.facebook, function (accessToken, refreshToken, profile, done) {

    return done(null, profile);
}));

/* optional access to replace serialize/deserializeUser
Diplomat.passport.serializeUser(function(user, done) {

    done(null, user);
});
*/

// TODO: move to Diplomat
var ensureAuthenticated = function (next) {

    return function (request, internal) {

        if (request.isAuthenticated()) {
            return next();
        }
        
        request.reply.redirect('/login').send();
        
        if (internal) {
            internal();
        }
    };
};

// addRoutes
server.addRoute({
    method: 'GET',
    path: '/',
    config: {
        handler: Diplomat.ensureAuthenticated(function (request) {

            // If logged in already, redirect to /home
            // else to /login
            request.reply.redirect('/home').send();
        });
    }
});

server.addRoute({
    method: 'GET',
    path: '/auth/facebook',
    config: {
        handler: Diplomat.passport.authenticate('facebook')
    }
});
server.addRoute({
    method: 'GET',
    path: '/auth/facebook/callback',
    config: {
        handler: Diplomat.passport.authenticate('facebook', function (request) {

            request.reply.redirect('/').send();
        });
    }
});

server.start(function () {

    console.log('server started on port ' + config.port);
})