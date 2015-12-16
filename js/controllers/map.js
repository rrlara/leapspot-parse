/**
 * Created by renerodriguez on 11/16/14.
 */
var app = angular.module('leapspot');

app.controller("MapCtrl", ['$scope', '$rootScope',
    function ($scope, $rootScope) {

    var map;

    function initMap(){

        map = L.map('map');



        var basemapUrl = "http://{s}.tiles.mapbox.com/v3/spatialdev.map-4o51gab2/{z}/{x}/{y}.png";
        basemapLayer = L.tileLayer(basemapUrl);
        basemapLayer.addTo(map);

        map.setView([47.6095912,-122.3101043], 7);

        $scope.find();



    }

    initMap();

        $scope.points = function() {

            var sightingReports = $rootScope.pointData;

            console.log(sightingReports);

        var markers = new L.featureGroup({


        });

            var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };


        for(var i = 0, il = sightingReports.length; i < il; i++) {

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
                    iconUrl: 'img/view@2x.png',
                    iconSize: [30, 30],
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
        map.addLayer(markers);

        map.fitBounds(markers);

        };

        $scope.zoomToFullExtent = function() {
            map.fitBounds(markers);
        }

}]);
