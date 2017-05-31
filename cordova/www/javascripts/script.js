window.onload = function () {
    //setting max height of some elements
    window.onresize = set_height;
    window.onresize();

    function set_height() {
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;
        var maxHeight = windowHeight - 200 + 'px';
        var maxWidth = windowWidth - 10 + 'px';
        var chatDiv = document.getElementById('chat');
        var mapDiv = document.getElementById('mapa');
        var pmDiv = document.getElementById('planet');
        chatDiv.style.height = windowHeight -100 + 'px';
        chatDiv.style.width = windowWidth + 'px';
        chatDiv.scrollTop = chatDiv.scrollHeight;
        pmDiv.style.height = windowHeight - 100 + 'px';
        pmDiv.style.width = windowWidth + 'px';
        pmDiv.scrollTop = pmDiv.scrollHeight;
        mapDiv.style.height = windowHeight - 100 + 'px';
        mapDiv.style.width = windowWidth + 'px';
    }  // function set_height
 
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
    
    document.getElementById('privateChatButton').addEventListener('click', function () {
        document.getElementById('planet').style.display = 'none';
        document.getElementById('mapa').style.display = 'none';
        document.getElementById('stopka').style.display = 'none';
        document.getElementById('chat').style.display = 'block';
        document.getElementById('messageForm').style.display = 'none';
        document.getElementById('chatForm').style.display = 'block';
    });

    document.getElementById('planetButton').addEventListener('click', function () {
        document.getElementById('planet').style.display = 'block';
        document.getElementById('messageForm').style.display = 'block';
        document.getElementById('chatForm').style.display = 'none';
        document.getElementById('mapa').style.display = 'none';
        document.getElementById('stopka').style.display = 'none';
        document.getElementById('chat').style.display = 'none';
    });

    document.getElementById('mapButton').addEventListener('click', function () {
        document.getElementById('mapa').style.display = 'block';
        document.getElementById('stopka').style.display = 'block';
        document.getElementById('messageForm').style.display = 'none';
        document.getElementById('chatForm').style.display = 'none';
        document.getElementById('chat').style.display = 'none';
        document.getElementById('planet').style.display = 'none';
        window.onresize();
        });
       
}
