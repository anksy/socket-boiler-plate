'use strict';

require('dotenv').config({silent: true});
const express 		= require('express'),
	helmet 			= require('helmet'),
	process 		= require('process'),
	path 			= require('path'),
	bodyParser 		= require('body-parser'),
	cors 			= require('cors'),
	http 			= require('http'),
	socketio 		= require('socket.io'),
	socketController=require('./app/sockets/socket-v2'),
	env				= require(path.resolve(`./config/env/${process.env.NODE_ENV}`));
	
class ioServer {
	constructor(){
		/*defining PORT for application*/
		this.port = env.server.IO || 8020;
		/*init express app*/
		this.app    = express();
		/*init a sever*/
		this.server = http.createServer(this.app);
		/*init helmets for securing http headers*/
		this.helmet = helmet();
		/*init cors for multiple origin requests*/
		this.cors   = cors();
		/*init socket instance*/
		this.io = socketio(this.server);
	}

	secureHeaders(){
		/*protect http headers of server through Helmet*/
		this.app.use(this.helmet);
	}

	appConfig(){
		/*allow application to read and send data in body*/
		this.app.use(bodyParser.json({limit: '50mb'}));
		this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
	}

	enablingCors(){
		/*enable application CORS*/
		this.app.use(this.cors);
	}

	initSocket(){
		let socketCont = new socketController(this.io).init();
	}

	init(){
		this.app.get("/", (req, res) => res.end("Socket Point"));
		/*Listen on Server Port*/
		this.secureHeaders();
		this.appConfig();
		this.enablingCors();
		this.initSocket();

		process.on('unhandledRejection', (reason, p) => {
			//console.log('Unhandled Rejection at: ioserver ==>', p, 'reason:', reason);
			// application specific logging, throwing an error, or other logic here
		});

		this.server.listen(this.port, () => {
			console.log('listening on', this.server.address().port);
		});
	}
}

new ioServer().init();