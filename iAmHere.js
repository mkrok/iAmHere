/*jshint strict: true */
/*jshint esversion: 6 */
const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = 'd3FC7ae3';
const mysql = require('mysql');
const path = require('path');
const cookie = require('cookie');
const plain = require('sanitize-html');
const debug = require('debug')('mkrok');
const name = 'iAmHere';
debug('booting %s', name);
const logStream = fs.createWriteStream(null,
        {
    flags: 'r+',
    defaultEncoding: 'utf8',
    fd: fs.openSync(path.join(__dirname, 'log/iAmhere-info.log'), 'a+'),
    mode: 0o666,
    autoClose: true
});
const errStream = fs.createWriteStream(null,
        {
    flags: 'r+',
    defaultEncoding: 'utf8',
    fd: fs.openSync(path.join(__dirname, 'log/iAmHere-error.log'), 'a+'),
    mode: 0o666,
    autoClose: true
});
const logger = new console.Console(logStream, errStream);
const pingInterval = 15000;
var re = new RegExp('^[A-Za-z0-9_]{3,16}$');
var timestamp;
var rooms = ["Earth"];
var db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'mkrok',
    password: 'mkrok s3cr37',
    database: 'iamhere',
    charset: 'utf8mb4'
});

db.on('error', function (err) {
    'use strict';
    logger.log(err.code);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.get('/', function (req, res) {
    'use strict';
    res.render('index');
});

http.listen(3030, function () {
    'use strict';
    console.log('listening on *:3030');
});
/************************************************************
*
*   Functions
*
*************************************************************/

setInterval(function() {
    'use strict';
    for(var i = rooms.length - 1; i > 0; --i) {
       if( findUsersConnected(rooms[i]).length === 0 ) {
           rooms.splice(i,1);
       }
    }
}, 60000);

function encrypt(text) {
    'use strict';
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    'use strict';
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function dateFormat(date) {
    'use strict';
    var hours = date.getHours();
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes;
    return date.getMonth() + 1 + "/" + date.getDate() + " " + strTime;
}

function storeChat(timestamp, room, user, message) {
    'use strict';
    var row = [timestamp, room, user, message];
    db.query('INSERT INTO _13b SET ba=?, bb=?, bc=?, bd=?', row, function (err) {
        if (err) {
            throw err;
        }
    });
}

function loadChat(socket, room) {
    'use strict';
    var chat = [];
    db.query('SELECT * FROM _13b WHERE bb = ?', [room], function (err, rows) {
        if (err) {
            throw err;
        }
        rows.forEach(function (row) {
            var message = {};
            message.timestamp = row.ba;
            message.sender = row.bc;
            message.text = row.bd;
            chat.push(message);
        });
        socket.emit('db_messages', chat);
    });
}

function storePrivateMessage(timestamp, sender, receiver, message) {
    'use strict';
    var row = [timestamp, sender, receiver, message];
    db.query('INSERT INTO _13c SET ca=?, cb=?, cc=?, cd=?', row, function (err) {
        if (err) {
            throw err;
        }
    });
}

function loadPrivateMessage(socket, sender, receiver) {
    'use strict';
    var privateChat = [];
    db.query('SELECT * FROM _13c WHERE ((cb = ? AND cc = ?) OR (cc = ? AND cb = ?))',
        [sender, receiver, sender, receiver], function (err, rows) {
        if (err) {
            throw err;
        }
        rows.forEach(function (row) {
            var privateMessage = {};
            privateMessage.timestamp = row.ca;
            privateMessage.sender = row.cb;
            privateMessage.receiver = row.cc;
            privateMessage.text = row.cd;
            privateChat.push(privateMessage);
        });
        socket.emit('db_privateChat', privateChat);
    });
}

function findUsersConnected(room, namespace) {
    'use strict';
    var res = [];
    var ns = io.of(namespace || "/");    //  "/" is the default namespace

    if (ns) {
        Object.keys(ns.connected).forEach(function (id) {
            if (room) {
                var roomKeys = Object.keys(ns.connected[id].rooms);
                roomKeys.forEach(function (key) {
                    if (key === room) {
                        res.push(ns.connected[id].username);
                    }
                });
            } else {
                res.push(ns.connected[id].username);
            }
        });
    }
    return res.sort();
}

function findUserPosition(user, namespace) {
    'use strict';
    var pos = {};
    var ns = io.of(namespace || "/");
    Object.keys(ns.connected).forEach(function (id) {
        if (ns.connected[id].username === user) {
            pos = ns.connected[id].pozycja;
            return pos;
        }
    });
    return pos;
}

function findUsersId(room, namespace) {
    'use strict';
    var res = [];
    var ns = io.of(namespace || "/");    // domyślna namespace to "/"

    if (ns) {
        //for (var id in ns.connected) {
        Object.keys(ns.connected).forEach(function (id) {
            if (room) {
                var roomKeys = Object.keys(ns.connected[id].rooms);
                roomKeys.forEach(function (key) {
                    if (key === room) {
                        res.push({username: ns.connected[id].username, id: ns.connected[id].id});
                    }
                });
            } else {
                res.push({username: ns.connected[id].username, id: ns.connected[id].id});
            }
        });
    }
    return res.sort();
}

function sendPm(sender, message) {
    'use strict';
    var pm = message.split(' ');
    var ok = false;
    if (pm[0] !== '/pm') {
        return ok;
    }
    var usersId = findUsersId(); // array of {username, id} of all users connected to server
    usersId.forEach(function (user) {
        if (user.username === pm[1]) {
            timestamp = dateFormat(new Date());
            io.to(user.id).emit('pm', timestamp, sender, pm.slice(2).join(' '));
            storePrivateMessage(timestamp, sender, user.username, pm.slice(2).join(' '));
            ok = true;
        }
    });
    return ok;
}

function sendPrivateMessage(sender, receiver, message) {
    'use strict';
    var usersId = findUsersId(); // array of {username, id} of all users connected to server
    usersId.forEach(function (user) {
        if (user.username === receiver) {
            timestamp = dateFormat(new Date());
            io.to(user.id).emit('privateChat', timestamp, sender, receiver, message);
        }
    });
}

function roomExists(room) {
    'use strict';
    for (var i=0; i < rooms.length; i++) {
        if ( rooms[i].toLowerCase() === room.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function findMarkers( grupa, namespace ){
    'use strict';
    var res = [];
    var ns = io.of(namespace || "/");    // default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            var roomKeys = Object.keys(ns.connected[id].rooms);
                for(var i in roomKeys) {
                    if(roomKeys[i] === grupa) {
                        res.push( {username:ns.connected[id].username, pozycja:ns.connected[id].pozycja}  );
                    }  //  if(roomKeys[i] == roomId)
                } // for(var i in roomKeys)
        } // for(var i in roomKeys)
    }  // if (ns)
    return res;
}

/************************************************************
*
*   socket.io
*
*************************************************************/
setInterval(function() {
    'use strict';
    console.log(Date()+ " ping! ");
    io.emit('gdzie');
    setTimeout(function() {
        for (var k=0; k < rooms.length; k++) {
            var markery = findMarkers(rooms[k]);
            console.log('Sending data to group ' + rooms[k] + '(' + markery.length + ')');
            io.to(rooms[k]).emit('markers', markery, rooms[k]);
        }
    }, 2000);
}, pingInterval);

io.on('connection', function (socket) {
    'use strict';
    timestamp = dateFormat(new Date());
    console.log('\n' + timestamp + ' ' + socket.id + ' connected from ' +
             socket.handshake.address.substr(7) + '\nuser-agent: ' +
            socket.handshake.headers['user-agent']);
    logger.log('\n' + timestamp + ' ' + socket.id + ' connected from ' +
            socket.handshake.address.substr(7) + '\nuser-agent: ' +
            socket.handshake.headers['user-agent']);
    socket.isAuthorized = false;
    //***************************************************
    //
    // Cookie authorization
    //
    //***************************************************
    if (socket.request.headers.cookie) {
        var cookies = cookie.parse(socket.request.headers.cookie, {decode: true});
        if (cookies.iah) {
            var username = decrypt(cookies.iah);
            username = plain(username);
            db.query('SELECT ab, af, ah FROM _13a WHERE ab=?', [username], function (err, user) {
                if (err) {
                    return console.log(err);
                }
                if (user[0]) {
                    socket.username = username;
                    socket.isAuthorized = true;
                    socket.room = user[0].ah || rooms[0];
                    socket.join(socket.room);
                    if (socket.room !== rooms[0]) {
                        rooms.push(socket.room);
                    }
                    if (username === 'Hogwarts') {
                        socket.pozycja = {lat: 50.0898, lng: 19.9814};
                    } else {
                        socket.pozycja = {lat: 50.061667, lng: 19.937222};
                    }
                    socket.emit('authAck', socket.username);
                    if (user[0].af === 1) {
                        socket.admin = true;
                        socket.emit('adminAck');
                    }
                    socket.emit('updaterooms', rooms, socket.room);
                    socket.broadcast.to(socket.room).emit('chat', timestamp, 'SERVER', socket.username + ' has connected');
                    loadChat(socket, socket.room);
                    setTimeout(function () {
                        if (socket.handshake.headers['user-agent'] === 'node-XMLHttpRequest') {
                            socket.emit('chat', timestamp, 'SERVER', 'Welcome ' + socket.username + ', you seem to be a plain text client!');
                            socket.emit('chat', timestamp, 'SERVER', 'Type "/j planet_name" to change the planet');
                        } else {
                            socket.emit('chat', timestamp, 'SERVER', 'Welcome ' + socket.username);
                            socket.emit('chat', timestamp, 'SERVER', 'Type "/j planet_name" to change the planet');
                        }
                    }, 500);
                    console.log(timestamp + ' ' + socket.username + ' logged in from ' + socket.handshake.address.substr(7));
                    logger.log(timestamp + ' ' + socket.username + ' logged in from ' + socket.handshake.address.substr(7));
                    db.query('UPDATE _13a SET ad=?, ag=?, ah=? WHERE ab=?', [timestamp, socket.handshake.address.substr(7), socket.room, socket.username], function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                }
            });
        }
    }   // end of cookie auth

    socket.on('authToken', function (authToken) {
        var username = decrypt(authToken);
            username = plain(username);
            db.query('SELECT ab, af, ah FROM _13a WHERE ab=?', [username], function (err, user) {
                if (err) {
                    return console.log(err);
                }
                if (user[0]) {
                    socket.username = username;
                    socket.isAuthorized = true;
                    socket.room = user[0].ah || rooms[0];
                    socket.join(socket.room);
                    if (socket.room !== rooms[0]) {
                        rooms.push(socket.room);
                    }
                    if (username === 'Hogwarts') {
                        socket.pozycja = {lat: 50.0898, lng: 19.9814};
                    } else {
                        socket.pozycja = {lat: 50.061667, lng: 19.937222};
                    }
                    socket.emit('authAck', socket.username);
                    if (user[0].af === 1) {
                        socket.admin = true;
                        socket.emit('adminAck');
                    }
                    socket.emit('updaterooms', rooms, socket.room);
                    socket.broadcast.to(socket.room).emit('chat', timestamp, 'SERVER', socket.username + ' has connected');
                    loadChat(socket, socket.room);
                    setTimeout(function () {
                        if (socket.handshake.headers['user-agent'] === 'node-XMLHttpRequest') {
                            socket.emit('chat', timestamp, 'SERVER', 'Welcome ' + socket.username + ', you seem to be a plain text client!');
                            socket.emit('chat', timestamp, 'SERVER', 'Type "/j planet_name" to change the planet');
                        } else {
                            socket.emit('chat', timestamp, 'SERVER', 'Welcome ' + socket.username);
                            socket.emit('chat', timestamp, 'SERVER', 'Type "/j planet_name" to change the planet');
                        }
                    }, 500);
                    console.log(timestamp + ' ' + socket.username + ' logged in from ' + socket.handshake.address.substr(7));
                    logger.log(timestamp + ' ' + socket.username + ' logged in from ' + socket.handshake.address.substr(7));
                    db.query('UPDATE _13a SET ad=?, ag=?, ah=? WHERE ab=?', [timestamp, socket.handshake.address.substr(7), socket.room, socket.username], function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                }
            });
    });

    socket.on('authorize', function (username, password) {
      if (re.test(username) && re.test(password)) {
        username = plain(username, {
            allowedTags: [],
            allowedAttributes: []
        });
        password = plain(password, {
            allowedTags: [],
            allowedAttributes: []
        });
        if (username === null || username === undefined) {
            socket.emit('err', 'username=null received');
        }
        if (password === null || password === undefined) {
            socket.emit('err', 'password=null received');
        }
        db.query('SELECT ac, ae, af, ah FROM _13a WHERE ab=?', [username], function (err, user) {
            if (err) {
                return console.log(err);
            }
            if (user[0]) {
                var testHash = crypto.createHash('sha512')
                    .update(user[0].ae + password)
                    .digest('hex');
                if (testHash === user[0].ac) {
                    console.log(timestamp + ' ' + username + ' logged in from ' + socket.handshake.address.substr(7));
                    logger.log(timestamp + ' ' + username + ' logged in from ' + socket.handshake.address.substr(7));
                    socket.isAuthorized = true;
                    socket.username = username;
                    socket.room = user[0].ah || rooms[0];
                    socket.join(socket.room);
                    socket.emit('updaterooms', rooms, socket.room);
                    if (socket.room !== rooms[0]) {
                        rooms.push(socket.room);
                    }
                    if (username === 'Hogwarts') {
                        socket.pozycja = {lat: 50.0898, lng: 19.9814};
                    } else {
                        socket.pozycja = {lat: 50.061667, lng: 19.937222};
                    }
                    socket.broadcast.to(socket.room).emit('chat', timestamp, 'SERVER', socket.username + ' has connected');
                    loadChat(socket, socket.room);
                    setTimeout(function () {
                        if (socket.handshake.headers['user-agent'] === 'node-XMLHttpRequest') {
                            socket.emit('chat', timestamp, 'SERVER', 'Welcome ' + socket.username + ', you seem to be a plain text client!');
                        } else {
                            socket.emit('chat', timestamp, 'SERVER', 'Welcome ' + socket.username);
                        }
                    }, 500);
                    db.query('UPDATE _13a SET ad=?, ag=? WHERE ab=?', [timestamp, socket.handshake.address.substr(7), socket.username], function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                    var cookieAck = cookie.serialize('iah', encrypt(username));
                    socket.emit('cookie', cookieAck);
                    socket.emit('authToken', encrypt(username));
                    socket.emit('authAck', username);
                    if (user[0].af === 1) {
                        socket.admin = true;
                        socket.emit('adminAck');
                    }
                } else {  // passwords don't match
                    console.log('ERROR: unauthorized login from ' + socket.handshake.address.substr(7) +
                            ', username: "' + username + '"');
                    logger.log('ERROR: unauthorized login from ' + socket.handshake.address.substr(7) +
                            ', username: "' + username + '"');
                    socket.emit('err', 'Unauthorized, try again');
                }
            } else {  // username not found
                console.log('ERROR: unauthorized login from ' + socket.handshake.address.substr(7) +
                        ', username: "' + username + '"');
                logger.log('ERROR: unauthorized login from ' + socket.handshake.address.substr(7) +
                        ', username: "' + username + '"');
                socket.emit('err', 'Unauthorized, try again');
            }
        });
      }  //  if (re.test(username) && re.test(password))
    });

    socket.on('register', function (username, password, salt) {
      if (re.test(username) && re.test(password)) {
        timestamp = dateFormat(new Date());
        username = plain(username, {
            allowedTags: [],
            allowedAttributes: []
        });
        password = plain(password, {
            allowedTags: [],
            allowedAttributes: []
        });
        var hashPass = crypto.createHash('sha512')
            .update(salt + password)
            .digest('hex');
        db.query('SELECT ac, ae FROM _13a WHERE ab=?', [username], function (err, user) {
            if (err) {
                return console.log(err);
            }
            if (user[0]) {
                console.log('ERROR: duplicate entry from: ' + socket.handshake.address.substr(7) +
                        ', username: "' + username + '"');
                logger.log('ERROR: duplicate entry from: ' + socket.handshake.address.substr(7) +
                        ', username: "' + username + '"');
                socket.emit('err', 'Username exists, try again');
            } else {
                db.query('INSERT INTO _13a ' + 'SET ab=?, ac=?, ae=?, aa=?',
                        [username, hashPass, salt, timestamp], function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    socket.emit('regAck');
                });
            }
        });
      }  // if (re.test(username) && re.test(password))
    });

    socket.on('switchRoom', function (newroom) {
      if (re.test(username)) {
        if (!socket.isAuthorized) {
            socket.emit('badSocket');
            socket.disconnect();
        }
        newroom = plain(newroom, {
            allowedTags: [],
            allowedAttributes: []
        });
        timestamp = dateFormat(new Date());
        socket.broadcast.to(socket.room).emit('chat', timestamp, 'SERVER', socket.username + ' has left this room');
        socket.leave(socket.room);
        socket.join(newroom);
        socket.room = newroom;
        socket.emit('chat', timestamp, 'SERVER', 'you have connected to ' + newroom);
        loadChat(socket, socket.room);
        socket.broadcast.to(newroom).emit('chat', timestamp, 'SERVER', socket.username + ' has joined this room');
        socket.emit('updaterooms', rooms, newroom);
      } // if (re.test(username))
    });

    socket.on('disconnect', function () {
        if (socket.room) {
            timestamp = dateFormat(new Date());
            socket.leave(socket.room);
            //console.log(timestamp + ' ' + socket.username + ' disconnected');
            socket.broadcast.to(socket.room).emit('chat', timestamp, 'SERVER', socket.username + ' has disconnected');
            //storeChat(timestamp, socket.room, 'SERVER', socket.username + ' disconnected');
        }
    });

    socket.on('chat', function (user, message) {
        if (!socket.isAuthorized) {
            socket.emit('badSocket');
            socket.disconnect();
        }
        user = plain(user, {
            allowedTags: [],
            allowedAttributes: []
        });
        message = plain(message, {
            allowedTags: [],
            allowedAttributes: []
        });
        if (message !== '') {
            timestamp = dateFormat(new Date());
            switch (message.split(' ')[0]) {
            case '/users':
                socket.emit('chat', timestamp, 'SERVER', 'users in ' + socket.room + ': ' + findUsersConnected(socket.room).join(", "));
                break;
            case '/pm':
                if (sendPm(socket.username, message)) {
                    socket.emit('pm', timestamp, socket.username + '=>' + message.split(' ')[1], message.split(' ').slice(2).join(' '));
                    socket.emit('chat', timestamp, 'SERVER', 'Your message to ' + message.split(' ')[1] + ' was sent');
                    console.log(timestamp + ' ' + 'PRIVATE MESSAGE: ' + user + '=>' + message.split(' ')[1] +
                            ' : "' + message.split(' ').slice(2).join(' ') + '" was sent');
                    logger.log(timestamp + ' ' + 'PRIVATE MESSAGE: ' + user + '=>' + message.split(' ')[1] +
                            ' : "' + message.split(' ').slice(2).join(' ') + '" was sent');
                } else {
                    socket.emit('chat', timestamp, 'SERVER', 'Your message to ' + message.split(' ')[1] + ' was NOT sent');
                }
                break;
            case '/j':
                var newRoom = message.split(' ')[1];
                if (!roomExists(newRoom)) {
                    rooms.push(newRoom);
                }
                socket.leave(socket.room);
                socket.room = newRoom;
                socket.join(newRoom);
                socket.emit('updaterooms', rooms, newRoom);
                loadChat(socket, socket.room);
                db.query('UPDATE _13a SET ah=? WHERE ab=?', [socket.room, socket.username], function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });
                break;
            default:
                storeChat(timestamp, socket.room, user, message);
                io.to(socket.room).emit('chat', timestamp, user, message);
            }
        }
    });

    socket.on('who', function () {
        if (!socket.isAuthorized) {
            socket.emit('badSocket');
            socket.disconnect();
        }
        var who = findUsersConnected(socket.room);
        setTimeout(function () {
            if (socket.isAuthorized) {
                socket.emit('users', who);
            }
        }, 100);
    });

    socket.on('pozycja', function(data) {
        timestamp = dateFormat(new Date());
        if (username === 'Hogwarts') {
            socket.pozycja = {lat: 50.0898, lng: 19.9814};
        } else {
            socket.pozycja = data;
        }
        if ( (socket.pozycja.lat === 50.061667) && (socket.pozycja.lng === 19.937222)  ) {
            socket.emit('chat', timestamp, 'SERVER', socket.username + ', you are not sending your position!', "");
        }
        console.log(Date() + " " + socket.username + ": lat: " + socket.pozycja.lat + ", lng: " + socket.pozycja.lng);
    });

    socket.on('getPrivateUserPosition', function (privateChatPartner) {
        if (!socket.isAuthorized) {
            socket.emit('badSocket');
            socket.disconnect();
        }
        privateChatPartner = plain(privateChatPartner, {
            allowedTags: [],
            allowedAttributes: []
        });
        var pos = findUserPosition(privateChatPartner);
        socket.emit('setPrivateUserPosition', pos);
    });

    socket.on('privateUser', function (privateUser) {
        if (!socket.isAuthorized) {
            socket.emit('badSocket');
            socket.disconnect();
        }
        privateUser = plain(privateUser, {
            allowedTags: [],
            allowedAttributes: []
        });
        timestamp = dateFormat(new Date());
        db.query('SELECT ab FROM _13a WHERE ab=?', [privateUser], function (err, user) {
            if (err) {
                return console.log(err);
            }
            if (user[0]) {
                // use found
                var usersOnline = findUsersId();
                var privateUserOnline = false;
                usersOnline.forEach(function (userOnline) {
                    if (privateUser === userOnline.username) {
                        privateUserOnline = true;
                    }

                });
                if (privateUserOnline) {
                    socket.emit('privateChatAck', timestamp, privateUser, ' is online');
                } else {
                    socket.emit('privateChatAck', timestamp, privateUser, ' is offline');
                }
                socket.privateUser = privateUser;
                loadPrivateMessage(socket, socket.username, privateUser);
            } else {
                //not found
                socket.emit('privateChatAck', timestamp, privateUser, ' not found');
            }
        });
    });

    socket.on('privateMessage', function (privateChatPartner, message) {
        timestamp = dateFormat(new Date());
        if (!socket.isAuthorized) {
            socket.emit('badSocket');
            socket.disconnect();
        }
        privateChatPartner = plain(privateChatPartner, {
            allowedTags: [],
            allowedAttributes: []
        });
        message = plain(message, {
            allowedTags: [],
            allowedAttributes: []
        });
        if (message !== '' && privateChatPartner !== '') {
            timestamp = dateFormat(new Date());
            socket.emit('privateChat', timestamp, socket.username, privateChatPartner, message);
            sendPrivateMessage(socket.username, privateChatPartner, message);
            storePrivateMessage(timestamp, socket.username, privateChatPartner, message);
        }
    });

});
