var Hapi = require('hapi');
var server = new Hapi.Server('localhost', 8000);

// enable session cookie jar
var sessionOptions = {
    permissions: {
        ext: true
    },
    plugin: {
        options: {
            password: 'worldofwalmart'
        }
    }
};

server.plugin().register(require('hapi-session'), sessionOptions, function (err) {

    if (err) {
        throw err;
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

            var src = '{"provider":"facebook","id":"1182872392","username":"vanscribe","displayName":"Van Nguyen","name":{"familyName":"Nguyen","givenName":"Van"},"gender":"male","profileUrl":"http://www.facebook.com/vanscribe","emails":[{}],"_raw":"{\\"id\\":\\"1182872392\\",\\"name\\":\\"Van Nguyen\\",\\"first_name\\":\\"Van\\",\\"last_name\\":\\"Nguyen\\",\\"link\\":\\"http:\\\\/\\\\/www.facebook.com\\\\/vanscribe\\",\\"username\\":\\"vanscribe\\",\\"location\\":{\\"id\\":\\"114952118516947\\",\\"name\\":\\"San Francisco, California\\"},\\"bio\\":\\"Yay, Node.js 24\\\\/7 :D.\\",\\"quotes\\":\\"\\\\\\"Success is getting what you want.  Happiness is wanting what you get\\\\\\" ~ Dale Carnegie\\\\r\\\\n\\\\r\\\\n\\\\\\"Nearly all men can stand adversity, but if you want to test a man\'s character, give him power.\\\\\\" ~ Abraham Lincoln\\",\\"work\\":[{\\"employer\\":{\\"id\\":\\"186798111370444\\",\\"name\\":\\"\\\\u0040WalmartLabs\\"},\\"location\\":{\\"id\\":\\"112488205430730\\",\\"name\\":\\"San Bruno, California\\"},\\"position\\":{\\"id\\":\\"150187584994865\\",\\"name\\":\\"Sr. Software Engineer\\"},\\"description\\":\\"Mobile Services.\\",\\"start_date\\":\\"2012-02\\"},{\\"employer\\":{\\"id\\":\\"119642528059146\\",\\"name\\":\\"Metamoki\\"},\\"location\\":{\\"id\\":\\"114952118516947\\",\\"name\\":\\"San Francisco, California\\"},\\"position\\":{\\"id\\":\\"142300459126053\\",\\"name\\":\\"Senior Engineer\\"},\\"description\\":\\"Web Infrastructure and Operations. I\'m also a MongoDBA. Also, I was a principle engineer for Mob Wars.\\",\\"start_date\\":\\"2010-05\\",\\"end_date\\":\\"2011-01\\"},{\\"employer\\":{\\"id\\":\\"109222719117653\\",\\"name\\":\\"ElusiveHippo.com\\"},\\"location\\":{\\"id\\":\\"106003956105810\\",\\"name\\":\\"Boston, Massachusetts\\"},\\"position\\":{\\"id\\":\\"107957955904825\\",\\"name\\":\\"Founder\\"},\\"description\\":\\"I created it.\\",\\"start_date\\":\\"2010-04\\",\\"end_date\\":\\"2010-05\\"},{\\"employer\\":{\\"id\\":\\"110191015669667\\",\\"name\\":\\"FreeCause\\"},\\"location\\":{\\"id\\":\\"106003956105810\\",\\"name\\":\\"Boston, Massachusetts\\"},\\"position\\":{\\"id\\":\\"135149646517641\\",\\"name\\":\\"S. Engineer\\"},\\"description\\":\\"Wrote a real-time notification system for FreeCause toolbars.  Re-architected and optimized several internal tools.\\",\\"start_date\\":\\"2009-05\\",\\"end_date\\":\\"2010-04\\"},{\\"employer\\":{\\"id\\":\\"126533127390327\\",\\"name\\":\\"Massachusetts Institute of Technology (MIT)\\"},\\"location\\":{\\"id\\":\\"108056275889020\\",\\"name\\":\\"Cambridge, Massachusetts\\"},\\"position\\":{\\"id\\":\\"139732189394863\\",\\"name\\":\\"Instructor\\"},\\"description\\":\\"Taught several courses for the Educational Studies Program and Spark.\\",\\"start_date\\":\\"2009-12\\",\\"end_date\\":\\"2010-02\\"},{\\"employer\\":{\\"id\\":\\"135187523206602\\",\\"name\\":\\"Metamoki, Inc.\\"},\\"start_date\\":\\"0000-00\\",\\"end_date\\":\\"0000-00\\"},{\\"employer\\":{\\"id\\":\\"178942255457008\\",\\"name\\":\\"500 Startups\\"},\\"start_date\\":\\"0000-00\\",\\"end_date\\":\\"0000-00\\"},{\\"employer\\":{\\"id\\":\\"141651685862427\\",\\"name\\":\\"500 Startups\\"},\\"start_date\\":\\"0000-00\\",\\"end_date\\":\\"0000-00\\"}],\\"education\\":[{\\"school\\":{\\"id\\":\\"102091026499913\\",\\"name\\":\\"Caravel Academy\\"},\\"type\\":\\"High School\\",\\"classes\\":[{\\"id\\":\\"145384578853989\\",\\"name\\":\\"2003\\",\\"with\\":[{\\"id\\":\\"25200729\\",\\"name\\":\\"Mike Quashne\\"}],\\"from\\":{\\"id\\":\\"25200729\\",\\"name\\":\\"Mike Quashne\\"}}]},{\\"school\\":{\\"id\\":\\"111960675486467\\",\\"name\\":\\"University of Delaware\\"},\\"concentration\\":[{\\"id\\":\\"170343336345310\\",\\"name\\":\\"Electrical & Computer Engineering\\"}],\\"type\\":\\"College\\"}],\\"gender\\":\\"male\\",\\"religion\\":\\"Apple\\",\\"timezone\\":-8,\\"locale\\":\\"en_US\\",\\"languages\\":[{\\"id\\":\\"106059522759137\\",\\"name\\":\\"English\\"},{\\"id\\":\\"104059856296458\\",\\"name\\":\\"Vietnamese\\"},{\\"id\\":\\"109549852396760\\",\\"name\\":\\"Japanese\\"},{\\"id\\":\\"112624162082677\\",\\"name\\":\\"Russian\\"},{\\"id\\":\\"108106272550772\\",\\"name\\":\\"French\\"}],\\"verified\\":true,\\"updated_time\\":\\"2012-11-30T21:52:32+0000\\"}","_json":{"id":"1182872392","name":"Van Nguyen","first_name":"Van","last_name":"Nguyen","link":"http://www.facebook.com/vanscribe","username":"vanscribe","location":{"id":"114952118516947","name":"San Francisco, California"},"bio":"Yay, Node.js 24/7 :D.","quotes":"\\"Success is getting what you want.  Happiness is wanting what you get\\" ~ Dale Carnegie\\r\\n\\r\\n\\"Nearly all men can stand adversity, but if you want to test a man\'s character, give him power.\\" ~ Abraham Lincoln","work":[{"employer":{"id":"186798111370444","name":"@WalmartLabs"},"location":{"id":"112488205430730","name":"San Bruno, California"},"position":{"id":"150187584994865","name":"Sr. Software Engineer"},"description":"Mobile Services.","start_date":"2012-02"},{"employer":{"id":"119642528059146","name":"Metamoki"},"location":{"id":"114952118516947","name":"San Francisco, California"},"position":{"id":"142300459126053","name":"Senior Engineer"},"description":"Web Infrastructure and Operations. I\'m also a MongoDBA. Also, I was a principle engineer for Mob Wars.","start_date":"2010-05","end_date":"2011-01"},{"employer":{"id":"109222719117653","name":"ElusiveHippo.com"},"location":{"id":"106003956105810","name":"Boston, Massachusetts"},"position":{"id":"107957955904825","name":"Founder"},"description":"I created it.","start_date":"2010-04","end_date":"2010-05"},{"employer":{"id":"110191015669667","name":"FreeCause"},"location":{"id":"106003956105810","name":"Boston, Massachusetts"},"position":{"id":"135149646517641","name":"S. Engineer"},"description":"Wrote a real-time notification system for FreeCause toolbars.  Re-architected and optimized several internal tools.","start_date":"2009-05","end_date":"2010-04"},{"employer":{"id":"126533127390327","name":"Massachusetts Institute of Technology (MIT)"},"location":{"id":"108056275889020","name":"Cambridge, Massachusetts"},"position":{"id":"139732189394863","name":"Instructor"},"description":"Taught several courses for the Educational Studies Program and Spark.","start_date":"2009-12","end_date":"2010-02"},{"employer":{"id":"135187523206602","name":"Metamoki, Inc."},"start_date":"0000-00","end_date":"0000-00"},{"employer":{"id":"178942255457008","name":"500 Startups"},"start_date":"0000-00","end_date":"0000-00"},{"employer":{"id":"141651685862427","name":"500 Startups"},"start_date":"0000-00","end_date":"0000-00"}],"education":[{"school":{"id":"102091026499913","name":"Caravel Academy"},"type":"High School","classes":[{"id":"145384578853989","name":"2003","with":[{"id":"25200729","name":"Mike Quashne"}],"from":{"id":"25200729","name":"Mike Quashne"}}]},{"school":{"id":"111960675486467","name":"University of Delaware"},"concentration":[{"id":"170343336345310","name":"Electrical & Computer Engineering"}],"type":"College"}],"gender":"male","religion":"Apple","timezone":-8,"locale":"en_US","languages":[{"id":"106059522759137","name":"English"},{"id":"104059856296458","name":"Vietnamese"},{"id":"109549852396760","name":"Japanese"},{"id":"112624162082677","name":"Russian"},{"id":"108106272550772","name":"French"}],"verified":true,"updated_time":"2012-11-30T21:52:32+0000"}}';
            // var len = Math.floor(src.length / 2 / 2);
            var len = 2000;
            var output = src.slice(0, len)
            console.log('len is currently', len)
            request.session.user = output;
            request.reply.redirect('/get').send();
        }
    }
});

server.addRoute({
    method: 'GET',
    path: '/set2',
    config: {
        handler: function (request) {

            request.session.id = "van";
            request.reply.redirect('/get').send();
        }
    }
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

server.start(function(){
    console.log('server started')
});