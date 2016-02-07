'use strict';

describe('ticketbox.admin.event', function () {
    var $firebaseArray, $firebaseObject, $timeout, scope, ref, fbarray, fbobject, routeParams, byIdSpy, byPathSpy;
    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is the first object'
        },
        'id2': {
            'name': 'This is the second object'
        }
    };

    beforeEach(function () {
        module('ticketbox.admin.event');

        inject(function (_$firebaseArray_, _$firebaseObject_, _$timeout_, _$rootScope_, $controller) {
            $firebaseArray = _$firebaseArray_;
            $firebaseObject = _$firebaseObject_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();
            fbarray = {
                byPath: function() {
                    return _makeArray(FIXTURE_DATA, ref);
                },
                byChildValue: function() {
                    return _makeArray(FIXTURE_DATA, ref);
                }
            };
            fbobject = {
                byId: function() {
                    return _makeObject(FIXTURE_DATA, ref);
                }
            };
            routeParams = {
                eventId: 'id1'
            };

            byPathSpy = spyOn(fbarray, 'byPath').and.returnValue(_makeArray(FIXTURE_DATA, ref));

            byIdSpy = spyOn(fbobject, 'byId').and.returnValue(_makeObject(FIXTURE_DATA, ref));

            $controller('EventCtrl', {$scope: scope, fbarray: fbarray, fbobject: fbobject, $routeParams: routeParams});
            scope.$digest();
        });
    });

    describe('EventCtrl', function () {
        describe('$scope.event', function () {
            it('should fetch the event with id1', function () {
                expect(byIdSpy).toHaveBeenCalled();
            });
        });

        describe('$scope.eventBlocks', function () {
            it('should fetch the blocks of event id1', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/events/id1/blocks');
            });
        });

        describe('$scope.blocks', function () {
            it('should fetch the blocks of event id1', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/blocks');
            });
        });

        describe('$scope.categories', function () {
            it('should fetch the blocks of event id1', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/categories');
            });
        });

        describe('$scope.addBlock()', function() {
            it('should add a block', function () {
                var initialDataLength = scope.eventBlocks.length;
                scope.addBlock('id1', 'id2');
                _flush();
                var eventualDataLength = scope.eventBlocks.length;
                expect(eventualDataLength).toEqual(initialDataLength + 1);
            });

            it('should empty the newBlockId variable', function () {
                scope.newBlockId = 'id1';
                scope.addBlock('id1', 'id2');
                _flush();
                expect(scope.newBlockId).toEqual(undefined);
            });

            it('should empty the newCategoryId variable', function () {
                scope.newCategoryId = 'id1';
                scope.addBlock('id1', 'id2');
                _flush();
                expect(scope.newCategoryId).toEqual(undefined);
            });
        });

        describe('$scope.removeBlock()', function() {
            it('should remove an item', function () {
                var item = scope.eventBlocks.$getRecord('id1');
                expect(scope.eventBlocks).toContain(item);
                scope.removeBlock(item);
                _flush();
                expect(scope.eventBlocks).not.toContain(item);
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