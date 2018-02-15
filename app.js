const express = require('express');
const bp = require('body-parser');
const request = require('request');

const APP_TOKEN = 'EAAFfHja59zoBAKK6I6yNpa0F2iAsdxPn1EXA6o60Sl7Tw4lcd3tattNK3UZARlsjzmMlLcFUhZB1ZBH7GamYjFhaBaRjADYMZC0TK9i56C5TMtszoDJDPMA0tko2x7sd6a6tC9OgFhIHsI7KD3QgLUgrGdXEBsVcWmZBv3YZA02QZDZD';

var app = express();

app.use(bp.json());

app.listen(3000, function(){
	console.log('Server listen localhost in port: 3000');
});

app.get('/', function(req, res){
	res.send('prueba de llamada get');
});

app.get('/webhook', function(req, res){
	if(req.query['hub.verify_token'] == 'hello_token'){
		res.send(req.query['hub.challenge']);
	}else{
		res.send('No tienes acceso');
	}
});

app.post('/webhook', function(req, res){
	var data = req.body;
	if(data.object == 'page'){
		data.entry.forEach(function(pageEntry){
			pageEntry.messaging.forEach(function(messagingEvent){
				if(messagingEvent.message){
					var senderID = messagingEvent.sender.id;
					var messageText = messagingEvent.message.text;
					
					var messageData = {
						recipient : {
							id: senderID
						},
						message: {
							text: 'solo se repetir: ' + messageText
						}
					}
					request({
						uri: 'https://graph.facebook.com/v2.6/me/messages',
						qs: {access_token: APP_TOKEN},
						method: 'POST',
						json: messageData
					}, function(error, response, data){
						if(error)
							console.log('no es posible enviar el mensaje');
						else
							console.log('Mensaje enviado');
					});
				}
			});
		});
	}
	res.sendStatus(200);
});