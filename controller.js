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
                groupfrom: Math.abs(msg.chat.id),
                user: msg.from,
                timestamp: msg.date
            };
            switch (strget[0]) {
                case "/kickme":
                    ret.target = msg.from;
                    ret.type = "kick";
                    ret.area = "managed";
                    ret.require_permission = "anyone";
                    EventEmitter.emit('cmd_request', ret);
                    break;
                // case "/help":

                // Normal Managed Group Part
                case "/modkick":
                    if (msg.reply_to_message) {
                        ret.target = msg.reply_to_message.from;
                        ret.type = "kick";
                        ret.area = "managed";
                        ret.require_permission = "moderator";
                        EventEmitter.emit('cmd_request', ret);
                    }
                    break;
                case "/modban":
                    if (msg.reply_to_message) {
                        ret.target = msg.reply_to_message.from;
                        ret.type = "ban";
                        ret.area = "managed";
                        ret.require_permission = "moderator";
                        EventEmitter.emit('cmd_request', ret);
                    }
                    break;
                case "/rules":
                case "/description":
                case "/promote":
                    if (msg.reply_to_message) {
                        ret.target = msg.reply_to_message.from;
                        ret.type = "promote";
                        ret.area = "managed";
                        ret.require_permission = "admin";
                        EventEmitter.emit('cmd_request', ret);
                    }
                    break;
                case "/demote":
                    if (msg.reply_to_message) {
                        ret.target = msg.reply_to_message.from;
                        ret.type = "demote";
                        ret.area = "managed";
                        ret.require_permission = "admin";
                        EventEmitter.emit('cmd_request', ret);
                    }
                    break;
                case "/invite":
                    if (!isNaN(strget[1])) {
                        ret.target = strget[1];
                        ret.type = "invitehere";
                        ret.area = "managed";
                        ret.require_permission = "anyone";
                        EventEmitter.emit('cmd_request', ret);
                    } else {
                        // Only ID is allowed
                    }
                    break;
                case "/modlist":
                case "/groupinfo":

                // Admin Group Part
                case "/define2admingroup":
                    ret.target = Math.abs(msg.chat.id);
                    ret.type = "define_to_admin_group";
                    ret.area = "any";
                    ret.require_permission = "anyone";
                    EventEmitter.emit('cmd_request', ret);
                    break;
                case "/claim": // ID
                    if (!isNaN(strget[1])) {
                        ret.target = parseInt(strget[1]);
                        ret.type = "claim_to_admin_group";
                        ret.area = "admingroup";
                        ret.require_permission = "admin";
                        EventEmitter.emit('cmd_request', ret);
                    } else {
                        // Only ID is allowed
                    }
                    break;
                case "/unclaim": // ID
                    if (!isNaN(strget[1])) {
                        ret.target = parseInt(strget[1]);
                        ret.type = "unclaim_to_admin_group";
                        ret.area = "admingroup";
                        ret.require_permission = "admin";
                        EventEmitter.emit('cmd_request', ret);
                    } else {
                        // Only ID is allowed
                    }
                    break;
                case "/ban": // ID, TargetIsObject, HaveToDo
                    if (!isNaN(strget[1]) && !isNaN(strget[2])) { //TODO: Should Add judgement about existence of the arguments.
                        ret.target = {
                            user: parseInt(strget[1]),
                            group: parseInt(strget[2])
                        };
                        ret.type = "ban";
                        ret.area = "admingroup";
                        ret.require_permission = "admin";
                        EventEmitter.emit('cmd_request', ret);
                    } else {
                        // Only ID is allowed
                    }
                    break;
                case "/fwdban": // Object, TargetIsObject
                    if (msg.reply_to_message && msg.reply_to_message.forward_from && !isNaN(strget[1])) {
                        ret.target = {
                            user: msg.reply_to_message.forward_from,
                            group: parseInt(strget[2])
                        };
                        ret.type = "ban";
                        ret.area = "admingroup";
                        ret.require_permission = "admin";
                        EventEmitter.emit('cmd_request', ret);
                    }
                    break;
                case "/banall": // ID
                    if (!isNaN(strget[1])) {
                        ret.target = parseInt(strget[1]);
                        ret.type = "banall";
                        ret.area = "admingroup";
                        ret.require_permission = "admin";
                        EventEmitter.emit('cmd_request', ret);
                    } else {
                        // Only ID is allowed
                    }
                    break;
                case "/unban": // ID, TargetIsObject
                    if (!isNaN(strget[1]) && !isNaN(strget[2])) {
                        ret.target = {
                            user: parseInt(strget[1]),
                            group: parseInt(strget[2])
                        };
                        ret.type = "unban";
                        ret.area = "admingroup";
                        ret.require_permission = "admin";
                        EventEmitter.emit('cmd_request', ret);
                    } else {
                        // Only ID is allowed
                    }
                    break;
                case "/fwdunban": // Object, TargetIsObject
                    if (msg.reply_to_message && msg.reply_to_message.forward_from && !isNaN(strget[1])) {
                        ret.target = {
                            user: msg.reply_to_message.forward_from,
                            group: parseInt(strget[2])
                        };
                        ret.type = "unban";
                        ret.area = "admingroup";
                        ret.require_permission = "admin";
                        EventEmitter.emit('cmd_request', ret);
                    }
                    break;
                case "/unbanall": // ID
                    if (!isNaN(strget[1])) {
                        ret.target = parseInt(strget[1]);
                        ret.type = "unbanall";
                        ret.area = "admingroup";
                        ret.require_permission = "admin";
                        EventEmitter.emit('cmd_request', ret);
                    } else {
                        // Only ID is allowed
                    }
                    break;
                case "/listbanning":
                case "/listmanaged":
                    ret.target = msg.from;
                    ret.type = "listmanagedgroup";
                    ret.area = "managed";
                    ret.require_permission = "anyone";
                    EventEmitter.emit('cmd_request', ret);
                    break;
                case "/kick": // ID
                    if (!isNaN(strget[1]) && !isNaN(strget[2])) {
                        ret.target = parseInt(strget[1]);
                        ret.type = "ban";
                        ret.area = "admingroup";
                        ret.require_permission = "admin";
                        EventEmitter.emit('cmd_request', ret);
                    } else {
                        // Only ID is allowed
                    }
                    break;
                case "/add-admin":
                case "/remove-admin":
                case "/join":
                case "/settings":
                case "/getid":

                // .... Not Implemented
                case "/create-group":
                // case "/export-link"
                // case "/resolve-username"
                // case "/group-info"

                // .... special cases
                case "/set":
                case "/list":

                // Headquarter
                case "/block":
                    ret.target = strget[1];
                    ret.type = "block";
                    ret.area = "any";
                    ret.require_permission = "headquarter";
                    EventEmitter.emit('cmd_request', ret);
                break;
                case "/unblock":
                    ret.target = strget[1];
                    ret.type = "unblock";
                    ret.area = "any";
                    ret.require_permission = "headquarter";
                    EventEmitter.emit('cmd_request', ret);
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
    },
    newProposal: function (content, isspecial) {

    }
};