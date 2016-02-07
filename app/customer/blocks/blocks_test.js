'use strict';

describe('ticketbox.customer.blocks', function () {
    var $firebaseArray, $firebaseObject, $timeout, scope, ref, fbarray, fbobject, byIdSpy, byPathSpy;
    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is the first object'
        },
        'id2': {
            'name': 'This is the second object'
        }
    };

    beforeEach(function () {
        module('ticketbox.customer.blocks');

        inject(function (_$firebaseArray_, _$firebaseObject_, _$timeout_, _$rootScope_, _fbarray_, _fbobject_, $controller) {
            $firebaseArray = _$firebaseArray_;
            $firebaseObject = _$firebaseObject_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();

            fbarray = _fbarray_;
            byPathSpy = spyOn(fbarray, 'byPath').and.returnValue(_makeArray(FIXTURE_DATA, ref));

            fbobject = _fbobject_;
            byIdSpy = spyOn(fbobject, 'byId').and.returnValue(_makeObject(FIXTURE_DATA, ref));

            var routeParams = {
                eventId: 'id1'
            };

            $controller('BlocksCtrl', {$scope: scope, fbarray: fbarray, fbobject: fbobject, $routeParams: routeParams});
            scope.$digest();
        });
    });

    describe('BlocksCtrl', function () {
        describe('$scope.event', function () {
            it('should fetch event', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/events', 'id1');
            });
        });

        describe('$scope.eventBlocks', function () {
            it('should fetch eventBlocks', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/events/id1/blocks');
            });
        });

        describe('$scope.blocks', function () {
            it('should fetch blocks', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/blocks');
            });
        });

        describe('$scope.categories', function () {
            it('should fetch categories', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/categories');
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

    function _makeObject(initialData, fbref) {
        if (!fbref) {
            fbref = _stubRef();
        }
        var obj = $firebaseObject(fbref);
        if (angular.isDefined(initialData)) {
            fbref.ref().set(initialData);
            fbref.flush();
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