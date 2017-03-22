var CENTER_MAP = true,
    SOUND = true,
    username,
    password,
    authorized = false,
    wiad = [],
    maxLen = 12,
    znaczniki = [],
    mypos,
    zInd = 0,
    privateChatPartner = '',
    privateChatPartnerPosition = {},
    privateChat = false,
    onMe = false,
    grupa;

// jQuery wrapper
(function ($) {
    // document.ready()
    $(function () {
        //setting max height of some elements
        $(window).bind('resize', function () {
            set_chat_height();
        });
        $(window).trigger('resize');

        window.addEventListener('touchstart', removeRestrictions);

        function removeRestrictions () {
            var snd = document.querySelector('#chatSound');
            snd.play();
            window.removeEventListener('touchstart', removeRestrictions);
        }
        //$(window).trigger('touchstart');

        function set_chat_height () {
            var windowHeight = $(window).height();
            var keybFactor = 0.5;
            var maxHeight = $(window).height() - 200 + 'px';
            var maxWidth = $(window).width() - 10 + 'px';
            var splashDiv = document.getElementById('splash');
            var chatDiv = document.getElementById('chatlog-display-div');
            var mapDiv = document.getElementById('mapa');
            var pmDiv = document.getElementById('pm-display');
            var usersDiv = document.getElementById('users');
            splashDiv.style.height = maxHeight;
            splashDiv.scrollTop = chatDiv.scrollHeight;
            chatDiv.style.height = keybFactor * windowHeight + 'px';
            chatDiv.scrollTop = chatDiv.scrollHeight;
            usersDiv.style.height = keybFactor * windowHeight + 'px';
            usersDiv.scrollTop = usersDiv.scrollHeight;
            pmDiv.style.height = keybFactor * windowHeight + 'px';
            pmDiv.scrollTop = pmDiv.scrollHeight;
            mapDiv.style.height = $(window).height() - 70 + 'px';
            mapDiv.style.width = $(window).width() + 'px';
            google.maps.event.trigger(map,'resize');
        }

        document.getElementById('privateChatbutton').addEventListener('click', function () {
            document.getElementById('privateChatbutton').style.display = 'none';
            document.getElementById('chatbutton').style.display = 'inline-block';
            document.getElementById('mapbutton').style.display = 'inline-block';
            document.getElementById('chat').style.display = 'none';
            //document.getElementById('mapa').style.display = 'none';
            document.getElementById('privateChat').style.display = 'block';
            $('#pm-display').scrollTop($('#pm-display').prop('scrollHeight'));
        });

        document.getElementById('chatbutton').addEventListener('click', function () {
            if (privateChat) {
                document.getElementById('privateChatbutton').style.display = 'inline-block';
            }
            document.getElementById('chatbutton').style.display = 'none';
            document.getElementById('mapbutton').style.display = 'inline-block';
            document.getElementById('chat').style.display = 'block';
            //document.getElementById('mapa').style.display = 'none';
            document.getElementById('privateChat').style.display = 'none';
            $('#chatlog-display-div').scrollTop($('#chatlog-display-div').prop('scrollHeight'));
        });

        document.getElementById('mapbutton').addEventListener('click', function () {
            if (privateChat) {
                document.getElementById('privateChatbutton').style.display = 'inline-block';
            }
            document.getElementById('mapbutton').style.display = 'none';
            document.getElementById('chatbutton').style.display = 'inline-block';
            document.getElementById('mapa').style.display = 'block';
            document.getElementById('chat').style.display = 'none';
            document.getElementById('privateChat').style.display = 'none';
            $(window).trigger('resize');
        });

        /*document.getElementById('privateChatSubmit').addEventListener('click', function () {
            var privateMessage = $('#privateChatTxt').val();
            if (privateMessage.trim().length !== 0 && privateChatPartner.length !== 0) {
                socket.emit('privateMessage', privateChatPartner, privateMessage);
                $('#privateChatTxt').focus().val('');
            }
        });*/

        document.getElementById('startApp').addEventListener('click', function () {
            // loading socket.io
            var socket = io();

            function chatBeep() {
                var snd = document.getElementById('chatSound');
                snd.currentTime = 0;
                snd.play();
            }

            function errorBeep() {
                var snd = document.getElementById('errorSound');
                snd.currentTime = 0;
                snd.play();
            }

            $('#mapa').on('click', 'a.markerLink', sendPrivateMessage);
            $('#chat').on('click', 'a.markerLink', sendPrivateMessage);
            document.getElementById('geo').addEventListener('click', function () {
                CENTER_MAP = !CENTER_MAP;
                if (CENTER_MAP) {
                    map.setCenter(pos);
                    document.getElementById('geo').style.color = '#777';
                } else {
                    document.getElementById('geo').style.color = '#ddd';
                }
            });
            document.getElementById('sound').addEventListener('click', function () {
                SOUND = !SOUND;
                if (SOUND) {
                    document.getElementById('sound').style.color = '#777';
                } else {
                    document.getElementById('sound').style.color = '#ddd';
                }
            });

            function sendPrivateMessage () {
                var privateMessageReceiver = $(this).attr('who') || 'user not found!';
                console.log('starting private chat with ' + privateMessageReceiver);
                document.getElementById('privateChatbutton').style.display = 'none';
                document.getElementById('mapbutton').style.display = 'inline-block';
                document.getElementById('chatbutton').style.display = 'inline-block';
                document.getElementById('privateChat').style.display = 'block';
                document.getElementById('chat').style.display = 'none';
                //document.getElementById('mapa').style.display = 'none';
                socket.emit('privateUser', privateMessageReceiver);
            }

        document.getElementById('login').addEventListener('click', function () {
            document.getElementById('err').style.visibility = 'hidden';
            username = document.getElementById('username').value.trim();
            password = document.getElementById('password').value.trim();
            var re = new RegExp('^[A-Za-z0-9_]{3,16}$');
            if (re.test(username) && re.test(password)) {
                if (username === '' || password === '') {
                    document.getElementById('err').style.visibility = 'visible';
                    document.getElementById('err').innerHTML = 'Please fill the form';
                } else {
                    console.log('sending ' + username + ':' + password);
                    socket.emit('authorize', username, password);
                }
            } else {
                document.getElementById('err').style.visibility = 'visible';
                document.getElementById('err').innerHTML = 'Invalid username or password';
            }
        });

        $('#chatform').submit(function (e) {
            e.preventDefault();
            var message = {
                text: $('#chat-box-div-txtinpt').val()
            };
            if (message.text.trim().length !== 0) {
                socket.emit('chat', socket.username, message.text);
                $('#chat-box-div-txtinpt').focus().val('');
            }
        });

        $('#privateChatUserForm').submit(function (e) {
            e.preventDefault();
        });

        $('#privateChatform').submit(function (e) {
            e.preventDefault();
            var privateMessage = $('#privateChatTxt').val();
            if (privateMessage.trim().length !== 0 && privateChatPartner.length !== 0) {
                socket.emit('privateMessage', privateChatPartner, privateMessage);
                $('#privateChatTxt').focus().val('');
            }
        });

        document.getElementById('register').addEventListener('click', function () {
            document.getElementById('err').style.visibility = 'hidden';
            username = document.getElementById('username').value.trim();
            password = document.getElementById('password').value.trim();
            var re = new RegExp('^[A-Za-z0-9_]{3,16}$');
            if (re.test(username) && re.test(password)) {
                if (username === '' || password === '') {
                    document.getElementById('err').style.visibility = 'visible';
                    document.getElementById('err').innerHTML = 'Please fill the form';
                } else {
                    var salt = Math.round((new Date()).getTime() * Math.random());
                    socket.emit('register', username, password, salt);
                }
            } else {
                document.getElementById('err').style.visibility = 'visible';
                document.getElementById('err').innerHTML = 'Invalid username or password';
            }
        });

        socket.on('connect', function () {
            console.log('connected');
            setTimeout(function () {
                if (authorized) {
                    document.getElementById('mapbutton').style.display = 'none';
                    document.getElementById('chatbutton').style.display = 'inline-block';
                    document.getElementById('mapa').style.display = 'block';
                    document.getElementById('chat').style.display = 'none';
                    document.getElementById('privateChat').style.display = 'none';
                } else {
                    document.getElementById('splash').style.display = 'none';
                    document.getElementById('signin').style.display = 'block';
                }
            }, 3000);
            setInterval(function () {
                if (privateChat) {
                    socket.emit('getPrivateUserPosition', privateChatPartner);
                }
            }, 5000);
        });

        socket.on('setPrivateUserPosition', function (pozycja) {
            privateChatPartnerPosition = pozycja;
        });

        socket.on('gdzie', function () {
            if (authorized) {
                var pos = {lat: 50.061667, lng: 19.937222};
                if (typeof (geo) !== 'undefined') {
                    pos = {lat: geo.lat, lng: geo.lng};
                }
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                    });
                } else {
                    alert('Geolocation is not supported by your browser');
                }
                socket.emit('pozycja', pos);
            }
        });

        socket.on('users', function (users) {
            $('#users').html('');
            users.forEach(function (user) {
                if (user === socket.username) {
                    $('#users').append('<a href="#" class="markerLink" who="' + user + 
                        '">' + user + '</a><br>');
                } else {
                    $('#users').append('<a href="#" class="markerLink" who="' + user + 
                        '">' + user + '</a><br>');
                }
            });
        });

        socket.on('updaterooms', function (rooms, current_room) {
            grupa = current_room;   //grupa may not be necessary at all
            socket.room = current_room;
            document.getElementById('activeRoom').innerHTML = 'user: <span style="color: #fff;">' +
                    username + '</span>&nbsp&nbsp&nbsp&nbsp planet: <span style="color: #fff;">' +
                    current_room + '</span>';
            $('#roomList').html('');
            rooms.forEach(function (value) {
                $('#roomList').append('<ul><a href="#" name="' + value + '">' + value + '</a></ul>');
            });
        });

        socket.on('chat', function (timestamp, user, message) {
            message = parsed(message);
            if (user === 'SERVER') {
                $('#chatlog-display-div').append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span>' + '&nbsp<span style="color: #ADEEFF; font-size: 1.1em;">&nbsp&nbsp' + message + '</span><br>');
            } else {
                $('#chatlog-display-div').append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span>' + '&nbsp&nbsp&nbsp<span style="color: #fff; font-size: 1.1em;">' + user + ':&nbsp&nbsp' + message + '</span><br>');
            }
            $('#chatlog-display-div').scrollTop($('#chatlog-display-div').prop('scrollHeight'));
            if (SOUND) {
                chatBeep();
            }    
        });

        socket.on('privateChat', function (timestamp, sender, receiver, message) {
            message = parsed(message);
            if (sender === privateChatPartner || receiver === privateChatPartner) {
                $('#pm-display').append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span>' + '&nbsp&nbsp&nbsp<span style="color: #fff; font-size: 1.1em;">' + sender + ':&nbsp&nbsp' + message + '</span><br>');
                $('#pm-display').scrollTop($('#pm-display').prop('scrollHeight'));
            } else {
                $('#chatlog-display-div').append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span>' + '&nbsp&nbsp&nbsp<span style="color: #55ff55; font-size: 1.1em;">' + sender + ':&nbsp&nbsp' + message + '</span><br>');
                $('#chatlog-display-div').scrollTop($('#chatlog-display-div').prop('scrollHeight'));
            }
            if (SOUND) {
                chatBeep();
            }  
        });

        socket.on('privateChatAck', function (timestamp, privateUser, status) {
            privateChat = true;
            $('#pm-display').html('');
            if (status !== ' not found') {
                document.getElementById('activeUsers').innerHTML = 'Private chat with <span style="color: #FFF;">' +
                    privateUser + '</span>';
                privateChatPartner = privateUser;
            } else {
                document.getElementById('activeUsers').innerHTML = 'Private chat';
                privateChatPartner = '';
            }
            if (SOUND) {
                chatBeep();
            }  
        });

        socket.on('db_messages', function (rows) {
            $("#chatlog-display-div").html('');
            $("#chatlog-display-div").append('<br><br><br><br><br><br><br><br><br>' + 
                '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>' + 
                '<br><br><br><br><br><br><br>');
            rows.forEach(function (row) {
                if (row.sender === 'SERVER') {
                    $("#chatlog-display-div").append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + row.timestamp + '</span>' + '&nbsp<span style="color: #ADEEFF; font-size: 1.1em;">&nbsp&nbsp' + parsed(row.text) + '</span><br>');
                } else {
                    $("#chatlog-display-div").append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + row.timestamp + '</span>' + '&nbsp&nbsp&nbsp<span style="color: #fff; font-size: 1.1em;">' + row.sender + ':&nbsp&nbsp' + parsed(row.text) + '</span><br>');
                }
                $("#chatlog-display-div").scrollTop($("#chatlog-display-div").prop("scrollHeight"));
            });
        });

        socket.on('authAck', function (user) {
            authorized = true;
            username = user;
            socket.username = username;
            console.log('authorized');
            document.getElementById('splash').style.display = 'none';
            document.getElementById('signin').style.display = 'none';
            document.getElementById('pasek').style.visibility = 'visible';
            document.getElementById('mapa').style.display = 'inline-block';
            $(window).trigger('resize');
            setInterval(function () {
                socket.emit('who');
            }, 1000);
        });

        socket.on('regAck', function () {
            console.log('registered');
            document.getElementById('err').style.visibility = 'hidden';
            document.getElementById('authInfo').innerHTML = 'You are registered<br>please log in';
        });

        socket.on('err', function (message) {
            console.log(message);
            if (SOUND) {
                errorBeep();
            }  
            document.getElementById('err').style.visibility = 'visible';
            document.getElementById('err').innerHTML = message;
        });

        socket.on('disconnect', function () {
            console.log('disconnected');
        });

        socket.on('cookie', function (cookie) {
            document.cookie = cookie;
        });

        socket.on('badSocket', function () {
            console.log('bad socket');
            location.reload(true);
        });

        socket.on('pm', function (timestamp, user, message) {
            message = parsed(message);
            if (user === privateChatPartner) {
                $('#pm-display').append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span>' + '&nbsp&nbsp&nbsp<span style="color: #ddd; font-size: 1.1em;">' + user + ':&nbsp&nbsp' + message + '</span><br>');
                $('#pm-display').scrollTop($('#pm-display').prop('scrollHeight'));
            }
            $('#chatlog-display-div').append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span>' + '&nbsp&nbsp&nbsp<span style="color: #55ff55; font-size: 1.1em;">' + user + ':&nbsp&nbsp' + message + '</span><br>');
            $('#chatlog-display-div').scrollTop($('#chatlog-display-div').prop('scrollHeight'));
        });

        socket.on('markers', function (markery, room) {
            var i,
                markerTitle,
                markerLabel,
                lat,
                lng,
                newLatLng,
                ikona;
                privateChatPartnerFound = false;

            if (privateChatPartner.length > 0) {
                markery.forEach( function (mark) {
                    if (mark.username === privateChatPartner) {
                        console.log('private chat partner found in markers');
                        privateChatPartnerFound = true;
                    }
                });  
                if ( privateChatPartnerFound === false) {
                    console.log('private chat partner not found in markers');
                    markery.push({username: privateChatPartner, pozycja: privateChatPartnerPosition});
                    console.log(markery);
                }
            }
            // deleting all markers
            if (grupa === room) {
                for (i = 0; i < znaczniki.length; i += 1) {
                    znaczniki[i].setMap(null);
                }
                znaczniki = [];
            }
            // redrawing markers
            for (i = 0; i < markery.length; i += 1) {
                markerTitle = markery[i].username;
                markerLabel = markerTitle.slice(0, 1);
                lat = markery[i].pozycja.lat;
                lng = markery[i].pozycja.lng;
                newLatLng = new google.maps.LatLng(lat, lng);
                ikona = 'images/marker.png';
                // centering map on our position
                if (markerTitle === username) {
                    mypos = newLatLng;
                    if (CENTER_MAP) {
                        map.setCenter(newLatLng);
                    }
                    ikona = 'images/mymarker.png';
                    if ((lat === 50.061667) && (lng === 19.937222)) {
                        //alert('You don\'t send your position!');
                    }
                    if (map.getZoom() === 3) {
                        map.setZoom(12);
                    }
                }
                if (markerTitle === privateChatPartner) {
                    ikona = 'images/magentamarker.png';
                }
                var marker = new google.maps.Marker({
                    position: newLatLng,
                    title: markerTitle,
                    label: markerLabel,
                    icon: ikona,
                    map: map
                });
                marker.addListener('click', function() {
                    var infowindow = new google.maps.InfoWindow();
                    infowindow.setContent('<a href="#" class="markerLink" who="' + 
                        this.title + '"><h4 style="color: black;"><br>' + this.title + '</h4></a>');
                    infowindow.open(map, this);
                });
                znaczniki.push(marker);
            }
            for( i = 0; i < znaczniki.length; i += 1 ) {
                znaczniki[i].setMap(map);
            }
        });

        socket.on('db_privateChat', function (rows) {
            $("#pm-display").html('');
            $("#pm-display").append('<br><br><br><br><br><br><br><br><br>' + 
                '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>' + 
                '<br><br><br><br><br><br><br>');
            rows.forEach(function (row) {
            $('#pm-display').append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + row.timestamp +
                    '</span>' + '&nbsp&nbsp&nbsp<span style="color: #fff; margin-left: 2px; font-size: 1.1em;">' + row.sender +
                    ':&nbsp' + parsed(row.text) + '</span><br>');
            });
            $('#pm-display').scrollTop($('#pm-display').prop('scrollHeight'));
        });
      });
    });
}(jQuery));