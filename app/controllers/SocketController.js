const   path = require("path"),
        n = require("needle")
        _ = require("lodash"),
        env = require(path.resolve(`./config/env/${process.env.NODE_ENV}`));

class SocketController {

    constructor() {
        this.welcome = "in SocketController";
    }

    /*return length of specified room*/
    /*It tells from how many devices a user is login*/
    getSocketRoomLength(io, _roomName) {
        let room = io.sockets.adapter.rooms[_roomName];
        return room ? room.length : 0;
    }

    /*return sockets of specified room*/
    /*It tells from how many devices a user is login*/
    getSocketsOfRoom(io, _roomName) {
        let room = io.sockets.adapter.rooms[_roomName];
        return room ? room.sockets : [];
    }

    /*return friend online status (bool)*/
    isFriendOnline(friends, user) {
        return (friends[user.userId] && friends[user.userId].friends.includes(user.friendId)) ? true : false;
    }
}

module.exports = SocketController;