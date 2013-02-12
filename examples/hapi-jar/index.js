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

var before = function (request, next) {

    request.session = request.state[cookieOptions.plugin.name] || {};
    next();
};

var after = function (request, next) {

    request.plugins[cookieOptions.plugin.name] = request.session;
    next();
}

server.addRoute({
    method: 'GET',
    path: '/set',
    config: {
        handler: function (request) {

            before(request, function () {

                // do stuff
                request.session.user = {
                    id: 'van'
                };
                
                after(request, function () {

                    request.reply.redirect('/get').send();
                });
            })
        }
    }
});

server.addRoute({
    method: 'GET',
    path: '/get',
    config: {
        handler: function (request) {

            before(request, function () {

                after(request, function () {

                    request.reply('<pre>session = ' + JSON.stringify(request.session, null, 2) + "</pre>");
                })
            })
        }
    }
});

server.start(function(){
    console.log('server started')
});