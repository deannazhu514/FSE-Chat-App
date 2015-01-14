var socket = io.connect();

/*$("#enterBut").keyup(function(event) {
	if(event.keyCode == 13){
		$("#enterBut").click();
	}
})*/

function addMessage(user, text, date){
	var date = new Date(date);
	$("#chatEntries").append(
		'<div class="message">'
			+ '<div class="user">' + user + '</div>'
			+ '<div class="date">' + moment(date).format("MMMM Do YYYY, h:mm:ss a") + '</div>'
			+ '<div class="msgtxt">' + text + '</div>'
		+'</div>'
		)
;}

function postMessage(){
	if ($('#messageInput').val() != "") {
		var text = $('#messageInput').val();
		var date = new Date();
		socket.emit('message', {text: text, date: date});
		addMessage("Me", text, date);

		$('#messageInput').val("");
	}
}

function enterRoom(){
	if ($("#username").val() != "") {
		socket.emit('new user', $("#username").val());
		
		$('#leaveBut').show();
		$('#username').hide();
		$('#enterRoom').hide();	
		$('#chatEntries').show();
		$('#chatControls').show();	
		var input = document.getElementById("messageInput").focus();
		$('#username').val("");
	}
}

function leaveRoom(){
	socket.emit('leave room');
	
	$('#leaveBut').hide();
	$('#username').show();
	$('#enterRoom').show();	
	$('#chatEntries').hide();
	$('#chatControls').hide();
	$('#chatEntries').empty();
}

socket.on('login', function(data) {
	var messages = data.messages;
	for (var i = 0; i < messages.length; i++) {
		var message = messages[i];
		console.log(message);
		addMessage(message.user, message.text, message.date);
	}
})

socket.on('message', function(data) {
	addMessage(data['username'], data['text'], data['date']);
})

socket.on('leave room', function(data) {
	$("#chatEntries").append(
		'<div class="leavemessage"><p>' + data['username'] + ' left the room.' + '</p></div>'
	);
})

$(function(){
	var input = document.getElementById("enterBut").focus();
	$('#leaveBut').hide();
	$("#chatControls").hide();
	$("#enterRoom").click(function() {enterRoom()});
	$("#postBut").click(function() {postMessage()});
	$("#leaveBut").click(function() {leaveRoom()});
})