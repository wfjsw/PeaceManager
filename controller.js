var Telegram = require('telegram-bot');
var tg;
var EventEmitter = require('events').EventEmitter;

tg.on('message', function (msg) {
    if (msg.chat.id < 0) {
        
        // ****************************
        // Events for Group Changes
        if (msg.new_chat_participant) {
            var ret = {
                group: Math.abs(msg.chat.id),
                timestamp: msg.date,
                user: msg.new_chat_participant
            };
            EventEmitter.emit('new_chat_participant', ret);
        } else if (msg.new_chat_title) {
            var ret = {
                group: Math.abs(msg.chat.id),
                timestamp: msg.date,
                from: msg.from,
                title: msg.new_chat_title
            };
            EventEmitter.emit('new_chat_title', ret);
        } else if (msg.new_chat_photo) {
            var ret = {
                group: Math.abs(msg.chat.id),
                timestamp: msg.date,
                from: msg.from,
                title: msg.new_chat_photo
            };
            EventEmitter.emit('new_chat_photo', ret);
        } else if (msg.delete_chat_photo) {
            var ret = {
                group: Math.abs(msg.chat.id),
                timestamp: msg.date,
                from: msg.from
            };
            EventEmitter.emit('delete_chat_photo', ret);
        }
        // OK end.
        // ****************************
        
        // ****************************
        // Begin InGroup Command Process
        if (msg.text && (msg.text.slice(0, 1) == '/')) {
            var strget = msg.text.split(' ');
            var ret = {
                group: Math.abs(msg.chat.id),
                user: msg.from,
                timestamp: msg.date
            };
            switch (strget[0]) {
                case "/kickme":
                    ret.target = msg.from;
                    ret.type = "kick";
                    ret.require_permission: "anyone";
                    EventEmitter.emit('managed_cmd_request', ret);
                    break;
                case "/help":

                // Normal Managed Group Part
                case "/modkick":
                    if (msg.reply_to_message) {
                        ret.target = msg.reply_to_message.from;
                        ret.type = "kick";
                        ret.require_permission: "moderator";
                        EventEmitter.emit('managed_cmd_request', ret);
                    }
                    break;
                case "/modban":
                    if (msg.reply_to_message) {
                        ret.target = msg.reply_to_message.from;
                        ret.type = "ban";
                        ret.require_permission: "moderator";
                        EventEmitter.emit('managed_cmd_request', ret);
                    }
                    break;
                case "/rules":
                case "/description":
                case "/promote":
                    if (msg.reply_to_message) {
                        ret.target = msg.reply_to_message.from;
                        ret.type = "promote";
                        ret.require_permission: "admin";
                        EventEmitter.emit('managed_cmd_request', ret);
                    }
                    break;
                case "/demote":
                    if (msg.reply_to_message) {
                        ret.target = msg.reply_to_message.from;
                        ret.type = "demote";
                        ret.require_permission: "admin";
                        EventEmitter.emit('managed_cmd_request', ret);
                    }
                    break;
                case "/invite":
                case "/modlist":

                // Admin Group Part
                case "/define2admingroup":
                case "/assign":
                case "/deassign":
                case "/ban":
                case "/unban":
                case "/kick":
                case "/add-admin":
                case "/remove-admin":
                case "/kickall":
                case "/join":
                case "/settings":

                // .... Not Implemented
                // case "/create-group":
                // case "/export-link"
                // case "/resolve-username"
                // case "/group-info"

                // .... special cases
                case "/set":
                case "/list":

                // Headquarter
                case "/block":
                    ret.target = msg.from;
                    ret.type = "kick";
                    ret.require_permission: "headquarter";
                    EventEmitter.emit('managed_cmd_request', ret);
                break;
                case "/unblock":
            }
        }

    }
})


var outinterface = {
    init: function (config) {
        return new Promise(function (resolve, reject) {
            tg = new Telegram(config.token);
            tg.start();
            tg.getMe()
			.then(function (res) {
                resolve(res);
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    msg: function (msgobj) {
        return tg.sendMessage(msgobj);
    }
    newProposal
}