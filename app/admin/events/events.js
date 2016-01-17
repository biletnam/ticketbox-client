'use strict';

angular.module('ticketbox.admin.events', ['ticketbox.firebase.utils', 'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/events', {
            controller: 'EventsCtrl',
            templateUrl: 'admin/events/events.html'
        });
    }])

    .controller('EventsCtrl', function ($scope, $location, ref, sync) {
        sync('/events').$bindTo($scope, 'events');

        $scope.add = function() {
            var newItemRef = ref('/events').push();
            $scope.events[newItemRef.key()] = { 'name': 'name' };
        };

        $scope.remove = function(event) {
            for (var key in $scope.events) {
                if ($scope.events[key] === event) {
                    delete $scope.events[key];
                    return;
                }
            }
        };

        function _errMessage(err) {
            return angular.isObject(err) && err.code ? err.code : err + '';
        }
    });
