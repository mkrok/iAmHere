var zum = 3;
var map;
var pos = {lat: 50.061667, lng: 19.937222};

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
        center: pos,
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
    map.setCenter(pos);
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        });
    } else {
        map.setCenter(pos);
    }
    if (typeof (geo) !== 'undefined') {
        map.setCenter(geo);
    }
} // function initMap