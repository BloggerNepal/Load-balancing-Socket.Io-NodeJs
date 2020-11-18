# Load balancing Socket.Io NodeJs - Solution 1
There are multiple reasons we should not use sticky session. So here is solution, but we will miss what socketio offers.

## Dependencies
- dotenv
- express
- redis
- socket.io
- socket.io-redis


## Solution 2
We are using Redis and socket.io-redis adapter to loadbalance, which works perfectly. But on Socket.io by default, a long-polling connection is established first, then upgraded to “better” transports (like WebSocket). With the above method, we are not getting the benefits of using socket.io over raw websocket. 

Works With

- Devices supporting websocket.

I have discussed about the solution here, [Load Balancing Node.js Application #Socket.io](https://www.bloggernepal.com/2020/05/load-balancing-nodejs-application.html)

We have solution_2.conf Nginx configuration file, which will loadbalance the requests comming on http://socket.node to http://localhost:4010 and http://localhost:4011.

So, to first to make socket.node host available add

127.0.1.3	socket.node

on /etc/hosts, just as on the etc-hosts file

Then create solution_2.conf (or any name) and add this content there

    upstream swbackend {
        server localhost:4010;
        server localhost:4011;
    }

    server { 
        server_name socket.node;
        location / {
            proxy_pass http://swbackend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass
            $http_upgrade;
        }
    }

just as in solution_2.conf file.

Now, let's start the node server on two port.

first with port 4010

second with port 4011

```Socket.io: In that case (transports: [ 'websocket' ]), you should maybe consider using raw WebSocket, or a thin wrapper like robust-websocket.```
