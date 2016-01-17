'use strict';

describe('ticketbox.admin.events', function () {
    var $firebaseObject, $timeout, scope, ref, sync;

    var DEFAULT_ID = 'id1';

    var FIXTURE_DATA = {
        '$id': 'id1',
        '$priority': null,
        'id1': {
            'name': 'This is event 1'
        },
        'idUnavailable': {
            'name': 'This is event 2'
        }
    };

    beforeEach(function () {
        module('ticketbox.admin.events');

        inject(function (_$firebaseObject_, _$timeout_, _$rootScope_, $controller, $q) {
            $firebaseObject = _$firebaseObject_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = function() {
                return _stubRef();
            }
            sync = function() {
                return _makeObject(FIXTURE_DATA, ref());
            };

            $controller('EventsCtrl', {$scope: scope, ref: ref, sync: sync});
            scope.$digest();
        });
    });

    describe('EventsCtrl', function () {
        describe('$scope.events', function() {
           it('should contain all items', function() {
               expect(scope.events).toEqual(FIXTURE_DATA);
           });
        });

        describe('$scope.add()', function() {
            it('should add an item', function () {
                var initialDataLength = Object.keys(scope.events).length;
                scope.add();
                var eventualDataLength = Object.keys(scope.events).length;
                expect(eventualDataLength).toEqual(initialDataLength + 1);
            });
        });

        describe('$scope.remove()', function () {
            it('should remove an item', function () {
                var item = scope.events.id1;
                scope.remove(item);
                expect(Object.keys(scope.events)).not.toContain('id1');
            });
        });
    });

    function _makeObject(initialData, ref) {
        if (!ref) {
            ref = _stubRef();
        }
        var obj = $firebaseObject(ref);
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
});