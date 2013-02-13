var Hapi = require('hapi');
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

var before = function () {

    return function (request, next) {

        console.log('before called');
        request.session = request.state[cookieOptions.plugin.name] || {};
        next();
    };
};

var after = function () {
    
    return function (request, next) {

        console.log('after called');
        request.plugins[cookieOptions.plugin.name] = request.session;
        next();
    };
};

server.ext('onPreHandler', [
    before()
]);

server.ext('onPostHandler', false, [
    after()
]);

server.addRoute({
    method: 'GET',
    path: '/set',
    config: {
        handler: function (request) {

            request.session.user = {
                id: 'van'
            };
            
            request.reply.redirect('/get').send();
            console.log('send')
        }
    }
});

server.addRoute({
    method: 'GET',
    path: '/get',
    config: {
        handler: function (request) {

            request.reply('<pre>session = ' + JSON.stringify(request.session, null, 2) + "</pre>");
        }
    }
});

server.start(function(){
    console.log('server started')
});