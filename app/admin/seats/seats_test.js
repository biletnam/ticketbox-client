'use strict';

describe('ticketbox.admin.seats', function () {
    var $firebaseArray, $timeout, scope, ref, array;

    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is seat 1'
        },
        'id2': {
            'name': 'This is seat 2'
        }
    };

    beforeEach(function () {
        module('ticketbox.admin.seats');

        inject(function (_$firebaseArray_, _$timeout_, _$rootScope_, $controller) {
            $firebaseArray = _$firebaseArray_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();
            array = function() {
                return _makeArray(FIXTURE_DATA, ref);
            };

            $controller('SeatsCtrl', {$scope: scope, array: array});
            scope.$digest();
        });
    });

    describe('SeatsCtrl', function () {
        describe('$scope.seats', function() {
            it('should contain all items', function() {
                expect(scope.seats.$getRecord('id1')).not.toBeNull();
                expect(scope.seats.$getRecord('id2')).not.toBeNull();
            });
        });

        describe('$scope.add()', function() {
            it('should add 5 items with name new seat', function () {
                scope.add('new seat', 1, 3);
                _flush();
                var numberOfSeatsWithNameNewSeat = 0;
                for (var key in scope.seats) {
                    if (key == parseInt(key) && scope.seats[key].name == 'new seat') {
                        numberOfSeatsWithNameNewSeat += 1;
                    }
                }
                expect(numberOfSeatsWithNameNewSeat).toEqual(3);
            });

            it('should add 5 items with number in name pattern', function () {
                var initialDataLength = scope.seats.length;
                scope.add('new seat {i}', 1, 3);
                _flush();
                var names = [];
                for (var key in scope.seats) {
                    if (key == parseInt(key)) {
                        names.push(scope.seats[key].name);
                    }
                }
                expect(names).toContain('new seat 1');
                expect(names).toContain('new seat 2');
                expect(names).toContain('new seat 3');
            });

            it('should empty the namePrefix variable', function () {
                scope.namePattern = 'name pattern';
                scope.add('new seat', 1, 1);
                _flush();
                expect(scope.namePattern).toEqual('');
            });

            it('should reset the startSeatNumber variable', function () {
                scope.startSeatNumber = 100;
                scope.add('new seat', 1, 1);
                _flush();
                expect(scope.startSeatNumber).toEqual(1);
            });

            it('should reset the endSeatNumber variable', function () {
                scope.endSeatNumber = 150;
                scope.add('new seat', 1, 1);
                _flush();
                expect(scope.endSeatNumber).toEqual(1);
            });
        });

        describe('$scope.remove()', function () {
            it('should remove an item', function () {
                var item = scope.seats.$getRecord('id1');
                expect(scope.seats).toContain(item);
                scope.remove(item);
                _flush();
                expect(scope.seats).not.toContain(item);
            });
        });
    });

    function _makeArray(initialData, ref) {
        if (!ref) {
            ref = _stubRef();
        }
        var obj = $firebaseArray(ref);
        if (angular.isDefined(initialData)) {
            ref.ref().set(initialData);
            ref.flush();
            $timeout.flush();
        }
        return obj;
    }

    function _stubRef() {
        return new MockFirebase('Mock://');
    }

    function _flush() {
        ref.flush();
        $timeout.flush();
    }
});