/**
 * Created by renerodriguez on 11/16/14.
 */
var app = angular.module('leapspot');

app.controller("TestMapCtrl", ['$scope', '$rootScope',
    function ($scope, $rootScope) {

        var map;

        var count= 0;

        var connectionSpeed;

        $rootScope.effectsString = "";

        function initMap(){

            mapboxgl.accessToken = 'pk.eyJ1IjoicnJsYXJhIiwiYSI6IjNjSlJmUkkifQ.PlJc5PGK-7-EDMmsfqYKfg';

            var initialGeoJSON = {
                geometry: {
                    type: "Point", coordinates: [0, 0]
                },
                type: "Feature", properties: { }
            };

            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/emerald-v8',
                center: [-122.202,47.610],
                zoom: 8
                //hash: true
            });

            // disable map rotation using right click + drag
            map.dragRotate.disable();

            // disable map rotation using touch rotation gesture
            map.touchZoomRotate.disableRotation();

            var geojson = new mapboxgl.GeoJSONSource({
                data: initialGeoJSON
            });

            map.on('style.load', function () {
                // add geojson data as a new source
                map.addSource("symbols", geojson);

                // add source as a layer and apply some styles
                //map.addLayer({
                //    "id": "symbols",
                //    "interactive": true,
                //    "type": "symbol",
                //    "source": "symbols",
                //    "layout": {
                //        "icon-image": "marker-12"
                //    },
                //    "paint": {
                //        "circle-color":'#0000ff'
                //    }
                //});
                map.addLayer({
                    "id": "symbols",
                    "interactive": true,
                    "type": "circle",
                    "source": "symbols",
                    //"layout": {
                    //    "icon-image": "marker-15"
                    //},
                    "paint": {
                        "circle-radius": 10,
                        "circle-color": "#ff0000",
                        "circle-translate": [10,50],
                        "circle-translate-anchor": "map"
                    }
                });

            });
            //https://github.com/ashanbh/detectClientSpeed
            detectSpeed.startSpeedCheck (
                'http://files.parsetfss.com/b07a2e72-bc69-4cfa-b9a8-cff54fe5ac5e/tfss-aad5380a-8792-4487-a3ab-fb442b330cb4-thmbnail.jpg',
                function callback(timings){
                    console.log(timings);
                    $rootScope.connectSpeed = timings.throughPutSpeedClass.name;

                    connectionSpeed = timings.throughPutSpeedClass.throughput;
                    if(connectionSpeed >= 1000){
                        $rootScope.effectsString = "flyTo animation";
                    }else{
                        $rootScope.effectsString = "jumpTo animation";
                    }
                }
            );


        }




        initMap();

        // Ahead of time, select the elements we'll need -
        // the narrative container and the individual sections
        var narrative = document.getElementById('narrative'),
            sections = narrative.getElementsByTagName('section'),
            currentId = '';

        var activeMarker;


        function setId(newId) {
            // If the ID hasn't actually changed, don't do anything

            var markerData = $rootScope.pointData;

            var totalcount = markerData.length;






            if (newId === currentId) return;
            // Otherwise, iterate through layers, setting the current
            // marker to a different color and zooming to it.

            if(activeMarker){
                map.removeLayer(activeMarker);
            }

            var momentObj = {};


            for (var i = 0; i < markerData.length; i++) {

//                console.log(markerData[i].id);

                var momentID = markerData[i].id;

                count++;

                var percent = (100/markerData.length)*count;

                momentObj[momentID] = percent;

                if (markerData[i].id === newId) {

                    var truHeading = -180 + parseFloat(markerData[i].attributes.trueHeading);

                    var center = [parseFloat(markerData[i].attributes.longitude), parseFloat(markerData[i].attributes.latitude)];


                    if(connectionSpeed){
                        if(connectionSpeed >= 1000){
                            map.flyTo({
                                zoom: 11,
                                center: center
                            });
                        }else{
                            map.jumpTo({
                                zoom: 11,
                                center: center
                            });
                        }
                    }


                    var orale = new mapboxgl.GeoJSONSource({
                        data: {
                            geometry: {
                                type: "Point", coordinates: [parseFloat(markerData[i].attributes.longitude), parseFloat(markerData[i].attributes.latitude)]
                            },
                            type: "Feature", properties: { }
                        }
                    });

                    map.setLayoutProperty('symbols', 'icon-rotate', truHeading);

                    map.removeSource('symbols');
                    map.addSource("symbols", orale);



                } else {
//                    layer.setIcon(blackIcon);



                }
            }

            //console.log(newId);



            if(newId != "cover"){

//                count++;
//
//                var percent = (100/totalcount)*count;
//                console.log(count, percent);
//
//                if (percent < 100.1){
//                    $rootScope.pg.percent(percent);
//                }



                $rootScope.pg.percent($scope.momentObj[newId]);




            }else{
                map.setView([47.6095912,-122.3101043], 1);
            }





//            console.log(markerData);


            // highlight the current section
            for (var i = 0; i < sections.length; i++) {
                sections[i].className = sections[i].id === newId ? 'active' : '';

            }
            if(newId == 'fake'){
//                $rootScope.find();
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
//                console.log(rect);
                if (rect.top >= 300 && rect.top <= narrativeHeight) {
                    newId = sections[i].id;

                }
            };
            setId(newId);

        };


        $rootScope.points = function() {
            var sightingReports = $rootScope.pointData;

//            console.log(sightingReports);

            setId('cover');

            var markers = new L.featureGroup({


            });

            for (var i = 0, il = sightingReports.length; i < il; i++) {

                //attributes
                var currentSighting = sightingReports[i];
                var comment = currentSighting.attributes.comment;
//            var scientificName = currentSighting.attributes.scientificName;
//            var kingdom = currentSighting.attributes.type;
                var timestamp = currentSighting.createdAt;
                var image = currentSighting.attributes.imageFile._url;

                var altitude = (currentSighting.attributes.altitude)*3.28084;

                //geometry
                var latitude = currentSighting.attributes.latitude;
                var longitude = currentSighting.attributes.longitude;

                var truHeading = currentSighting.attributes.trueHeading;

                if (!truHeading) {
                    truHeading = "0"
                }

                //create a marker based on baseline data attributes
                var marker = null;
                // MIT-licensed code by Benjamin Becquet
                // https://github.com/bbecquet/Leaflet.PolylineDecorator
                L.RotatedMarker = L.Marker.extend({
                    options: { angle: truHeading },
                    _setPos: function(pos) {
                        L.Marker.prototype._setPos.call(this, pos);
                        if (L.DomUtil.TRANSFORM) {
                            // use the CSS transform rule if available
                            this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.angle + 'deg)';
                        } else if (L.Browser.ie) {
                            // fallback for IE6, IE7, IE8
                            var rad = this.options.angle * L.LatLng.DEG_TO_RAD,
                                costheta = Math.cos(rad),
                                sintheta = Math.sin(rad);
                            this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
                                costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
                        }
                    }
                });
                L.rotatedMarker = function(pos, options) {
                    return new L.RotatedMarker(pos, options);
                };

                marker = L.rotatedMarker(new L.LatLng(latitude, longitude), {

//                radius: 4,
//                fillColor: "#ff4d4d",
//                color: "#000",
//                weight: 0.5,
//                opacity: 1,
//                fillOpacity: 1
                    icon: L.icon({
                        iconUrl: 'img/black@2x.png',
                        iconSize: [30, 30],
                        opacity: 0.5
                    })

                });

                var image = '<A class="imageResearchPartner" HREF="' + image + '" TARGET="NEW"><img width="100%" height="" class="imageThumbnail" src="' + image + '" /></A>';

//
//            //for defining the html inside the pop up
                marker.bindPopup(image + "<br/>" + comment + "<br/>" + timestamp + "<br/>" + altitude + "<br/>" + longitude + "," + latitude);
//
                //add marker to marker group
                markers.addLayer(marker);

//            mapObject.addLayer(marker);
            }

            //add marker group as a layer to the map
//            map.addLayer(markers);

//            map.fitBounds(markers);

            $rootScope.globalMarkers = markers;


        };











    }]);