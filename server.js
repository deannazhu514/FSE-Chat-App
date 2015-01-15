var express = require('express');
var app = express();
var server = app.listen(3000);
var jade = require('jade');
var io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'))


app.get('/', function(req, res){
	res.render('home.jade');
});

var users = {};

function Message (user, text, date) {
	this.user = user;
	this.text = text;
	this.date = date;
}

var messages = [];

var chats = {};

io.sockets.on('connection', function(socket) {
	var addedUser = false;

	socket.on('new user', function(username){
		socket.username = username;
		users[username] = username;
		addedUser = true;
		socket.emit('login', {
			messages: messages
		});

		socket.broadcast.emit('user joined', {
			username: socket.username
		});
	});

	socket.on('message', function(data) {
		var data = {username: socket.username, 'text': data.text, 'date' : data.date};
		socket.broadcast.emit('message', data);

		messages.push(new Message(socket.username, data.text, data.date));
	})

	socket.on('leave room', function() {
		socket.broadcast.emit('leave room', {username: socket.username});
		delete users[socket.username];
	})
});


