'use strict';

angular.module('ticketbox.components.utils', [])
    .service('arrayModification', function($q) {
        return {
            removeAll: function(items) {
                var itemsToBeRemoved = [];
                for (var key in items) {
                    if (key == parseInt(key)) {
                        itemsToBeRemoved.push(items[key]);
                    }
                }
                var promises = [];
                for (var key in itemsToBeRemoved) {
                    promises.push(items.$remove(itemsToBeRemoved[key]));
                }
                return $q.all(promises);
            }
        }
    })

    .service('error', function($rootScope, $timeout) {
        return function(err) {
            $rootScope.error = angular.isObject(err) && err.code ? err.code : err + '';
            $timeout(function() { $rootScope.error = undefined; }, 2000);
        }
    })

    .filter('nameFilter', function() {
        return function(id, dictionary) {
            var item = dictionary.$getRecord(id);
            if (item !== null) {
                return item.name;
            } else {
                return '';
            }
        }
    });