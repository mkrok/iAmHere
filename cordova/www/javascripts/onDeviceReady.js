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



