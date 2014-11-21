/**
 * Created by renerodriguez on 11/16/14.
 */
var app = angular.module('leapspot');

app.controller("ScrollMapCtrl", ['$scope', '$rootScope',
    function ($scope, $rootScope) {



                L.mapbox.accessToken = 'pk.eyJ1IjoicnJsYXJhIiwiYSI6IkplNEFnUVUifQ.e5zd5QyoERZ2IHX0EU5pwg';
//        L.mapbox.accessToken = '<your access token here>';
                // In this case, we just hardcode data into the file. This could be dynamic.
                // The important part about this data is that the 'id' property matches
                // the HTML above - that's how we figure out how to link up the
                // map and the data.
                var places = { type: 'FeatureCollection', features: [
                    { geometry: { type: "Point", coordinates: [-0.12960000, 51.50110000] },
                        properties: { id: "cover", zoom: 9 }, type: 'Feature' },
                    { geometry: { type: "Point", coordinates: [-0.15591514, 51.51830379] },
                        properties: { id: "baker" }, type: 'Feature' },
                    { geometry: { type: "Point", coordinates: [-0.07571203, 51.51424049] },
                        properties: { id: "aldgate" }, type: 'Feature' },
                    { geometry: { type: "Point", coordinates: [-0.08533793, 51.50438536] },
                        properties: { id: "london-bridge" }, type: 'Feature' },
                    { geometry: { type: "Point", coordinates: [0.05991101, 51.48752939] },
                        properties: { id: "woolwich" }, type: 'Feature' },
                    { geometry: { type: "Point", coordinates: [-0.18335806, 51.49439521] },
                        properties: { id: "gloucester" }, type: 'Feature' },
                    { geometry: { type: "Point", coordinates: [-0.19684993, 51.5033856] },
                        properties: { id: "caulfield-gardens" }, type: 'Feature' },
                    { geometry: { type: "Point", coordinates: [-0.10669358, 51.51433123] },
                        properties: { id: "telegraph" }, type: 'Feature' },
                    { geometry: { type: "Point", coordinates: [-0.12416858, 51.50779757] },
                        properties: { id: "charing-cross" }, type: 'Feature' }
                ]};


//                var places = $rootScope.pointData;

        console.log(places);

                var map = L.map('map');

                var basemapUrl = "http://{s}.tiles.mapbox.com/v3/spatialdev.map-4o51gab2/{z}/{x}/{y}.png";
                basemapLayer = L.tileLayer(basemapUrl);
                basemapLayer.addTo(map);

                var placesLayer = L.mapbox.featureLayer(places)
                    .addTo(map);

                // Ahead of time, select the elements we'll need -
                // the narrative container and the individual sections
                var narrative = document.getElementById('narrative'),
                    sections = narrative.getElementsByTagName('section'),
                    currentId = '';

                var redIcon = L.icon({
                    iconUrl: 'img/view@2x.png',
                    iconSize:     [30, 30], // size of the icon
                });

                var blackIcon = L.icon({
                    iconUrl: 'img/view_black@2x.png',
                    iconSize:     [30, 30], // size of the icon
                });

                setId('baker');

                function setId(newId) {
                    // If the ID hasn't actually changed, don't do anything
                    if (newId === currentId) return;
                    // Otherwise, iterate through layers, setting the current
                    // marker to a different color and zooming to it.
                    placesLayer.eachLayer(function(layer) {
                        if (layer.feature.properties.id === newId) {
                            map.setView(layer.getLatLng(), layer.feature.properties.zoom || 10);
                            layer.setIcon(redIcon);

                        } else {
                            layer.setIcon(blackIcon);
                        }
                    });
                    // highlight the current section
                    for (var i = 0; i < sections.length; i++) {
                        sections[i].className = sections[i].id === newId ? 'active' : '';
                    }
                    // And then set the new id as the current one,
                    // so that we know to do nothing at the beginning
                    // of this function if it hasn't changed between calls
                    currentId = newId;
                }

                // If you were to do this for real, you would want to use
                // something like underscore's _.debounce function to prevent this
                // call from firing constantly.
                narrative.onscroll = function(e) {
                    var narrativeHeight = narrative.offsetHeight;
                    var newId = currentId;
                    // Find the section that's currently scrolled-to.
                    // We iterate backwards here so that we find the topmost one.
                    for (var i = sections.length - 1; i >= 0; i--) {
                       var rect = sections[i].getBoundingClientRect();
                        if (rect.top >= 0 && rect.top <= narrativeHeight) {
                            newId = sections[i].id;
                        }
                    };
                    setId(newId);
                };



    }]);