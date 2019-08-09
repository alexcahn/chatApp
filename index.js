const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 3000;

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

app.get('/hockey', (req, res) => {
    res.sendFile(__dirname + '/public/views/hockey.html')
})

app.get('/football', (req, res) => {
    res.sendFile(__dirname + '/public/views/football.html')
})

app.get('/baseball', (req, res) => {
    res.sendFile(__dirname + '/public/views/baseball.html')
})

app.get('/basketball', (req, res) => {
    res.sendFile(__dirname + '/public/views/basketball.html')
})

// tech namespace
const sports = io.of('/sports');

sports.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room)
        sports.in(data.room).emit('message', `${data.person} joined ${data.room} room!`)
    })

    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        sports.emit('message', data.msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected')
        // tell everybody someone disconnected
        sports.emit('message', 'user disconnected')
    })
})