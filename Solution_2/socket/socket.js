const socket = require('socket.io');
const ioRedis = require('socket.io-redis');
const redis = require('redis');
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

let io;
module.exports.init = (server) =>{
    io = socket(server, {
        cors: {
            origin: '*'
        },
        transports: ['websocket']
    });
    io.adapter(ioRedis({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT}))

    // io.set('origins', '*:*');

    io.on('connection', socket =>{
        console.debug("connected",  process.env.SERVER);
        socket.on("join", data =>{
            //Todo check for duplicate users

            console.debug("Join Event", data);
            let name = data.name;
            socket.name = name;
            socket.join(name);

            redisClient.rpush("users", name, (error, response) => {
                console.debug("Saved on redis");
                console.debug(response); //gives total users number
            })

            redisClient.lrange("users", 0, -1, function(err, response) {
                console.debug("All users on redis")
                console.debug(response); //gives users

                socket.emit("connected", {
                    // to: name,
                    server: process.env.SERVER,
                    users: response
                });
            });

            socket.broadcast.emit('newUser',{
                name: name
            })
        })
        socket.on("send", data =>{
            console.debug("Send Event", data);
            let to = data.to;
            // socket.broadcast.emit('message', {
            socket.to(to).emit("message", {
                from: socket.name,
                to: data.to, //for braodcast
                message: data.message,
                server: process.env.SERVER
            })
        })

        socket.on('disconnect', data =>{
            if(socket.name){
                //is joined user
                redisClient.lrem("users", 1, socket.name, (error, response) => {
                    console.debug("Removed from Redis");
                    console.debug(response); //gives removed number(count) of users
                })

                socket.broadcast.emit('userLeft',{
                    name: socket.name
                })

            }
        })
    });
    
    return io;
}


module.exports.getIO = () =>{
    if(io){
        return io;
    } else {
        console.error("Socket Io not initialized");
    }
}