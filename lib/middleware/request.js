module.exports = function (options) {

    var self = this;
    this.options = options || {};
    
    return function (request, next) {

        request.isAuthenticated = function() {

          var property = 'user';
          if (request._passport && request._passport.instance._userProperty) {
            property = request._passport.instance._userProperty;
          }
          
          return (request[property]) ? true : false;
        };
        
        request.login =
        request.logIn = function(user, options, done) {
          if (!request._passport) throw new Error('passport.initialize() middleware not in use');
          
          if (!done && typeof options === 'function') {
            done = options;
            options = {};
          }
          options = options || {};
          var property = request._passport.instance._userProperty || 'user';
          var session = (options.session === undefined) ? true : options.session;
          
          request[property] = user;
          if (session) {
            // var self = request;
            request._passport.instance.serializeUser(user, function(err, obj) {
              if (err) { request[property] = null; return done(err); }
              request._passport.session.user = obj;
              done();
            });
          } else {
            done && done();
          }
        }
        
        request.logout =
        request.logOut = function() {
          if (!request._passport) throw new Error('passport.initialize() middleware not in use');
          
          var property = request._passport.instance._userProperty || 'user';
          
          request[property] = null;
          delete request._passport.session.user;
        };
        
        next();
    };
};