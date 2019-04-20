const Hapi = require('hapi');
const Inert = require("inert");
const Vision = require('vision');
const dbdrive = require("./util/db");

(async () => {
    const server = await new Hapi.Server({
        host: '0.0.0.0',
        port: 5000,
    });

    //server.auth.scheme('basic-auth-scheme', AuthSchema.basic_auth_schema);
    //server.auth.scheme('metting-auth-schema',AuthSchema.metting_auth_schema);

    //server.auth.strategy('token', 'basic-auth-scheme');
    //server.auth.strategy('meeting', 'metting-auth-schema');

    await server.register([
        Inert,
        Vision,
        // swagger
    ]);

    //TODO: 크로스 이슈 때문에 추가한 것... 실제 서비스일때는 미사용으로 변경 바람.
    server.ext({
        type: 'onPreResponse', 
        method:(request,h)=>{
            if (!request.headers.origin) {
                return h.continue
            }

            // depending on whether we have a boom or not,
            // headers need to be set differently.
            var response = request.response.isBoom ? request.response.output : request.response

            response.headers['access-control-allow-origin'] = request.headers.origin
            response.headers['access-control-allow-credentials'] = 'true'
            if (request.method !== 'options') {
                return h.continue
            }

            response.statusCode = 200
            response.headers['access-control-expose-headers'] = 'content-type, content-length, etag'
            response.headers['access-control-max-age'] = 60 * 10 // 10 minutes
            // dynamically set allowed headers & method
            if (request.headers['access-control-request-headers']) {
                response.headers['access-control-allow-headers'] = request.headers['access-control-request-headers']
            }
            if (request.headers['access-control-request-method']) {
                response.headers['access-control-allow-methods'] = request.headers['access-control-request-method']
            }

            return h.continue
        }
    })
    server.ext({
        type: 'onRequest',
        method: (request, h) => {
            console.log("request path : =>" + request.path);
                return h.continue;
            //sawgger request 버그 해결용.
            // request.headers['x-forwarded-host'] = (request.headers['x-forwarded-host'] || request.info.host);
            // //aws 리퀘스트...
            // if (request.headers['x-forwarded-proto'] == 'http') {
            //     return h.redirect('https://' + request.info.hostname + request.url.path);
            // } else if (request.path == '/documentation') {
            //     return h.continue;
            // } else if (request.path.includes('swagger')) {
            //     return h.continue;
            // } else if (request.path == '/health'){
            //     return h.continue;
            // }
            // // //필수헤더.
            // else if ((request.headers['api-version'] != process.env.APP_VERSION) ||
            //     (request.headers['app-version'] == undefined) ||
            //     (request.headers['app-locale'] == undefined)) {


            //     return h.response(error_codes.MISSING_HEADER).code(401).takeover();
            // } else {
            //     console.log("request path : =>" + request.path);
            //     return h.continue;
            // }
        }
    });

    require('./routes')(server);
    server.route({
        method: 'GET',
        path: '/{param*}',
        config: {
            handler: {
                directory: {
                    path: 'templates'
                }
            },
            description: '리소스 요청',
            notes: '리소스 요청 API 입니다.(추후 다른 리소스 서버로 변경 할 수 있음)',
            tags: ['api', 'resource'], // ADD THIS TAG
        }
    });


    try {
        dbdrive.connect().then(()=>{
            console.log('Server running at:', server.info.uri);
            server.start();
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    } catch (err) {
        console.log(err);
    }

    //server.route(Routes);
})();