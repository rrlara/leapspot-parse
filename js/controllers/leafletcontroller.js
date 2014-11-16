var app = angular.module("leapspot");


app.controller("GeoJSONController", ['$scope', '$rootScope',
        function ($scope, $rootScope) {

  getObservations();

  function getObservations() {
//        dataFactory.getObservations()
//            .success(function (data) {
//                angular.extend($scope, {
//                        geojson: {
//                            data: data,
//                            pointToLayer: function(feature, latlng){
//                                        return L.circleMarker(latlng, style());
//                                    },
//                            resetStyleOnMouseout: true
//                        }
//                    });
//
//            })
//            .error(function (error) {
//                $scope.status = 'Unable to load observation data: ' + error.message;
//            });
    }

  function style(feature) {
                return {
                    radius: 4,
                    fillColor: "#f7685c",
                    color: "#c24138",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.7
                };
            }
//
//  $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, featureSelected, leafletEvent) {
//                obsClick(featureSelected, leafletEvent);
//            });
//
//  $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, leafletEvent) {
//                obsMouseover(leafletEvent);
//            });
//
//  $scope.$on("leafletDirectiveMap.geojsonMouseout", function(ev, leafletEvent) {
//                obsMouseout(leafletEvent);
//            });


    angular.extend($scope, {
        seattle: {
            lat: 47.6033068,
            lng: -122.3077322,
            zoom: 10
        },
        tiles: {
            url: "https://{s}.tiles.mapbox.com/v3/americanredcross.hcji22de/{z}/{x}/{y}.png"
        },
        defaults: {
            scrollWheelZoom: false
        }
    });

//    function obsClick(observation, event) {
//                console.log(observation.properties.comment);
//
//
//            }
//
//    // Mouse over function, called from the Leaflet Map Events
//    function obsMouseover(leafletEvent) {
//        var layer = leafletEvent.target;
//        layer.setStyle({
//            radius: 10,
//            fillColor: "#f7685c",
//            color: "#c24138",
//            weight: 1,
//            opacity: 1,
//            fillOpacity: 1
//        });
//        layer.bringToFront();
//
//        putComment(layer.feature.properties.comment);
//
//        console.log(layer.feature.properties.comment);
//    }
//
//    function obsMouseout(leafletEvent) {
//        var layer = leafletEvent.target;
//        layer.setStyle({
//            radius: 4,
//            fillColor: "#f7685c",
//            color: "#c24138",
//            weight: 1,
//            opacity: 1,
//            fillOpacity: 0.7
//        });
//
//    }
//
//    function putComment(text){
//
//      $rootScope.obsText = text;
//
//
//    }
  
    



}]);
