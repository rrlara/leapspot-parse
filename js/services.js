var app = angular.module('leapspot')
    .factory('dataFactory', ['$http', function($http) {

    var dataFactory = {};

    dataFactory.getObservations = function () {

//        var url = "https://s3-us-west-2.amazonaws.com/worldcup14/Observations.json";
//        // var url = 'data/Observations.json';
//        return $http.get(url);
    };

    return dataFactory;


}]);
