# Load balancing Socket.Io NodeJs - Solution 1
This Works fine for sticky session / ip_hash Load balance with Nginx.

## Dependencies
- dotenv
- express
- redis
- socket.io
- socket.io-redis


## Solution 1
We are using Redis and socket.io-redis adapter to loadbalance, which works perfectly when used with sticky session / ip_hash Load balance with Nginx.

Works With

- Sticky Session
- ip_hash load balance with Nginx.

I have discussed about the solution here, [Load Balancing Node.js Application #Socket.io](https://www.bloggernepal.com/2020/05/load-balancing-nodejs-application.html)

We have solution_1.conf Nginx configuration file, which will loadbalance the requests comming on http://socket.node to http://localhost:4010 and http://localhost:4011.

So, to first to make socket.node host available add

127.0.1.3	socket.node

on /etc/hosts, just as on the etc-hosts file

Then create solution_1.conf (or any name) and add this content there

    upstream sbackend {
        ip_hash;
        server localhost:4010;
        server localhost:4011;
    }

    server { 
        server_name socket.node;
        location / {
            proxy_pass http://sbackend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass
            $http_upgrade;
        }
    }

just as in solution_1.conf file.

Now, let's start the node server on two port.

first with port 4010

second with port 4011

```Cannot be verified locally, since IP hash will always forward you to the same instance of node server```
