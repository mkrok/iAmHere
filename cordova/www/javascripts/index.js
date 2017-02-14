/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var cordovaPos = {lat: 50.061667, lng: 19.937222};
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        // this.receivedEvent('deviceready');
        setInterval(function () {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    cordovaPos = {lat: position.coords.latitude, lng: position.coords.longitude};
                    alert(cordovaPos);
                },
                function (error) {
                    alert('code: ' + error.code + '\n' +
                       'message: ' + error.message + '\n');
                },
                { enableHighAccuracy: true }
            );
        }, 10000);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
setInterval(function () {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            cordovaPos = {lat: position.coords.latitude, lng: position.coords.longitude};
        },
        function (error) {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        },
        { enableHighAccuracy: true }
    );
}, 10000);