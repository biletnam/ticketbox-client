'use strict';

describe('ticketbox.boxoffice.events', function () {
    var $firebaseArray, $firebaseObject, $timeout, scope, ref, fbarray, byIdSpy, byPathSpy;
    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is the first object'
        },
        'id2': {
            'name': 'This is the second object'
        }
    };

    beforeEach(function () {
        module('ticketbox.boxoffice.events');

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

            $controller('EventsCtrl', {$scope: scope, fbarray: fbarray});
            scope.$digest();
        });
    });

    describe('EventsCtrl', function () {
        describe('$scope.events', function () {
            it('should fetch events', function () {
                expect(byPathSpy).toHaveBeenCalledWith('/events');
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

    function _flush() {
        ref.flush();
        $timeout.flush();
    }
});