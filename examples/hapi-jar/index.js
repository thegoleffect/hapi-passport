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

server.addRoute({
    method: 'GET',
    path: '/set',
    config: {
        handler: function (request) {

            request.plugins.jar = {
                test: {
                    nested: true,
                    keys: 1
                }
            };
            request.reply.redirect('/get').send();
        }
    }
});

server.addRoute({
    method: 'GET',
    path: '/get',
    config: {
        handler: function (request) {

            request.reply({'state': request.state})
        }
    }
});

server.start(function(){
    console.log('server started')
});