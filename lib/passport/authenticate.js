var actions = require('./actions');

module.exports = function authenticate (name, options, callback) {

    if (!callback && typeof options === 'function') {
        callback = options;
        options = {};
    }
    options = options || {};
    
    return function authenticate (request, next) {

        var passport = this;
        var delegate = {};
        
        options.session = options.session || request.session;
        
        delegate.success = function (user, info) {

            request.logIn(user, options, function (err) {

                if (err) {
                    return next(err);
                }
                
                if (callback) {
                    return callback(null, user, info);
                }
                
                next();
            });
        };
        
        delegate.fail = function (challenge, status) {

            console.log('hapi delegate fail');
        }
        
        delegate.pass = function () {

            next();
        };
        
        delegate.redirect = function (url, status) {
          console.log('hapi delegate redirect to', url);
          
          request.reply.redirect(url).send();
        };
        
        var prototype = passport._strategy(name);
        if (!prototype) { return next(new Error('no strategy registered under name: ' + layer)); }
        var strategy = Object.create(prototype);
        augment(strategy, actions, delegate);
        
        strategy.authenticate(request, options);
    }
};


function augment (strategy, actions, ctx) {
  for (var method in actions) {
    strategy[method] = actions[method].bind(ctx);
  }
};