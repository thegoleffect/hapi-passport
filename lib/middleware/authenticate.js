var Actions = require('./actions');
var Boom = require('boom');

var authFactory = function (options) {

    var self = this;
    this.options = options || {};
    
    return function authenticate (name, options, callback) {

        if (!callback && typeof options === 'function') {
            callback = options;
            options = {};
        }
        options = options || {};
        
        if (!Array.isArray(name)) {
            name = [name];
        }
        
        return function authenticate(request, next) {

            var passport = this;
            var failures = [];
            
            function allFailed() {

                if (callback) {
                    if (failures.length == 1) {
                        return callback(null, false, failures[0].challenge, failures[0].status);
                    }
                    else {
                        var challenges = failures.map(function (f) {

                            return f.challenge;
                        });
                        var statuses = failures.map(function(f) {

                            return f.status;
                        });
                        
                        return callback(null, false, challenges, statuses);
                    }
                }
                
                var failure = failures[0] || {};
                var challenge = failure.challenge || {};
                
                if (options.failureFlash) {
                    var flash = options.failureFlash;
                    
                    if (typeof flash == 'string') {
                        flash = { type: 'error', message: flash };
                    }
                    flash.type = flash.type || 'error';
                  
                    var type = flash.type || challenge.type || 'error';
                    var msg = flash.message || challenge.message || challenge;
                    if (typeof msg == 'string') {
                        request.session.flash = request.session.flash || {};
                        request.session.flash[type] = msg;
                        // req.flash(type, msg);
                    }
                }
                  
                if (options.failureMessage) {
                    var msg = options.failureMessage;
                    
                    if (typeof msg == 'boolean') {
                        msg = challenge.message || challenge;
                    }
                    
                    if (typeof msg == 'string') {
                        req.session.messages = req.session.messages || [];
                        req.session.messages.push(msg);
                    }
                }
                
                if (options.failureRedirect) {
                    return res.reply.redirect(options.failureRedirect).send();
                }
                
                var rchallenge = [];
                var rstatus = null;
                
                for (var i = 0, l = failures.length; i < l; ++i) {
                    var failure = failures[i];
                    var challenge = failure.challenge || {};
                    var status = failure.status;
                    
                    if (typeof challenge == 'number') {
                        status = challenge;
                        challenge = null;
                    }
                    
                    rstatus = rstatus || status;
                    if (typeof challenge == 'string') {
                        rchallenge.push(challenge);
                    }
                }
                
                return request.reply(Boom.unauthorized('Unauthorized', rchallenge || null));
            };
            
            
            (function attempt(i) {

                var delegate = {};
                options.session = options.session || request.session;
                
                delegate.success = function (user, info) {

                    if (callback) {
                        return callback(null, user, info);
                    }
                    
                    info = info || {};
                    
                    if (options.successFlash) {
                        var flash = options.successFlash;
                        
                        if (typeof flash == 'string') {
                            flash = {
                                type: 'success',
                                message: flash
                            };
                        }
                        flash.type = flash.type || 'success';
                        
                        var type = flash.type || info.type || 'success';
                        var msg = flash.message || info.message || info;
                        if (typeof msg == 'string') {
                            request.session.flash = request.session.flash || {};
                            request.session.flash[type] = msg;
                            // req.flash(type, msg);
                        }
                    }
                    
                    if (options.successMessage) {
                        var msg = options.successMessage;
                        
                        if (typeof msg == 'boolean') {
                            msg = info.message || info;
                        }
                        
                        if (typeof msg == 'string') {
                            req.session.messages = req.session.messages || [];
                            req.session.messages.push(msg);
                        }
                    }
                    
                    if (options.assignProperty) {
                        req[options.assignProperty] = user;
                        return next();
                    }
                    
                    request.logIn(user, options, function (err) {

                        if (err) {
                            return next(err);
                        }
                        
                        if (options.authInfo || options.authInfo === undefined) {
                           passport.transformAuthInfo(info, function (err, tinfo) {
instance
                              if (err) {
                                  return next(err);
                              }
                              
                              request.authInfo = tinfo;
                              complete();
                           });
                        }
                        else {
                            complete();
                        }
                        
                        var complete = function () {

                            if (options.successReturnToOrRedirect) {
                                var url = options.successReturnToOrRedirect;
                                
                                if (request.session && request.session.returnTo) {
                                    url = request.session.returnTo;
                                    delete request.session.returnTo;
                                }
                                return request.reply.redirect(url).send();
                            }
                            
                            if (options.successRedirect) {
                                return request.reply.redirect(options.successRedirect).send();
                            }
                            
                            next();
                        };
                    });
                }; // end of delegate.success
                
                delegate.fail = function (challenge, status) {
                    failures.push({
                        challenge: challenge,
                        status: status
                    });
                    return attempt(i + 1);
                };
                
                delegate.pass = function () {

                    return next();
                };
                
                delegate.redirect = function (url, status) {

                    return request.reply.redirect(url).send();
                };
                
                var layer = name[i];
                if (!layer) {
                    return allFailed();
                }
                
                var prototype = passport._strategy(layer);
                if (!prototype) {
                    return next(Boom.internal('No strategy registered under the name:' + layer));
                }
                
                var strategy = Object.create(prototype);
                augment(strategy, actions, delegate);
                
                strategy.authenticate(request, options);
            })(0);
        };
    };
};

function augment (strategy, actions, ctx) {

    for (var method in actions) {
        strategy[method] = actions[method].bind(ctx);
    }
};


module.exports = authFactory;