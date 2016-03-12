'use strict';

angular.module('ticketbox.customer.toolbar', ['ticketbox.components.firebase', 'ticketbox.components.locker'])

    .controller('ToolbarCtrl', function ($scope, fbarray, locker) {
        $scope.locks = locker.getMyLocks();
        $scope.allEvents = fbarray.byPath('/events');
        $scope.allSeats = fbarray.byPath('/seats');
        $scope.allBlocks = fbarray.byPath('/blocks');
        $scope.allCategories = fbarray.byPath('/categories');
    });