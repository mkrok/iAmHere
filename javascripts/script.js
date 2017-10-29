import React from 'react';
import ReactDOM from 'react-dom';
import ioClient from 'socket.io-client';
import '../stylesheets/styles.css';
import '../stylesheets/font-awesome.min.css';
import '../stylesheets/twemoji-awesome.css';
import markerIcon from '../images/marker.png';
import myMarkerIcon from '../images/mymarker.png';
import partnerMarkerIcon from '../images/magentamarker.png';
import parsed from './twaEmojiParser';

let $ = require('jquery');
window.jQuery = $;
window.$ = $;

const socket = ioClient ('http://mk12ok.ct8.pl/');

let map,
    zum = 3,
    CENTER_MAP = true,
    SOUND = true,
    username,
    password,
    authorized = false,
    znaczniki = [],
    privateChatPartner = '',
    privateChatPartnerPosition = {},
    privateChat = false,
    grupa,
    cordovaPos = {lat: 50.061667, lng: 19.937222},
    initialPos = {lat: 70.061667, lng: -12.337222};

const Tytul = () =>
    <div id="tytul"><span id="titleIcon" style={{color: '#f2756a'}}><i className="fa fa-lg fa-map-marker"></i></span> am here</div>;

const Naglowek = () =>
    <div id="naglowek">
        <div id="naglowek_content">
            <Tytul/>
        </div>
    </div>;

const Loader = () => <div className="loader"></div>;

const Login = () => {
    let handleClick = () => {
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
    };
    return (<button id="login" className="signinButton" onClick={handleClick} type="button">Sign in</button>);
};


const Register = () => {
    let handleClick = () => {
        document.getElementById('err').style.visibility = 'hidden';
        username = document.getElementById('username').value.trim();
        password = document.getElementById('password').value.trim();
        let re = new RegExp('^[A-Za-z0-9_]{3,16}$');
        if (re.test(username) && re.test(password)) {
            if (username === '' || password === '') {
                document.getElementById('err').style.visibility = 'visible';
                document.getElementById('err').innerHTML = 'Please fill the form';
            } else {
                let salt = Math.round((new Date()).getTime() * Math.random());
                socket.emit('register', username, password, salt);
            }
        } else {
            document.getElementById('err').style.visibility = 'visible';
            document.getElementById('err').innerHTML = 'Invalid username or password';
        }
    };
    return (<button id="register" className="signinButton" onClick={handleClick} type="button">Register</button>);
};

const Username = () =>
    <input id="username" className="signinInput" type="text" maxLength="10" placeholder="username" required autoFocus/>;

const Password = () =>
    <input id="password" className="signinInput" type="password" maxLength="20" placeholder="password" required/>;

const Err = () => <p id="err"></p>;

const AuthForm = () =>
    <div id="authForm">
        <Username /><br/>
        <Password /><br/><br/>
        <Login />
        <Register />
        <Err />
        <br/>
    </div>;


const SignIn = () =>
    <div id="signin">
        <form>
            <div id="authInfo">Please sign in</div>
            <br/>
            <AuthForm/>
        </form>
    </div>;

const SplashText = () =>
    <h3 id="splashText">I<br/>am<br/>here<br/></h3>;

const Splash = () =>
    <div id="splash">
        <SplashText />
        <Loader/>
    </div>;

class Mapa extends React.Component {
    constructor (props) {
        super(props);
        this.handleGeoClick = this.handleGeoClick.bind(this);
        this.handleSoundClick = this.handleSoundClick.bind(this);
    }
    componentDidMount () {
        // Connect the initMap() function within this class to the global window context,
        // so Google Maps can invoke it
        window.initMap = this.initMap;
        // Asynchronously load the Google Maps script, passing in the callback reference
        var head= document.getElementsByTagName('head')[0];
        var script= document.getElementsByTagName('script')[0];
        script.src= 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBYtFG6gg-yuuYqav4XKq7d5P2I1jQIEE0&callback=initMap';
        head.appendChild(script);
        $(window).bind('resize', function () {
            set_dimensions();
        });
        $(window).trigger('resize');
        $('#mapa').on('click', 'a.markerLink', sendPrivateMessage);
        setTimeout ( () => {
            document.getElementById('geo').addEventListener('click', this.handleGeoClick);
            document.getElementById('sound').addEventListener('click', this.handleSoundClick);
        }, 10000);
    }

    initMap () {
        var styles = [
            {
                stylers: [
                    { hue: '#B3E9FF' },
                    { saturation: -80 },
                    { gamma: 0.30 }
                ]
            },
            {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [
                    { lightness: 100 },
                    { visibility: 'simplified' }
                ]
            },
            {
                featureType: 'road',
                elementType: 'labels',
                stylers: [
                    { visibility: 'on' }
                ]
            }
        ];
        // Create a new StyledMapType object, passing it the array of styles,
        // as well as the name to be displayed on the map type control.

        /*global google*/
        var styledMap = new google.maps.StyledMapType(styles, {name: 'Styled Map'});

        map = new google.maps.Map(document.getElementById('mapa'), {
            center: initialPos,
            zoom: zum,
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        });

        //Associate the styled map with the MapTypeId and set it to display.
        map.mapTypes.set('map_style', styledMap);
        map.setMapTypeId('map_style');
        map.setCenter(initialPos);
        // add some controls to the map
        let topLeft = document.createElement('div');
        topLeft.setAttribute('id', 'mapControls');
        let centerMap = '<button id="geo"><i class="fa fa-2x fa-crosshairs"></i></button>';
        let setSound = '<button id="sound"><i class="fa fa-2x fa-volume-up"></i></button>';
        topLeft.innerHTML = centerMap + setSound;
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(topLeft);
        setInterval( function() {
            if (CENTER_MAP) {
                //map.setCenter(mypos);
                map.setCenter(cordovaPos);
            }
        }, 5000);
    }

    handleSoundClick () {
        SOUND = !SOUND;
        console.log('sound: ' + SOUND);
        if (SOUND) {
            document.getElementById('sound').style.color = '#777';
        } else {
            document.getElementById('sound').style.color = '#ddd';
        }
    }

    handleGeoClick () {
        CENTER_MAP = !CENTER_MAP;
        console.log('center map: ' + CENTER_MAP);
        if (CENTER_MAP) {
            map.setCenter(cordovaPos);
            document.getElementById('geo').style.color = '#777';
        } else {
            document.getElementById('geo').style.color = '#ddd';
        }
    }
    render() {
        return (
            <div id="mapa"></div>
        );
    }
}

class Planeta extends React.Component {
    constructor(props) {
        super(props);
        this.state = {planet: ''};
        this.handleClick = this.handleClick.bind(this);
        socket.on('updaterooms', (rooms, current_room) => {
            grupa = current_room;
            this.setState({planet: current_room});
            document.getElementById('planetaform').style.display = 'none';
        });
    }
    handleClick () {
        document.getElementById('planetaform').style.display = 'inline-block';
    }
    render () {
        return (
            <div id="planeta">
                Planet:<span id="planetName" onClick={this.handleClick}>{this.state.planet}</span>
            </div>);
    }
}

class PlanetaForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({value: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        var newPlanet = $('#planetText').val();
        document.getElementById('planetaform').style.display = 'none';
        if (newPlanet.trim().length !== 0) {
            socket.emit('switchRoom', newPlanet);
            $('#planetText').focus().val('');
        }
    }
    render() {
        return (
            <div id="planetaForm">
                <form id="planetaform" onSubmit={this.handleSubmit}>
                    <input id="planetText" value={this.state.value} onChange={this.handleChange} type="text" maxLength="20" placeholder="Change..."/>
                </form>
            </div>
        );
    }
}

const ActiveRoomWrapper = () =>
    <div id="activeRoomWrapper">
        <div id="activeRoom">
            <Planeta />
            <PlanetaForm />
        </div>
    </div>;

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {users: []};
        socket.on('users', users => {
            this.setState ({'users': users});
        });
    }
    render() {
        return (
            <div id="users">
                <ul>
                    {this.state.users.map((user) =>
                        <UserLink key={user} user={user}/>
                    )}
                </ul>
            </div>
        );
    }
}

const UserLink = (props) => {
    let id = props.user;
    let handleClick = () => {
        if (id !== username) {
            socket.emit('privateUser', id);
        }
    };
    return (
        <li className="markerlink" id={props.user} onClick={handleClick}>{props.user}</li>
    );
};

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {messages: []};
        socket.on('db_messages', messages => {
            this.setState({messages: messages});
        });
        socket.on('chat', (timestamp, sender, text) => {
            if (sender !== 'SERVER') {
                let messages = this.state.messages;
                messages.push({
                    timestamp: timestamp,
                    sender:sender,
                    text: text
                });
                this.setState({messages: messages});
            }
        });
    }
    componentDidUpdate () {
        //$('#messages').scrollTop($('#messages').prop('scrollHeight'));
        this._div.scrollTop = this._div.scrollHeight;
    }
    render () {
        return (
            <div id="messages" ref={(ref) => this._div = ref}>
                <ul>
                    {this.state.messages.map((message, index) =>
                        <Message key={index} message={message}/>
                    )}
                </ul>
            </div>
        );
    }
}

const Message = (props) => {
    return (
        <li className="message" >
            <span className="timestamp">{props.message.timestamp}</span>
            <span id="messageBody" dangerouslySetInnerHTML={{__html: props.message.sender + ': ' + parsed(props.message.text)}}/>
        </li>
    );
};

const Chat = () =>
    <div id="chat">
        <ActiveRoomWrapper />
        <Users />
        <Messages />
        <ChatForm />
    </div>;

class ChatForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({value: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        let message = $('#chatText').val();
        if (message.trim().length !== 0) {
            socket.emit('chat', socket.username, message);
            $('#chatText').focus().val('');
        }
    }
    render() {
        return (
            <div id="chatForm">
                <form id="chatform" onSubmit={this.handleSubmit} action="">
                    <div id="chatFormWrapper">
                        <input id="chatText" defaultValue="" onChange={this.handleChange} type="text" maxLength="255" placeholder="Type a message"/>
                    </div>
                </form>
            </div>
        );
    }
}

class PrivateChat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            partner: '',
            messages: []
        };
        socket.on('privateChatAck', (timestamp, privateUser, status) => {
            privateChat = true;
            if (status !== ' not found') {
                this.setState({partner: privateUser});
                this.setState({messages: []});
                privateChatPartner = privateUser;
            } else {
                privateChatPartner = '';
            }
            if (SOUND) {
                chatBeep();
            }
        });
        socket.on('db_privateChat', messages => {
            this.setState({messages: messages});
        });
        socket.on('privateChat', (timestamp, sender, receiver, message) => {
            let messages = this.state.messages;
            messages.push({
                timestamp: timestamp,
                sender: sender,
                receiver: receiver,
                text: message
            });
            this.setState({messages: messages});
            if (SOUND) {
                chatBeep();
            }
        });
    }
    render () {
        return (
            <div id="privateChat">
                <PrivateChatWrapper partner={this.state.partner}/>
                <PrivateMessages messages={this.state.messages}/>
                <PrivateChatForm />
            </div>
        );
    }
}

const PrivateChatWrapper = (props) => {
    return (
        <div id="privateChatWrapper">
            <div id="activeUser">
                Chat with: <span id="partner">{props.partner}</span>
            </div>
        </div>
    );
};

class PrivateMessages extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate () {
        this._div.scrollTop = this._div.scrollHeight;
    }
    render () {
        return (
            <div id="privateMessages" ref={(ref) => this._div = ref}>
                {this.props.messages.map((message, index) =>
                    <PrivateMessage key={index} message={message}/>
                )}
            </div>
        );
    }
}

const PrivateMessage = (props) => {
    if (props.message.sender === privateChatPartner) {
        return (
            <div className="leftPrivateMessage">
                {props.message.timestamp}
                <br/>
                <span id="messageBody" dangerouslySetInnerHTML={{__html: props.message.sender + ': ' + parsed(props.message.text)}}/>
            </div>
        );
    } else if (props.message.sender === username) {
        return (
            <div className="rightPrivateMessage">
                <span className="timestamp">{props.message.timestamp}</span>
                <br/>
                <span id="messageBody" dangerouslySetInnerHTML={{__html: props.message.sender + ': ' + parsed(props.message.text)}}/>
            </div>
        );
    }
};

const Stopka = () =>
    <div id="stopka">
        <div id="footer">(c) mkrok 2017</div>
    </div>;

class PrivateChatForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({value: e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        let message = $('#messageText').val();
        if (privateChatPartner.trim().length !== 0 && message.trim().length !== 0) {
            socket.emit('privateMessage', privateChatPartner, message);
        }
        $('#messageText').focus().val('');
    }
    render() {
        return (
            <div id="privateChatForm">
                <form id="privatechatform" onSubmit={this.handleSubmit} action="">
                    <div id="privateChatFormWrapper">
                        <input id="messageText" defaultValue="" onChange={this.handleChange} type="text" maxLength="255" placeholder="Type a message"/>
                    </div>
                </form>
            </div>
        );
    }
}


const Audio = () =>
    <div>
        <audio id="errorSound" src="sounds/error.mp3" preload="auto"></audio>
        <audio id="chatSound" src="sounds/chat.mp3" preload="auto"></audio>
    </div>;

const Wrapper = () =>
    <div id="wrapper">
        <Chat/>
        <Mapa/>
        <PrivateChat/>
    </div>;

ReactDOM.render (
    <div>
        <Splash/>
        <Naglowek/>
        <SignIn/>
        <Stopka/>
        <Audio/>
        <Wrapper />
    </div>,
    document.getElementById('root')
);

/***************************************************

Functions

****************************************************/
function sendPrivateMessage () {
    var privateMessageReceiver = $(this).attr('who') || 'user not found!';
    if (privateMessageReceiver !== username) {
        socket.emit('privateUser', privateMessageReceiver);
    }
}

function set_dimensions() {
    var windowHeight = $(window).height(),
        windowWidth = $(window).width(),
        $wrapper = document.getElementById('wrapper'),
        $chat = document.getElementById('chat'),
        $messages = document.getElementById('messages'),
        $users = document.getElementById('users'),
        $mapa = document.getElementById('mapa'),
        $privateChat = document.getElementById('privateChat'),
        $privateMessages = document.getElementById('privateMessages'),
        $signin = document.getElementById('signin'),
        $splashText = document.getElementById('splashText'),
        $username = document.getElementById('username'),
        $register = document.getElementById('register'),
        $login = document.getElementById('login'),
        $password = document.getElementById('password');

        // set the height of some elements as the fraction of the window height
    $username.style.height = windowHeight/15 + 'px';
    $password.style.height = windowHeight/15 + 'px';
    $login.style.height = windowHeight/15 + 'px';
    $register.style.height = windowHeight/15 + 'px';
    $splashText.style.fontSize = windowHeight/6 + 'px';

    // set the dimensions of some elements as the difference between
    // the window height and the fixed height of some other elements
    $wrapper.style.width = windowWidth - 100 + 'px';
    $chat.style.height = windowHeight - 210 + 'px';
    $privateChat.style.height = windowHeight - 210 + 'px';
    $signin.style.height = windowHeight - 50 + 'px';
    $signin.style.width = windowWidth + 'px';
    $messages.style.height = windowHeight - 330 + 'px';
    $messages.scrollTop = $messages.scrollHeight;
    $users.style.height = windowHeight - 330 + 'px';
    $users.scrollTop = $users.scrollHeight;
    $privateMessages.style.height = windowHeight - 330 + 'px';
    $privateMessages.scrollTop = $privateMessages.scrollHeight;
    $mapa.style.height = windowHeight - 210 + 'px';
    if (typeof google !== 'undefined') {
        google.maps.event.trigger(map,'resize');
    }
}

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

/**************************************

socket.io

**************************************/
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
            document.getElementById('mapa').style.display = 'block';
            document.getElementById('stopka').style.display = 'block';
            document.getElementById('chat').style.display = 'block';
            document.getElementById('privateChat').style.display = 'block';
            document.getElementById('chatForm').style.display = 'block';
            document.getElementById('privateChatForm').style.display = 'block';
        } else {
            document.getElementById('splash').style.display = 'none';
            document.getElementById('stopka').style.display = 'none';
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

socket.on('setPrivateUserPosition', function (pozycja) {
    privateChatPartnerPosition = pozycja;
});

socket.on('gdzie', function () {
    if (authorized) {
        socket.emit('pozycja', cordovaPos);
    }
});

socket.on('badSocket', function () {
    console.log('bad socket');
    location.reload(true);
});

socket.on('disconnect', function () {
    console.log('disconnected');
});

socket.on('authAck', function (user) {
    authorized = true;
    username = user;
    socket.username = username;
    console.log('authorized');
    document.getElementById('splash').style.display = 'none';
    document.getElementById('signin').style.display = 'none';
    document.getElementById('naglowek').style.display = 'block';
    document.getElementById('mapa').style.display = 'block';
    document.getElementById('stopka').style.display = 'block';
    document.getElementById('chat').style.display = 'block';
    document.getElementById('privateChat').style.display = 'block';
    document.getElementById('chatForm').style.display = 'block';
    document.getElementById('privateChatForm').style.display = 'block';
    $(window).trigger('resize');
    setInterval(function () {
        socket.emit('who');
    }, 5000);
});

socket.on('regAck', function () {
    console.log('registered');
    document.getElementById('err').style.visibility = 'hidden';
    document.getElementById('authInfo').innerHTML = 'You are registered<br>please sign in';
});

socket.on('err', function (message) {
    console.log(message);
    if (SOUND) {
        errorBeep();
    }
    document.getElementById('err').style.visibility = 'visible';
    document.getElementById('err').innerHTML = message;
});

socket.on('markers', function (markery, room) {
    var i,
        markerTitle,
        markerLabel,
        lat,
        lng,
        newLatLng,
        ikona,
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
            //google.maps.event.removeListener(znaczniki[i]);
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
        //ikona = 'images/marker.png';
        ikona = markerIcon;
        // centering map on our position
        if (markerTitle === username) {
            //ikona = 'images/mymarker.png';
            ikona = myMarkerIcon;
            if ((lat === 50.061667) && (lng === 19.937222)) {
                // it seems that the geolocator does not work
                // alert('You don\'t send your position!');
            }
            if (map.getZoom() === 3) {
                map.setZoom(12);
            }
        }
        if (markerTitle === privateChatPartner) {
            //ikona = 'images/magentamarker.png';
            ikona = partnerMarkerIcon;
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
                this.title + '"><h3 style="color: black;"><br>' + this.title + '</h3></a>');
            infowindow.open(map, this);
        });
        znaczniki.push(marker);
    }
    for( i = 0; i < znaczniki.length; i += 1 ) {
        znaczniki[i].setMap(map);
    }
});
