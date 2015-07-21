var EventEmitter = require('events').EventEmitter;
var Promise = require('promise');
var net = require('net');
var clientupd, clientcmd, queuetimer;
var w_sending = new Array(); // 用于发送前队列
var w_waiting = new Array(); // 用于等待回应队列
var connected = false;

function initqueue() {
    // Start The Interval
    queuetimer = setInterval(sendqueue, 300);
}

function sendqueue() {
    if (w_sending.length>0){
        var thismsg = w_sending.shift();
        // Write to control socket
        w_waiting.push(thismsg);
    }
}

function newmsg(command, resolve, reject) {
    if (connected = true) {
        var msg = {
            command: command,
            callback: {
                resolve: resolve,
                reject: reject
            }
        };
        w_sending.push(msg);
    } else {
        reject("{'error': true}");
        console.log("Unconnected!");
    }
}

var outinterface = {
    init: function (config) {
              return new Promise(function (resolve, reject) {
                clientupd = net.connect({port: config.port, host: config.host || "127.0.0.1"}, function() { 
                    clientcmd = net.connect({port: config.port, host: config.host || "127.0.0.1"}, function() { 
                        connected = true;
                        // Set clientupd as the main session [ update session ]
                        initqueue();
                        resolve("connected");
                    });
                });
              })
         },
    newgroup: function (name, f_member) {
        return new Promise(function (resolve, reject) {
            newmsg("create_group_chat " + name + " " + f_member, resolve, reject);
        });
    },
    joingroup: function (chat, memberid, forwardmsg) {
        return new Promise(function (resolve, reject){
            newmsg("chat_add_user " + chat + " " + memberid + " " + forwardmsg, resolve, reject);
        });
    },
    kickuser: function (chat, memberid) {
        return new Promise(function (resolve, reject){
            newmsg("chat_del_user " + chat + " " + memberid, resolve, reject);
        });
    },
    msg: function (peer, text){
        return new Promise(function (resolve, reject){
            newmsg("msg " + peer + " " + text, resolve, reject);
        });
    },
    group_setphoto: function (chat, filename) {
        return new Promise(function (resolve, reject){
            newmsg("chat_set_photo " + chat + " " + filename, resolve, reject);
        });
    },
    group_setname: function (chat, name) {
        return new Promise(function (resolve, reject){
            newmsg("rename_chat " + chat + " " + name, resolve, reject);
        });
    },
    resolvname: function (username) {
        return new Promise(function (resolve, reject){
            newmsg("resolve_username " + username, resolve, reject);
        });
    },
    block: function (user) {
        return new Promise(function (resolve, reject){
            newmsg("block_user " + user, resolve, reject);
        });
    },
    unblock: function (user) {
        return new Promise(function (resolve, reject){
            newmsg("unblock_user " + user, resolve, reject);
        });
    }
};