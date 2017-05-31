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
    $(window).on( "load", function () {
        //setting max height of some elements
        $(window).bind('resize', function () {
            set_chat_height();
        });
        $(window).trigger('resize');
        document.getElementById('startApp').style.display = 'inline-block';
        document.getElementById('ajax-loader').style.display = 'none';
        document.addEventListener('deviceready', function() {
            document.addEventListener("backbutton", onBackKeyDown, false);
            function onBackKeyDown() {
                // Handle the back buttons
                navigator.notification.confirm(
                    'Terminate app?', // message
                    onConfirm,            // callback to invoke with index of button pressed
                    'Exit',           // title
                    ['Cancel', 'Yes']     // buttonLabels
                );
            }

            function onConfirm(buttonIndex) {
                if (buttonIndex === 2) {
                    navigator.app.exitApp();
                }
            }

        }, false);

        function set_chat_height() {
            var windowHeight = $(window).height();
            var windowWidth = $(window).width();
            var splashDiv = document.getElementById('splash');
            var chatDiv = document.getElementById('messages');
            var usersDiv = document.getElementById('users');
            var mapDiv = document.getElementById('mapa');
            var pmDiv = document.getElementById('privateMessages');
            document.getElementById('chat').style.height = windowHeight -100 + 'px';
            document.getElementById('chat').style.width = windowWidth + 'px';
            document.getElementById('privateChat').style.height = windowHeight - 100 + 'px';
            document.getElementById('privateChat').style.width = windowWidth + 'px';
            splashDiv.style.height = windowHeight - 100 + 'px';
            chatDiv.style.height = windowHeight - 130 + 'px';
            chatDiv.scrollTop = chatDiv.scrollHeight;
            usersDiv.style.height = windowHeight - 130 + 'px';
            users.scrollTop = usersDiv.scrollHeight;
            pmDiv.style.height = windowHeight - 130 + 'px';
            pmDiv.scrollTop = pmDiv.scrollHeight;
            mapDiv.style.height = windowHeight - 50 + 'px';
            mapDiv.style.width = windowWidth + 'px';
            google.maps.event.trigger(map,'resize');
        }

        document.getElementById('privateChatbutton').addEventListener('click', function () {
            // header buttons
            document.getElementById('privateChatbutton').style.display = 'none';
            document.getElementById('chatbutton').style.display = 'inline-block';
            document.getElementById('mapbutton').style.display = 'inline-block';
            // body divs
            document.getElementById('stopka').style.display = 'none';
            document.getElementById('chatForm').style.display = 'none';
            document.getElementById('privateChatForm').style.display = 'block';        
            document.getElementById('chat').style.display = 'none';
            document.getElementById('mapa').style.display = 'none';
            document.getElementById('privateChat').style.display = 'block';
            $('#privateMessages').scrollTop($('#privateMessages').prop('scrollHeight'));
        });

        document.getElementById('chatbutton').addEventListener('click', function () {
            // header buttons
            if (privateChat) {
                document.getElementById('privateChatbutton').style.display = 'inline-block';
            }
            document.getElementById('chatbutton').style.display = 'none';
            document.getElementById('mapbutton').style.display = 'inline-block';
            // body divs
            // body divs
            document.getElementById('stopka').style.display = 'none';
            document.getElementById('chatForm').style.display = 'block';
            document.getElementById('privateChatForm').style.display = 'none';        
            document.getElementById('chat').style.display = 'block';
            document.getElementById('mapa').style.display = 'none';
            document.getElementById('privateChat').style.display = 'none';
            $('#messages').scrollTop($('#messages').prop('scrollHeight'));
        });

        document.getElementById('mapbutton').addEventListener('click', function () {
            // header buttons
            if (privateChat) {
                document.getElementById('privateChatbutton').style.display = 'inline-block';
            }
            document.getElementById('mapbutton').style.display = 'none';
            document.getElementById('chatbutton').style.display = 'inline-block';
            // body divs
            document.getElementById('stopka').style.display = 'none';
            document.getElementById('chatForm').style.display = 'none';
            document.getElementById('privateChatForm').style.display = 'none';        
            document.getElementById('chat').style.display = 'none';
            document.getElementById('mapa').style.display = 'block';
            document.getElementById('privateChat').style.display = 'none';
            $(window).trigger('resize');
        });

        document.getElementById('startApp').addEventListener('click', function () {

            // loading socket.io
            var socket = io('http://185.3.114.84');
            $('#mapa').on('click', 'a.markerLink', sendPrivateMessage);
            $('#chat').on('click', 'a.markerLink', sendPrivateMessage);
            
            document.getElementById('planeta').addEventListener('click', function () {
                document.getElementById('planetaform').style.display = 'inline-block';  
            });   
            
            document.getElementById('tytul').addEventListener('click', function () {
                navigator.notification.alert(
                    'miroslaw.krok@gmail.com',  // message
                     function () {},         // callback
                     'iAmHere 2.31',            // title
                     'OK'                  // buttonName
                );    
            });
                
            document.getElementById('geo').addEventListener('click', function () {
                CENTER_MAP = !CENTER_MAP;
                if (CENTER_MAP) {
                    map.setCenter(cordovaPos);
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
                if (privateMessageReceiver !== username) {
                    document.getElementById('privateChatbutton').style.display = 'none';
                    document.getElementById('mapbutton').style.display = 'inline-block';
                    document.getElementById('chatbutton').style.display = 'inline-block';
                    document.getElementById('privateChat').style.display = 'block';
                    document.getElementById('chat').style.display = 'none';
                    document.getElementById('chatForm').style.display = 'none';
                    document.getElementById('privateChatForm').style.display = 'block';
                    document.getElementById('mapa').style.display = 'none';
                    socket.emit('privateUser', privateMessageReceiver);
                }
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
                    socket.emit('authorize', username, password);
                }
            } else {
                document.getElementById('err').style.visibility = 'visible';
                document.getElementById('err').innerHTML = 'Invalid username or password';
            }
        });

        $('#planetaform').submit(function (e) {
            e.preventDefault();
            var newPlanet = $('#planetText').val();
            document.getElementById('planetaform').style.display = 'none'; 
            if (newPlanet.trim().length !== 0) {
                socket.emit('switchRoom', newPlanet);
                $('#planetText').focus().val('');
            }
        });
        
        $('#chatform').submit(function (e) {
            e.preventDefault();
            var message = {
                text: $('#chatText').val()
            };
            if (message.text.trim().length !== 0) {
                socket.emit('chat', socket.username, message.text);
                $('#chatText').focus().val('');
            }
        });

        $('#privateChatForm').submit(function (e) {
            e.preventDefault();
            var privateMessage = $('#messageText').val();
            if (privateMessage.trim().length !== 0 && privateChatPartner.length !== 0) {
                socket.emit('privateMessage', privateChatPartner, privateMessage);
                $('#messageText').focus().val('');
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
            var authToken;
            console.log('connected');
            if (window.localStorage) {
                authToken = window.localStorage.getItem('iah');
            } else if (window.sessionStorage) {
                authToken = window.sessionStorage.getItem('iah');  
            }
            if (authToken) {
                socket.emit('authToken', authToken);
            }
            setTimeout(function () {
                if (authorized) {
                    document.getElementById('mapbutton').style.display = 'none';
                    document.getElementById('chatbutton').style.display = 'inline-block';
                    document.getElementById('mapa').style.display = 'block';
                    document.getElementById('stopka').style.display = 'none';
                    document.getElementById('chat').style.display = 'none';
                    document.getElementById('privateChat').style.display = 'none';
                    document.getElementById('chatForm').style.display = 'none';
                    document.getElementById('privateChatForm').style.display = 'none';
                } else {
                    document.getElementById('splash').style.display = 'none';
                    document.getElementById('signin').style.display = 'block';
                }
            }, 3000);
            setInterval(function () {
                if (privateChat) {
                    socket.emit('getPrivateUserPosition', privateChatPartner);
                }
            }, 30000);
        });

        socket.on('authToken', function (authToken) {
            if (window.localStorage) {
                window.localStorage.setItem('iah', authToken);
            }
            if (window.sessionStorage) {
                window.sessionStorage.setItem('iah', authToken);
            }
        });

        //socket.on('cookie', function (cookie) {
            //document.cookie = cookie;   
        //});

        socket.on('setPrivateUserPosition', function (pozycja) {
            privateChatPartnerPosition = pozycja;
        });

        socket.on('gdzie', function () {
            if (authorized) {
                socket.emit('pozycja', cordovaPos);
            }
        });

        socket.on('users', function (users) {
            $('#users').html('');
            users.forEach(function (user) {
                if (user === socket.username) {
                    $('#users').append('<a href="#" style="color: yellow;" class="markerLink" who="' + user + 
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
            document.getElementById('planetaform').style.display = 'none'; 
            document.getElementById('planeta').innerHTML = 'planet: <span style="color: yellow;">' +
                    current_room + '</span>';
            $('#roomList').html('');
            rooms.forEach(function (value) {
                $('#roomList').append('<ul><a href="#" name="' + value + '">' + value + '</a></ul>');
            });
        });

        socket.on('chat', function (timestamp, user, message) {
            message = parsed(message);
            if (user === 'SERVER') {
                $('#messages').append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span>' + '&nbsp<span style="color: #ADEEFF; font-size: 1.1em;">&nbsp&nbsp' + message + '</span><br>');
            } else {
                $('#messages').append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span>' + '&nbsp&nbsp&nbsp<span style="color: #fff; font-size: 1.1em;">' + user + ':&nbsp&nbsp' + message + '</span><br>');
            }
            $('#messages').scrollTop($('#messages').prop('scrollHeight'));
            if (SOUND) {
                navigator.notification.beep();
            }
        });

        socket.on('privateChat', function (timestamp, sender, receiver, message) {
            message = parsed(message);
            if (sender === privateChatPartner) {
                $('#privateMessages').append('<div class="rightPrivateMessage"><span style="color: #666; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span><br>' + 
                    '<span>' + message + '</span></div><br><br>');
                $('#privateMessages').scrollTop($('#privateMessages').prop('scrollHeight'));
            } else if (receiver === privateChatPartner){
                $('#privateMessages').append('<div class="leftPrivateMessage"><span style="color: #bbb; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span><br>' + 
                    '<span>' + message + '</span></div><br><br>');
                $('#privateMessages').scrollTop($('#privateMessages').prop('scrollHeight'));
            } else {    
                $('#messages').append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span>' + '&nbsp&nbsp&nbsp<span style="color: #55ff55; font-size: 1.1em;">' + sender + ':&nbsp&nbsp' + message + '</span><br>');
                $('#messages').scrollTop($('#messages').prop('scrollHeight'));
            }
            if (SOUND) {
                navigator.notification.beep();
            }
        });

        socket.on('privateChatAck', function (timestamp, privateUser, status) {
            privateChat = true;
            $('#privateMessages').html('');
            if (status !== ' not found') {
                document.getElementById('activeUser').innerHTML = 'Chat with <span style="color: yellow;">' +
                    privateUser + '</span>';
                privateChatPartner = privateUser;
            } else {
                document.getElementById('activeUser').innerHTML = 'Chat';
                privateChatPartner = '';
            }
            if (SOUND) {
                navigator.notification.beep();
            }
        });

        socket.on('db_messages', function (rows) {
            $("#messages").html('');
            //$("#messages").append('<br><br><br><br><br><br><br><br><br>' + 
            //    '<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>' + 
            //    '<br><br><br><br><br><br><br>');
            rows.forEach(function (row) {
                if (row.sender === 'SERVER') {
                    $("#messages").append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + row.timestamp + '</span>' + '&nbsp<span style="color: #ADEEFF; font-size: 1.1em;">&nbsp&nbsp' + parsed(row.text) + '</span><br>');
                } else {
                    $("#messages").append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + row.timestamp + '</span>' + '&nbsp&nbsp&nbsp<span style="color: #fff; font-size: 1.1em;">' + row.sender + ':&nbsp&nbsp' + parsed(row.text) + '</span><br>');
                }
                $("#messages").scrollTop($("#messages").prop("scrollHeight"));
            });
        });

        socket.on('authAck', function (user) {
            authorized = true;
            username = user;
            socket.username = username;
            console.log('authorized');
            document.getElementById('splash').style.display = 'none';
            document.getElementById('signin').style.display = 'none';
            document.getElementById('naglowek').style.visibility = 'visible';
            document.getElementById('mapa').style.display = 'block';
             document.getElementById('stopka').style.display = 'none';
            $(window).trigger('resize');
            setInterval(function () {
                socket.emit('who');
            }, 5000);
        });

        socket.on('regAck', function () {
            console.log('registered');
            document.getElementById('err').style.visibility = 'hidden';
            document.getElementById('authInfo').innerHTML = 'You are registered<br>please log in';
        });

        socket.on('err', function (message) {
            console.log(message);
            if (SOUND) {
                navigator.notification.beep();
            }
            document.getElementById('err').style.visibility = 'visible';
            document.getElementById('err').innerHTML = message;
        });

        socket.on('disconnect', function () {
            console.log('disconnected');
        });

        socket.on('badSocket', function () {
            console.log('bad socket');
            location.reload(true);
        });

        socket.on('pm', function (timestamp, user, message) {
            message = parsed(message);
            if (user === privateChatPartner) {
                $('#privateMessages').append('<div class="rightPrivateMessage"><span style="color: #666; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span><br>' + 
                    '<span>' + message + '</span></div><br><br>');
                $('#privateMessages').scrollTop($('#privateMessages').prop('scrollHeight'));
            } else if (user === username){
                $('#privateMessages').append('<div class="leftPrivateMessage"><span style="color: #bbb; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span><br>' + 
                    '<span>' + message + '</span></div><br><br>');
                $('#privateMessages').scrollTop($('#privateMessages').prop('scrollHeight'));
            } else {    
                $('#messages').append('<span style="color: #aaa; margin-left: 2px; font-size: 0.8em;">' + timestamp + '</span>' + '&nbsp&nbsp&nbsp<span style="color: #55ff55; font-size: 1.1em;">' + sender + ':&nbsp&nbsp' + message + '</span><br>');
                $('#messages').scrollTop($('#messages').prop('scrollHeight'));
            }
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
                        // private chat partner found in markers
                        privateChatPartnerFound = true;
                    }
                });
                if ( privateChatPartnerFound === false) {
                    // private chat partner not found in markers
                    markery.push({username: privateChatPartner, pozycja: privateChatPartnerPosition});
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
                    /*if (onMe === false) {
                        map.setCenter(newLatLng);
                        onMe = true;
                    }*/
                    if (CENTER_MAP) {
                        map.setCenter(newLatLng);
                    }
                    ikona = 'images/mymarker.png';
                    if ((lat === 50.061667) && (lng === 19.937222)) {
                        // it seems that the geolocator does not work 
                        // alert('You don\'t send your position!');
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
            $("#privateMessages").html('');
            rows.forEach(function (row) {
                if (row.sender === privateChatPartner) {
                    $('#privateMessages').append('<div class="rightPrivateMessage"><span style="color: #666; margin-left: 2px; font-size: 0.8em;">' + row.timestamp + '</span><br>' + 
                        '<span>' + parsed(row.text) + '</span></div><br><br>');
                } else if (row.sender === username) {
                    $('#privateMessages').append('<div class="leftPrivateMessage"><span style="color: #bbb; margin-left: 2px; font-size: 0.8em;">' + row.timestamp + '</span><br>' + 
                        '<span>' + parsed(row.text) + '</span></div><br><br>');
                }  
                $('#privateMessages').scrollTop($('#privateMessages').prop('scrollHeight'));
            });
        });
        
      });
    });
}(jQuery));
