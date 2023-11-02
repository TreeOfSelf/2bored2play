//Requires
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const Vec3 = require('vec3');
const mime = require('mime');

//Definitions
var sockets = [];
var webServer;

function start(bot){

	bot.on('chunkColumnLoad',function(pos){
		send_all(['chunk',pos.x/16,pos.z/16,bot.world.async.columns[pos.x/16+','+pos.z/16].toJson()]);
	});
	
	bot.on('physicTick',function(){
		
		send_all([0,0,bot.entity.position.x,bot.entity.position.z,-bot.entity.position.y-2,-bot.entity.yaw,-bot.entity.pitch,bot.entity.onGround]);
		
	});
	
	bot.on('blockUpdate',function(oldBlock,newBlock){
		send_all(['block_change',newBlock.position.x,newBlock.position.y,newBlock.position.z,newBlock.type]);
	});

	if(webServer==null){
		webServer = http.createServer(function (req, res) {
		  fs.readFile(__dirname+'/html/' + req.url, function (err,data) {
			if (err) {
			  res.writeHead(404);
			  res.end(JSON.stringify(err));
			  return;
			}
			
			res.setHeader("Content-Type", mime.getType(__dirname+'/html/' + req.url)); //Solution!
			res.writeHead(200);
			res.write(data);
			res.end();
		  });
		}).listen(6969);

		const wsServer = new WebSocket.Server({
			server : webServer
		});
		
		
		wsServer.on('connection', function connection(ws) {
			
			for(column in bot.world.async.columns){
				let coords = column.split(',');
				send(ws,['chunk',coords[0],coords[1],bot.world.async.columns[column].toJson()]);
			}
			sockets.push(ws);
			ws.on('message', function incoming(message) {
				console.log(message.toString());
			});

		});
	
	}


}


function send_all(data){
	for(var k=0;k<sockets.length;k++){
		sockets[k].send(JSON.stringify(data));
	}
}

function send(ws,data){
	ws.send(JSON.stringify(data));
}

module.exports={
	start : start,
}
