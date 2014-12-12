/**
 * Created by renerodriguez on 11/16/14.
 */
var app = angular.module('leapspot');

app.controller("TestMapCtrl", ['$scope', '$rootScope',
    function ($scope, $rootScope) {

        var map;

        var count= 0;

        function initMap(){

            map = L.map('map');



            var basemapUrl = "http://{s}.tiles.mapbox.com/v3/spatialdev.map-4o51gab2/{z}/{x}/{y}.png";
            basemapLayer = L.tileLayer(basemapUrl,{
                detectRetina: true
            });
            basemapLayer.addTo(map);

            map.setView([47.6095912,-122.3101043], 0);

            $scope.find();


        }


        $rootScope.initiateMap = initMap();

        // Ahead of time, select the elements we'll need -
        // the narrative container and the individual sections
        var narrative = document.getElementById('narrative'),
            sections = narrative.getElementsByTagName('section'),
            currentId = '';

//        var redIcon = L.icon({
//            iconUrl: 'img/view@2x.png',
//            iconSize:     [30, 30], // size of the icon
//        });
//
//        var blackIcon = L.icon({
//            iconUrl: 'img/view_black@2x.png',
//            iconSize:     [30, 30], // size of the icon
//        });

//        setId('cover');

        var activeMarker;

        var percentageBar;

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


            for (var i = 0; i < markerData.length; i++) {



                if (markerData[i].id === newId) {

                    var truHeading = markerData[i].attributes.trueHeading

                    var momentSpot = new L.LatLng(markerData[i].attributes.latitude, markerData[i].attributes.longitude);
                    map.setView(momentSpot,11);


                    //create a marker based on baseline data attributes
//                    var marker = null;
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

                    activeMarker = L.rotatedMarker(new L.LatLng(markerData[i].attributes.latitude, markerData[i].attributes.longitude), {

//                radius: 4,
//                fillColor: "#ff4d4d",
//                color: "#000",
//                weight: 0.5,
//                opacity: 1,
//                fillOpacity: 1
                        icon: L.icon({
                            iconUrl: 'img/view@2x.png',
                            iconSize: [30, 30]
                        })

                    });

                    map.addLayer(activeMarker);
//                    activeMarker = L.marker([markerData[i].attributes.latitude, markerData[i].attributes.longitude], {icon: redIcon}).addTo(map);

                } else {
//                    layer.setIcon(blackIcon);



                }
            }

            console.log(newId);

            if(newId != "cover"){

                count++;

                var percent = (100/totalcount)*count;
                console.log(count, percent);

                if (percent < 100.1){
                    $rootScope.pg.percent(percent);
                }


            }else{
                map.setView([47.6095912,-122.3101043], 0);
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
                if (rect.top >= 0 && rect.top <= narrativeHeight) {
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