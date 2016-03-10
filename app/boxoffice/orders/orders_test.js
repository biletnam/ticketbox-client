'use strict';

describe('ticketbox.boxoffice.orders', function () {
    var $firebaseArray, $firebaseObject, $timeout, scope, ref, fbarray, byPathSpy;
    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is the first object'
        },
        'id2': {
            'name': 'This is the second object'
        }
    };

    beforeEach(function () {
        module('ticketbox.boxoffice.orders');

        inject(function (_$firebaseArray_, _$firebaseObject_, _$timeout_, _$rootScope_, $controller) {
            $firebaseArray = _$firebaseArray_;
            $firebaseObject = _$firebaseObject_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();
            fbarray = {
                byPath: function() {
                    return _makeArray(FIXTURE_DATA, ref);
                }
            };

            byPathSpy = spyOn(fbarray, 'byPath').and.returnValue(_makeArray(FIXTURE_DATA, ref));

            $controller('OrdersCtrl', {$scope: scope, fbarray: fbarray});
            scope.$digest();
        });
    });

    describe('OrdersCtrl', function () {
        describe('$scope.orders', function () {
            it('should fetch orders', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/orders');
            });
        });
    });

    function _makeArray(initialData, fbref) {
        if (!fbref) {
            fbref = _stubRef();
        }
        var fbarray = $firebaseArray(fbref);
        if (angular.isDefined(initialData)) {
            fbref.ref().set(initialData);
            fbref.flush();
            $timeout.flush();
        }
        return fbarray;
    }

    function _stubRef() {
        return new MockFirebase('Mock://');
    }
});

describe('ticketbox.boxoffice.orders', function () {
    describe('statusFilter', function () {
        var statusFilter;

        beforeEach(function () {
            angular.mock.module('ticketbox.boxoffice.orders', function ($provide) {
                $provide.value('separator', ':');
            });

            inject(function ($filter) {
                statusFilter = $filter('statusFilter', {});
            });
        });

        it('should select pending orders', function () {
            var status = "pending";
            var pendingOrder = {"isSold": false};
            var soldOrder = {"isSold": true};
            var orders = [
                pendingOrder,
                soldOrder
            ];
            var pendingOrders = statusFilter(orders, status);
            expect(pendingOrders).toContain(pendingOrder);
            expect(pendingOrders).not.toContain(soldOrder);
        });

        it('should select sold orders', function () {
            var status = "sold";
            var pendingOrder = {"isSold": false};
            var soldOrder = {"isSold": true};
            var orders = [pendingOrder, soldOrder];
            var pendingOrders = statusFilter(orders, status);
            expect(pendingOrders).toContain(soldOrder);
            expect(pendingOrders).not.toContain(pendingOrder);
        });

        it('should select nothing if status is unknown', function () {
            var status = "unknown";
            var pendingOrder = {"isSold": false};
            var soldOrder = {"isSold": true};
            var orders = [pendingOrder, soldOrder];
            var pendingOrders = statusFilter(orders, status);
            expect(pendingOrders).not.toContain(soldOrder);
            expect(pendingOrders).not.toContain(pendingOrder);
        });
    });
});