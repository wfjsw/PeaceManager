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
        if (msg.text && (msg.text.slice(0,1) == '/')) {
            var strget = msg.text.split(' ');
            switch (strget[0]) {
                case "/kickme":
                case "/help":

                // Normal Managed Group Part
                case "/modkick":
                case "/modban":
                case "/rules":
                case "/description":
                case "/promote":
                case "/demote":
                case "/invite":

                // Admin Group Part
                case "/assign-admingroup":
                case "/unassign-admingroup":
                case "/modlist":
                case "/ban":
                case "/unban":
                case "/kick":
                case "/add-admin":
                case "/remove-admin":
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
    msg,
    newProposal
}