// Load modules

var Chai = require('chai');
var Hapi = require('hapi');

var HapiSession = require('hapi-session');

// Declare internals

var internals = {};


// Test shortcuts

var expect = Chai.expect;

describe('Session', function () {

    var options = {
        session: {
            permissions: {
                ext: true
            },
            plugin: {
                name: 'session',
                isSingleUse: false,
                options: {
                    password: 'worldofwalmart'
                }
            }
        }
    };
    var server = new Hapi.Server('localhost', 8000, options);
    server.plugin().register(HapiSession, options.session, function (err) {

        if (err) throw err;
    });
    server.addRoute({
        method: 'GET',
        path: '/clear',
        config: {
            handler: function (request) {

                request.session = null;
                request.reply.redirect('/get').send();
            }
        }
    });

    server.addRoute({
        method: 'GET',
        path: '/get',
        config: {
            handler: function (request) {

                request.reply(request.session);
            }
        }
    });
    
    server.addRoute({
        method: 'GET',
        path: '/set',
        config: {
            handler: function (request) {

                request.session['key'] = 'testing';
                request.reply(request.session);
            }
        }
    });
    
    var clearReq = {
        method: 'get',
        url: '/clear'
    };
    
    var setReq = {
        method: 'get',
        url: '/set'
    };
    
    it('should do stuff', function (done) {

        server.inject(clearReq, function (res) {

            console.log('request.session after clear', request.session);
            server.inject(setReq, function (res) {

                console.log('request.session after set', request.session);
                console.log('res', res.result);
                done();
            })
        });
    });
});