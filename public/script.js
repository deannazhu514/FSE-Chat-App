var socket = io.connect();

function enterRoom(){
	if ($("#username").val() != "") {
		socket.emit('new user', $("#username").val());
		
		$('#leaveBut').show();
		$('#username').hide();
		$('#enterRoom').hide();	
		$('#chatEntries').show();
		$('#chatControls').show();	

		$('#username').val("");
	}
}

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
		$("#chatEntries").scrollTop($("#chatEntries")[0].scrollHeight);
		$('#messageInput').val("");
	}
}

function inputKeyUp(e) {
    e.which = e.which || e.keyCode;
    if(e.which == 13) {
    	postMessage();
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

	$('#messageInput').val("");
}

socket.on('login', function(data) {
	var messages = data.messages;
	for (var i = 0; i < messages.length; i++) {
		var message = messages[i];
		addMessage(message.user, message.text, message.date);
	}
	$("#chatEntries").scrollTop($("#chatEntries")[0].scrollHeight);
})

socket.on('message', function(data) {
	addMessage(data['username'], data['text'], data['date']);
})

socket.on('leave room', function(data) {
	$("#chatEntries").append(
		'<div class="leavemessage"><p>' + data['username'] + ' hast left the room.' + '</p></div>'
	);
})

$(function(){
/*	var input = document.getElementById("enterBut").focus();*/
	$('#leaveBut').hide();
	$("#chatControls").hide();
	$("#enterBut").click(function() {enterRoom()});
	$("#postBut").click(function() {postMessage()});
	$("#leaveBut").click(function() {leaveRoom()});
})