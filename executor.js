var EventEmitter = require('events').EventEmitter;
var Promise = require('promise');
var net = require('net');
var clientupd;
var clientcmd;
var w_sending = new Array(); // 用于发送前队列
var w_waiting = new Array(); // 用于等待回应队列
var connected = false;

function initqueue() {
    // Start The Interval
}

function sendqueue() {
    
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
        reject("");
    }
}

var outinterface = {
    init: function (config) {
              return new Promise(function (resolve, reject) {
                clientupd = net.connect({port: config.port, host: config.host || "127.0.0.1"}, function() { 
                    clientcmd = net.connect({port: config.port, host: config.host || "127.0.0.1"}, function() { 
                        connected = true;
                        initqueue();
                        resolve("connected");
                    });
                });
              })
         },
    newgroup: function (name, f_member) {
        return new Promise(function (resolve, reject) {
            newmsg("create_group_chat " + name + f_member, resolve, reject);
        });
    }
    joingroup: function (groupid, memberid, forwardmsg) {
        return new Promise(function (resolve, reject){
            newmsg("chat_add_user " + groupid + memberid + forwardmsg, resolve, reject);
        });
    }
    kickuser: function (groupid, memberid) {
        return new Promise(function (resolve, reject){
            newmsg("chat_del_user " + groupid + memberid, resolve, reject);
        });
    }
    
};