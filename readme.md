# Load balancing Socket.Io NodeJs
A repo to find perfect LoadBalancing Solution for Socket.io on Node JS

## Dependencies
- dotenv
- express
- redis
- socket.io
- socket.io-redis

## Use

How can you use this repo?

This repo has some basic setup, to test your socketio loadbalance solution.

- Rename .env.save to .env
- Define a server name on .env SERVER options, this will be displayed, when(which server) your are connected and where(which server) the message is came from.

## Solution 1
We are using Redis and socket.io-redis adapter to loadbalance, which works perfectly when used with sticky session / ip_hash Load balance with Nginx.

Works With

- Sticky Session
- ip_hash load balance with Nginx.

I have discussed about the solution here, [Load Balancing Node.js Application #Socket.io](https://www.bloggernepal.com/2020/05/load-balancing-nodejs-application.html)

### Links

[GitHub Repo](https://github.com/BloggerNepal/Load-balancing-Socket.Io-NodeJs/)
