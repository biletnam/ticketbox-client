'use strict';

describe('ticketbox.customer.seats', function () {
    var $firebaseArray,
        $firebaseObject,
        $timeout,
        scope,
        ref,
        fbarray,
        fbobject,
        locker,
        byPathSpy,
        byChildValueSpy,
        byIdSpy,
        lockSpy,
        unlockSpy,
        draw,
        applySeatStyleSpy;
    var FIXTURE_DATA = {
        'id1': {
            'name': 'This is the first object'
        },
        'id2': {
            'name': 'This is the second object'
        }
    };

    beforeEach(function () {
        module('ticketbox.customer.seats');

        inject(function (_$firebaseArray_, _$firebaseObject_, _$timeout_, _$rootScope_, _fbarray_, _fbobject_, _locker_, _draw_, $controller) {
            $firebaseArray = _$firebaseArray_;
            $firebaseObject = _$firebaseObject_;
            $timeout = _$timeout_;
            scope = _$rootScope_.$new();
            ref = _stubRef();

            fbarray = _fbarray_;
            byPathSpy = spyOn(fbarray, 'byPath').and.returnValue(_makeArray(FIXTURE_DATA, ref));
            byChildValueSpy = spyOn(fbarray, 'byChildValue').and.returnValue(_makeArray(FIXTURE_DATA, ref));

            fbobject = _fbobject_;
            byIdSpy = spyOn(fbobject, 'byId').and.returnValue(_makeObject(FIXTURE_DATA, ref));

            locker = _locker_;
            lockSpy = spyOn(locker, 'lock');
            unlockSpy = spyOn(locker, 'unlock');

            draw = _draw_;
            applySeatStyleSpy = spyOn(draw, 'applySeatStyle');

            var routeParams = {
                eventId: 'eid1',
                blockId: 'bid1',
                categoryId: 'cid1'
            };

            $controller('SeatsCtrl', {$scope: scope, fbarray: fbarray, fbobject: fbobject, locker: locker, $routeParams: routeParams});
            scope.$digest();
        });
    });

    describe('SeatsCtrl', function () {
        describe('$scope.event', function () {
            it('should fetch event', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/events', 'eid1');
            });
        });

        describe('$scope.category', function () {
            it('should fetch category', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/categories', 'cid1');
            });
        });

        describe('$scope.block', function () {
            it('should fetch block', function () {
                expect(byIdSpy).toHaveBeenCalledWith('/blocks', 'bid1');
            });
        });

        describe('$scope.seats', function () {
            it('should fetch seats', function () {
                expect(byChildValueSpy).toHaveBeenCalledWith('/seats', 'blockId', 'bid1');
            });
        });

        describe('$scope.reservations', function () {
            it('should fetch reservations for event', function() {
                expect(byChildValueSpy).toHaveBeenCalledWith('/reservations', 'eventId', 'eid1');
            });
        });

        describe('$scope.handlers.draw()', function() {
            it('should use draw.applySeatStyle()', function() {
                var seat = { '$id': 's1' };
                var element = {};
                var reservationState = 'free';
                expect(applySeatStyleSpy).not.toHaveBeenCalled();
                scope.handlers.draw(seat, element, reservationState);
                expect(applySeatStyleSpy).toHaveBeenCalledWith(element, reservationState, false);
            });
        });

        describe('$scope.handlers.click()', function() {
            it('should reserve seat if the seat is free', function() {
                var seat = { $id: 's1' };
                var element = undefined;
                var reservationState = 'free';
                expect(lockSpy).not.toHaveBeenCalled();
                expect(unlockSpy).not.toHaveBeenCalled();
                scope.handlers.click(seat, element, reservationState);
                expect(lockSpy).toHaveBeenCalled();
                expect(unlockSpy).not.toHaveBeenCalled();
            });

            it('should release the seat if the seat is locked by myself', function() {
                var seat = { $id: 's1' };
                var element = undefined;
                var reservationState = 'lockedByMyself';
                expect(lockSpy).not.toHaveBeenCalled();
                expect(unlockSpy).not.toHaveBeenCalled();
                scope.handlers.click(seat, element, reservationState);
                expect(lockSpy).not.toHaveBeenCalled();
                expect(unlockSpy).toHaveBeenCalled();
            });

            it('should do nothing if the seat is locked', function() {
                var seat = { $id: 's1' };
                var element = undefined;
                var reservationState = 'locked';
                expect(lockSpy).not.toHaveBeenCalled();
                expect(unlockSpy).not.toHaveBeenCalled();
                scope.handlers.click(seat, element, reservationState);
                expect(lockSpy).not.toHaveBeenCalled();
                expect(unlockSpy).not.toHaveBeenCalled();
            });
        });

        describe('$scope.handlers.mouseenter()', function() {
            it('should use draw.applySeatStyle()', function() {
                var seat = { '$id': 's1' };
                var element = {};
                var reservationState = 'free';
                expect(applySeatStyleSpy).not.toHaveBeenCalled();
                scope.handlers.mouseenter(seat, element, reservationState);
                expect(applySeatStyleSpy).toHaveBeenCalledWith(element, reservationState, true);
            });
        });

        describe('$scope.handlers.mouseleave()', function() {
            it('should use draw.applySeatStyle()', function() {
                var seat = { '$id': 's1' };
                var element = {};
                var reservationState = 'free';
                expect(applySeatStyleSpy).not.toHaveBeenCalled();
                scope.handlers.mouseleave(seat, element, reservationState);
                expect(applySeatStyleSpy).toHaveBeenCalledWith(element, reservationState, false);
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

describe('ticketbox.customer.seats', function() {
    describe('draw', function () {
        var draw;

        beforeEach(module('ticketbox.customer.seats', function($provide) {
            var styles = {
                'free': { 'background': 'fb', 'stroke': 'fs', 'opacity': 0.0 },
                'freeHover': { 'background': 'fhb', 'stroke': 'fhs', 'opacity': 0.1 },
                'locked': { 'background': 'lb', 'stroke': 'ls', 'opacity': 0.2 },
                'lockedByMyself': { 'background': 'lbmsb', 'stroke': 'lbmss', 'opacity': 0.3 }
            };
            $provide.value('styles', styles);
        }));

        beforeEach(inject(function (_draw_) {
            draw = _draw_;
        }));

        describe('applySeatStyle()', function() {
            it('should apply free style if state is free and it is not hovered', function() {
                var element = {};
                var reservationState = 'free';
                var isHovered = false;
                draw.applySeatStyle(element, reservationState, isHovered);
                expect(element.fill).toEqual('fb');
                expect(element.stroke).toEqual('fs');
                expect(element.opacity).toEqual(0.0);
            });

            it('should apply freeHover style if state is free and it is hovered', function() {
                var element = {};
                var reservationState = 'free';
                var isHovered = true;
                draw.applySeatStyle(element, reservationState, isHovered);
                expect(element.fill).toEqual('fhb');
                expect(element.stroke).toEqual('fhs');
                expect(element.opacity).toEqual(0.1);
            });

            it('should apply locked style if state is locked and it is not hovered', function() {
                var element = {};
                var reservationState = 'locked';
                var isHovered = false;
                draw.applySeatStyle(element, reservationState, isHovered);
                expect(element.fill).toEqual('lb');
                expect(element.stroke).toEqual('ls');
                expect(element.opacity).toEqual(0.2);
            });

            it('should apply locked style if state is locked and it is hovered', function() {
                var element = {};
                var reservationState = 'locked';
                var isHovered = true;
                draw.applySeatStyle(element, reservationState, isHovered);
                expect(element.fill).toEqual('lb');
                expect(element.stroke).toEqual('ls');
                expect(element.opacity).toEqual(0.2);
            });

            it('should apply lockedByMyself style if state is lockedByMyself and it is not hovered', function() {
                var element = {};
                var reservationState = 'lockedByMyself';
                var isHovered = false;
                draw.applySeatStyle(element, reservationState, isHovered);
                expect(element.fill).toEqual('lbmsb');
                expect(element.stroke).toEqual('lbmss');
                expect(element.opacity).toEqual(0.3);
            });

            it('should apply lockedByMyself style if state is lockedByMyself and it is hovered', function() {
                var element = {};
                var reservationState = 'lockedByMyself';
                var isHovered = true;
                draw.applySeatStyle(element, reservationState, isHovered);
                expect(element.fill).toEqual('lbmsb');
                expect(element.stroke).toEqual('lbmss');
                expect(element.opacity).toEqual(0.3);
            });
        });
    });
});