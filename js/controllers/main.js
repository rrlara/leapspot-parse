/**
 * Created by renerodriguez on 11/16/14.
 */
// Change for your parse credentials here and remove the alert
//alert('Change for your parse credentials here and remove the alert');
// https://parse.com/apps/quickstart#js/existing
Parse.initialize("f978idlmBlmLY2CnQwovpPtQaFwvALWhDlf6RE53", "yFJzzjG5oasySFmbNPumsxCaUofcolddTUIDQAKK");

var app = angular.module('leapspot', ['angularParse']);

app.controller('MainCtrl', function($scope, $timeout, parsePersistence, parseQuery, $rootScope) {

    $scope.data = {
        items: [],
        total: 0
    }

//    $scope.itemsParse = [];

    var moments = $scope.data.items;

    // adds a new object to server
    $scope.add = function() {

        var testObject = parsePersistence.new('trueHeading');

        parsePersistence.save(testObject, {foo: "bar promise",text: "orale"})
            .then(function(object) {
                $scope.data.items.push(object);
                $scope.data.total++;
            }, function(error) {
                alert(JSON.stringify(error));
            });
    }

    var skip = 0;

    // retrieve a list of 1000 items from server and the total number of items
    $rootScope.find = function() {

       var limit = 7;

        var query = parseQuery.new('trueHeading');
//      var query = parseQuery.new('observations');

        query.limit(limit);
        query.descending("createAt");
        query.skip(skip);

        parseQuery.find(query)
            .then(function(results) {
                $scope.data.items = results;
//                if ($scope.data.items == 0){
//                    $scope.data.items = results;
//                }else{
//                    ($scope.data.items).push(results);
//                    $scope.data.total++;
//                }
//                ($scope.itemsParse).push(results);


                console.log(results);
                console.log($scope.itemsParse);
                $rootScope.pointData = results;

                $rootScope.points();

                skip = skip + limit;

//                console.log($scope.data.items);

                // nested promise :)
                return parseQuery.count(query);
            })
            .then(function(total) {
                $scope.data.total = total;
            }, function(error) {
                alert(JSON.stringify(error));
            });


    };


});

