var Hapi = require('hapi');
var Diplomat = require('../../');
var Passport = require('passport');


var config = require('./config.json');
var server = new Hapi.Server('localhost', config.port, config);
Diplomat.configure(server, Passport, config);


Passport.use(new FacebookStrategy(config.passport.facebook, function (accessToken, refreshToken, profile, done) {

    return done(null, profile);
}));
Passport.serializeUser(function(user, done) {

    done(null, user);
});
passport.deserializeUser(function(obj, done) {

    done(null, obj);
});


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
        // can use either passport.X or Diplomat.passport.X
        handler: passport.authenticate('facebook')
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