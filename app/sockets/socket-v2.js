'use strict';
const path                = require('path'),
	  _				  	  = require("lodash"),
	  SocketController    = require(path.resolve('./app/controllers/SocketController'));

class Sockets extends SocketController{
	constructor(io){
		super();
		this.io  = io;
		/*store online users*/
		this.onlineUsers = [];

		/*binding current scope*/
		this.init = this.init.bind(this);
	}

	init(){
		
		this.io.on('connection', (socket) => {
			/*socket connection created*/

			/*let current socket id know then it is connected to socket*/
			this.io.sockets.to(socket.id).emit("connected", {socket: socket.id});

			socket.on("disconnecting", () => {
				/*if user is going to disconnected then --(minus) room length*/
				if(this.io.sockets.adapter.sids[socket.id]){
					/*loop to find appropriate room to decrease the length*/
					for(let key in this.io.sockets.adapter.sids[socket.id]){
						/*If key=_id or Room exists in our online user list then decrease length*/
						if(_.find(this.onlineUsers, {_id : key})){
							/*room found*/
							let index = _.findIndex(this.onlineUsers, {_id : key});
							if(index>=0) {
								this.onlineUsers[index].length = this.getSocketRoomLength(this.io, key)-1;
								/*if length equals to zero*/
								if(this.onlineUsers[index].length===0){
									/*then remove user from online users array*/
									_.remove(this.onlineUsers, {"_id": key});

									/** logout user and set flag offline */
									this.setOnlineStatus({ _id: key, status: false })
										.then(r => true);

								}
							}
							/*exit the loop if condition matched*/
							break;
						}
					}
				}
			});

			

			socket.on("disconnect", () => {
				/*socket connection disconnected*/
				/*socket.id got disconnected*/
			});

			/*login action - inserting a user in online user object*/
			socket.on("web.login", (user) => {
				/*convert into object*/
				/*for android users*/
				if(typeof user === 'string') user = JSON.parse(user);
				
				/*make sure _id is provided*/
				if (!user || !user._id || !user.usertype) return false;
				if (user.usertype === 'trainee') user.usertype = 'appraiser';
				if (user.usertype === 'apprentice') user.usertype = 'inspector';

				if (!_.find(this.onlineUsers, { _id: user._id }) ){
					/*bind socket id with user data*/
					//user.socketid = socket.id;
					/*user room length*/
					// user.length = this.getSocketRoomLength(this.io, user._id)+1;
					user.length = 1;
					/*check if users is already online then skip the process*/
					/*otherwise insert into online user list*/
					this.onlineUsers.push({
						mobile : user.mobile,
						_id : user._id,
						usertype : user.usertype,
						length : user.length
					});

					/** call only once for a user when its going to login*/
					this.setOnlineStatus({ _id: user._id, status: true })
						.then(r => true);
				}

				/*join users to own room to communicate with themself - if same user is logged in multiple devices - ios, android, web*/
				/*a user can join the same room multiple times with different socket ids*/
				socket.join(user._id);
				socket.join(user.usertype);

				if(_.find(this.onlineUsers, { _id : user._id }) ){
					/*increase socket room length for a specific room*/
					let index = _.findIndex(this.onlineUsers, {_id : user._id});
					/*if user found then ++ length*/
					if(index >= 0){
						this.onlineUsers[index].length = this.getSocketRoomLength(this.io, user._id);
					}
				}

				this.io.sockets.to(user._id).emit("login", {message:"You logged into socket."});
			});

		});

		/* setInterval(() => {
			 console.log(this.onlineUsers);
			console.log(this.io.sockets.adapter.sids);
		}, 5000) */
	}
}

module.exports = Sockets;