'use strict';

describe('ticketbox.admin.events', function () {
    var $firebaseArray, $timeout, scope, ref, array;

    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is event 1'
        },
        'id2': {
            'name': 'This is event 2'
        }
    };

    beforeEach(function () {
        module('ticketbox.admin.events');

        inject(function (_$firebaseArray_, _$timeout_, _$rootScope_, $controller) {
            $firebaseArray = _$firebaseArray_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();
            array = {
                byPath: function() {
                    return _makeArray(FIXTURE_DATA, ref);
                }
            };

            $controller('EventsCtrl', {$scope: scope, array: array});
            scope.$digest();
        });
    });

    describe('EventsCtrl', function () {
        describe('$scope.events', function() {
           it('should contain all items', function() {
               expect(scope.events.$getRecord('id1')).not.toBeNull();
               expect(scope.events.$getRecord('id2')).not.toBeNull();
           });
        });

        describe('$scope.add()', function() {
            it('should add an item', function () {
                var initialDataLength = scope.events.length;
                scope.add('new event name');
                _flush();
                var eventualDataLength = scope.events.length;
                expect(eventualDataLength).toEqual(initialDataLength + 1);
            });

            it('should empty the newEventName variable', function () {
                scope.newEventName = 'newEventNameValue';
                scope.add('new event name');
                _flush();
                expect(scope.newEventName).toEqual('');
            });
        });

        describe('$scope.remove()', function () {
            it('should remove an item', function () {
                var item = scope.events.$getRecord('id1');
                expect(scope.events).toContain(item);
                scope.remove(item);
                _flush();
                expect(scope.events).not.toContain(item);
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