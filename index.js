const db = require('./db');
const hapi = require('hapi');
const jwt = require('jsonwebtoken');
const inert = require('inert')

const secretKey = 'supersecure';

const init = async () => {
    const server = new hapi.server({port: 8000});
    
    await server.register(require('hapi-auth-jwt2'));
    await server.register(inert);

    server.auth.strategy('jwt', 'jwt', {
        key: secretKey,
        validate: validate,
        verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default('jwt');

    server.route([{
        method: 'POST',
        path: '/auth',
        options: {
            auth: false,
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: authHandler
    }, 
    {
        method: 'GET',
        path: '/logintest',
        options: {
            auth: false
        },
        handler: {
            file: 'mock.html'
        }
    },
    {
        method: 'GET',
        path: '/verifytest',
        options: {
            auth: 'jwt'
        },
        handler: function(request, h) {
            return {text: 'Token accepted'};
        }
    },
    {
        method: 'GET',
        path: '/searchuser/{keyword}',
        options: {
            auth: false,
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: async (request, h) => {
            const query = request.params.keyword;
            console.log(query);
            db.connect();
            const result = await db.getUsersByUsernameSub(query);
            db.disconnect();
            console.log(result);
            return result;
        }
    },
    {
        method: 'GET',
        path: '/searchblogs/{keyword}',
        options: {
            auth: false,
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: async (request, h) => {
            const query = request.params.keyword;
            console.log(query);
            db.connect();
            const result = await db.getBlogsByTitleSub(query);
            db.disconnect();
            console.log(result);
            return result;
        }
    },
    {
        method: 'GET',
        path: '/getblogsuser/{username}',
        options: {
            auth: false,
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: async (request, h) => {
            db.connect();
            const result = await db.getBlogsByUsername(request.params.username);
            db.disconnect();
            return result;
        }
    },
    {
        method: 'GET',
        path: '/getblogtitle/{title}',
        options: {
            auth: false,
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: async (request, h) => {
            db.connect();
            const result = await db.getBlogByTitle(request.params.title);
            db.disconnect();
            // if(result.length === 0){
            //     return h.response().code(404);
            // } else {
            //     return result;
            // }
            return result;  
        }
    },
    {
        method: 'POST',
        path: '/submitblog',
        options: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: async (request, h) => {
            const blog = JSON.parse(request.payload);
            console.log(request.auth.credentials.username);
            blog.author = request.auth.credentials.username;
            console.log(blog);
            db.connect();
            await db.addBlog(blog);
            db.disconnect();
            console.log('I got here');
            return {statusCode: 200};
        }
    }
    ]);
    await server.start();
    return server;
}

init().then( server => {
    console.log('Server running at:', server.info.uri);
})
.catch(error => console.log(error));

async function authHandler(req, h) {   
    const obj = JSON.parse(req.payload);
    const username = obj.username;
    const password = obj.password;
    
    db.connect();
    var query = await db.getUser(username);
    db.disconnect();
    
    // check to see is username exists in db (query will be null if it didnt)
    if(query) {
        console.log('query successful');
        // use db helper function to verify that the req password matches the hash in the query
        if(db.verifyPassword(password, query.password, query.salt)){
            console.log('password correct');
            return authSuccess(obj);
        }
    } 

    console.log('rejected');
    return h.response().code(401);
}

async function validate (decoded, request, h) {
    console.log(decoded);
    db.connect();
    var result = await db.getUser(decoded.username);
    db.disconnect();
    return (result ? {isValid: true} : {isValid: false});
}

function authSuccess(payload) {
    // on successful login generate token and return it to sender
    var token = generateToken(payload.username);
    // const response = h.response(204).header('X-token', token);
    return {token: token};
}

function generateToken(username) {
    // generate token using w/e algo
    return jwt.sign({
        username: username
    }, secretKey, {algorithm: 'HS256'});
}