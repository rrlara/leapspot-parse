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

    $rootScope.itemsParse = [];

    var moments = $scope.data.items;

    // adds a new object to server
    $scope.add = function() {

        var testObject = parsePersistence.new('HawaiiTrip');

        parsePersistence.save(testObject, {foo: "bar promise",text: "orale"})
            .then(function(object) {
                $scope.data.items.push(object);
                $scope.data.total++;
            }, function(error) {
                alert(JSON.stringify(error));
            });
    }

//    var skip = 0;

    // retrieve a list of 1000 items from server and the total number of items
    $rootScope.find = function() {

//       var limit = 1;

        var query = parseQuery.new('HawaiiTrip');

//        query.limit(limit);
        query.descending("createAt");
//        query.skip(skip);

        parseQuery.find(query)
            .then(function(results) {
//                $scope.data.items = results;
//                if ($scope.data.items == 0){
//                    $scope.data.items = results;
//                }else{
//                    ($scope.data.items).push(results);
//                    $scope.data.total++;
//                }
                for (var i = 0; i < results.length; i++) {
                    ($rootScope.itemsParse).push(results[i]);
                }



                console.log(results);
                console.log($scope.itemsParse);
                $rootScope.pointData = $rootScope.itemsParse;

                getPercentage();

                $rootScope.points();

                MiniProgressBar();



//                skip = skip + limit;

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

    var count= 0;
    $scope.momentObj = {};

    var getPercentage = function(){





        for (var i = 0; i < $rootScope.pointData.length; i++) {

            console.log($rootScope.pointData[i].id);

            var momentID = $rootScope.pointData[i].id;

            count++;

            var percent = (100 / $rootScope.pointData.length) * count;

            $scope.momentObj[momentID] = percent;

        }

        console.log("obj: ", $scope.momentObj);
    }


    ///////MINI-POGRESS BAR
    var MiniProgressBar = function() {

        var defaultStyle =  {
            position: 'absolute',
            left: 0,
            bottom: "0px",
            height: '3px',
            display: 'inline-block',
            background: '#cd011e',
            'z-index': 2
        };

        $rootScope.pg = {};

        // create an element and apply default style
        var div = document.createElement('div');
        div.setAttribute('class', 'oddysey-miniprogressbar');
        for (var s in defaultStyle) {
            div.style[s] = defaultStyle[s];
        }

        // append to element or to tge body
//        (document.body).appendChild(div);
        document.getElementById("map").appendChild(div);

        /**
         * returns an action that moves the percentaje bar to the specified one
         */
        $rootScope.pg.percent = function(p) {
//            return Action(function() {
//                div.style.width = p + "%";
//            });
            div.style.width = p + "%";
        };

//        return pg;
    }


});
