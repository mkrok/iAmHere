var zum = 3;
var map;
var cordovaPos = {lat: 50.061667, lng: 19.937222};

navigator.geolocation.watchPosition(
    function (position) {
        cordovaPos = {lat: position.coords.latitude, lng: position.coords.longitude};
    },
    function (error) {
        navigator.notification.alert('Waiting for GPS...');
    },
    { maximumAge: 15000, timeout: 20000, enableHighAccuracy: true }
);

function initMap() {
    // Create an array of styles.
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
    ],
    // Create a new StyledMapType object, passing it the array of styles,
    // as well as the name to be displayed on the map type control.
    styledMap = new google.maps.StyledMapType(styles, {name: 'Styled Map'});

    map = new google.maps.Map(document.getElementById('mapa'), {
        center: cordovaPos,
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
    map.setCenter(cordovaPos);
    // add some controls to the map
    var centerMapDiv = document.createElement('div');
    centerMapDiv.innerHTML = '<button id="geo"><i class="fa fa-2x fa-crosshairs"></i></button>';
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerMapDiv);
} // function initMap