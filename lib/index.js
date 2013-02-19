var HapiPassport = function (server, options) {

    this.server = server;
    this.options = options;
    this.cookieOptions = {
        permissions: {
            ext: true
        },
        plugin: {
            name: this.options.name || 'jar',
            isSingleUse: false,
            options: {
                password: this.options.password
            }
        }
    };
    console.log('cookieOpts', this.cookieOptions)
    
    this.session(options);
    
    return this;
};


HapiPassport.prototype.session = function () {

    // TODO: convenience wrapper for boilerplate setup code
    var self = this;
    
    this.server.plugin().require('hapi-jar', this.cookieOptions, function (err) {

        if (err) {
            throw err;
        }
    });
    
    this.server.ext('onPreHandler', false, [
        self.onPre()
    ]);
    
    this.server.ext('onPostHandler', false, [
        self.onPost()
    ]);
    
    return this;
};


HapiPassport.prototype.onPre = function () {

    var key = this.cookieOptions.plugin.name;
    return function (request, next) {

        console.log("onPre, state", request.state)
        request.session = request.state[key];
        console.log('onPost getting session...', request.url.path, JSON.stringify(request.session['passport']).slice(0, 20))
        next();
    };
};


HapiPassport.prototype.onPost = function () {

    var key = this.cookieOptions.plugin.name;
    return function (request, next) {

        console.log('onPost saving session...', request.url.path, JSON.stringify(request.session['passport']).slice(0, 20))
        request.plugins[key] = request.state[key] = request._passport.session;
        next();
    };
};


exports = module.exports = HapiPassport;
exports.plugin = {
    authenticate: require('./passport/authenticate'),
    initialize: require('./passport/initialize')
};