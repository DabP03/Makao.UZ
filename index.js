const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

require('./server/main').main(io);

app.use(express.static("client"));

server.listen(port,() => {
  console.log(`listening on localhost:${port}`);
})
