const path = require('path');

const express = require('express');

const socket = require('./socket/socket')

const app = express();

require('dotenv').config()

app.use('/static', express.static(path.join(__dirname, 'static')));
app.get("/", (req, res, next) =>{
    res.sendFile(path.join(__dirname+'/view/index.html'));
})

let server = app.listen(process.env.PORT);
console.log("Server Started at :", process.env.PORT);

socket.init(server);