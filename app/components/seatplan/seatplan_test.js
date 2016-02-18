'use strict';

describe('ticketbox.components.seatplan', function () {
    describe('handlers', function () {
        var handlers, applySeatStyleSpy, lockSpy, unlockSpy;

        beforeEach(module('ticketbox.components.seatplan', function ($provide) {
            var draw = {
                applySeatStyle: function () {
                }
            };
            applySeatStyleSpy = spyOn(draw, 'applySeatStyle');
            $provide.value('draw', draw);

            var locker = {
                lock: function () {
                },
                unlock: function () {
                }
            };
            lockSpy = spyOn(locker, 'lock');
            unlockSpy = spyOn(locker, 'unlock');
            $provide.value('locker', locker);
        }));

        beforeEach(inject(function (_handlers_) {
            handlers = _handlers_;
        }));

        describe('draw()', function () {
            it('should use draw.applySeatStyle()', function () {
                var event = {'$id': 'e1'};
                var seat = {'$id': 's1'};
                var element = {};
                var reservationState = 'free';
                expect(applySeatStyleSpy).not.toHaveBeenCalled();
                handlers.draw(event, seat, element, reservationState);
                expect(applySeatStyleSpy).toHaveBeenCalledWith(element, reservationState, false);
            });
        });

        describe('click()', function () {
            it('should reserve seat if the seat is free', function () {
                var event = {'$id': 'e1'};
                var seat = {$id: 's1'};
                var element = undefined;
                var reservationState = 'free';
                expect(lockSpy).not.toHaveBeenCalled();
                expect(unlockSpy).not.toHaveBeenCalled();
                handlers.click(event, seat, element, reservationState);
                expect(lockSpy).toHaveBeenCalled();
                expect(unlockSpy).not.toHaveBeenCalled();
            });

            it('should release the seat if the seat is locked by myself', function () {
                var event = {'$id': 'e1'};
                var seat = {$id: 's1'};
                var element = undefined;
                var reservationState = 'lockedByMyself';
                expect(lockSpy).not.toHaveBeenCalled();
                expect(unlockSpy).not.toHaveBeenCalled();
                handlers.click(event, seat, element, reservationState);
                expect(lockSpy).not.toHaveBeenCalled();
                expect(unlockSpy).toHaveBeenCalled();
            });

            it('should do nothing if the seat is locked', function () {
                var event = {'$id': 'e1'};
                var seat = {$id: 's1'};
                var element = undefined;
                var reservationState = 'locked';
                expect(lockSpy).not.toHaveBeenCalled();
                expect(unlockSpy).not.toHaveBeenCalled();
                handlers.click(event, seat, element, reservationState);
                expect(lockSpy).not.toHaveBeenCalled();
                expect(unlockSpy).not.toHaveBeenCalled();
            });
        });

        describe('mouseenter()', function () {
            it('should use draw.applySeatStyle()', function () {
                var event = {'$id': 'e1'};
                var seat = {'$id': 's1'};
                var element = {};
                var reservationState = 'free';
                expect(applySeatStyleSpy).not.toHaveBeenCalled();
                handlers.mouseenter(event, seat, element, reservationState);
                expect(applySeatStyleSpy).toHaveBeenCalledWith(element, reservationState, true);
            });
        });

        describe('mouseleave()', function () {
            it('should use draw.applySeatStyle()', function () {
                var event = {'$id': 'e1'};
                var seat = {'$id': 's1'};
                var element = {};
                var reservationState = 'free';
                expect(applySeatStyleSpy).not.toHaveBeenCalled();
                handlers.mouseleave(event, seat, element, reservationState);
                expect(applySeatStyleSpy).toHaveBeenCalledWith(element, reservationState, false);
            });
        });
    });

    describe('draw', function () {
        var draw;

        beforeEach(module('ticketbox.components.seatplan', function ($provide) {
            var styles = {
                'free': {'background': 'fb', 'stroke': 'fs', 'opacity': 0.0},
                'freeHover': {'background': 'fhb', 'stroke': 'fhs', 'opacity': 0.1},
                'locked': {'background': 'lb', 'stroke': 'ls', 'opacity': 0.2},
                'lockedByMyself': {'background': 'lbmsb', 'stroke': 'lbmss', 'opacity': 0.3}
            };
            $provide.value('styles', styles);
        }));

        beforeEach(inject(function (_draw_) {
            draw = _draw_;
        }));

        describe('applySeatStyle()', function () {
            it('should apply free style if state is free and it is not hovered', function () {
                var element = {};
                var reservationState = 'free';
                var isHovered = false;
                draw.applySeatStyle(element, reservationState, isHovered);
                expect(element.fill).toEqual('fb');
                expect(element.stroke).toEqual('fs');
                expect(element.opacity).toEqual(0.0);
            });

            it('should apply freeHover style if state is free and it is hovered', function () {
                var element = {};
                var reservationState = 'free';
                var isHovered = true;
                draw.applySeatStyle(element, reservationState, isHovered);
                expect(element.fill).toEqual('fhb');
                expect(element.stroke).toEqual('fhs');
                expect(element.opacity).toEqual(0.1);
            });

            it('should apply locked style if state is locked and it is not hovered', function () {
                var element = {};
                var reservationState = 'locked';
                var isHovered = false;
                draw.applySeatStyle(element, reservationState, isHovered);
                expect(element.fill).toEqual('lb');
                expect(element.stroke).toEqual('ls');
                expect(element.opacity).toEqual(0.2);
            });

            it('should apply locked style if state is locked and it is hovered', function () {
                var element = {};
                var reservationState = 'locked';
                var isHovered = true;
                draw.applySeatStyle(element, reservationState, isHovered);
                expect(element.fill).toEqual('lb');
                expect(element.stroke).toEqual('ls');
                expect(element.opacity).toEqual(0.2);
            });

            it('should apply lockedByMyself style if state is lockedByMyself and it is not hovered', function () {
                var element = {};
                var reservationState = 'lockedByMyself';
                var isHovered = false;
                draw.applySeatStyle(element, reservationState, isHovered);
                expect(element.fill).toEqual('lbmsb');
                expect(element.stroke).toEqual('lbmss');
                expect(element.opacity).toEqual(0.3);
            });

            it('should apply lockedByMyself style if state is lockedByMyself and it is hovered', function () {
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

    describe('reservationState', function () {
        var reservationState;

        beforeEach(module('ticketbox.customer.seats', function ($provide) {
            $provide.value('separator', ':');
        }));

        beforeEach(inject(function (_reservationState_) {
            reservationState = _reservationState_;
        }));

        describe('get()', function () {
            it('should return free if reservations is null', function () {
                var seat = {
                    '$id': 'sid1'
                };
                var uid = 'uid1';
                var reservations = null;
                var state = reservationState.get(seat, uid, reservations);
                expect(state).toEqual('free');
            });

            it('should return free if no reservation can be found for given seat', function () {
                var seat = {
                    '$id': 'sid1'
                };
                var uid = 'uid1';
                var reservations = [{'$id': 'eid1:sid2'}];
                var state = reservationState.get(seat, uid, reservations);
                expect(state).toEqual('free');
            });

            it('should return lockedByMyself if a reservation is found and the uid is the given uid', function () {
                var seat = {
                    '$id': 'sid1'
                };
                var uid = 'uid1';
                var reservations = [{'$id': 'eid1:sid1', 'uid': 'uid1'}];
                var state = reservationState.get(seat, uid, reservations);
                expect(state).toEqual('lockedByMyself');
            });

            it('should return locked if a reservation is found and the uid is not the given uid', function () {
                var seat = {
                    '$id': 'sid1'
                };
                var uid = 'uid1';
                var reservations = [{'$id': 'eid1:sid1', 'uid': 'uid2'}];
                var state = reservationState.get(seat, uid, reservations);
                expect(state).toEqual('locked');
            });

            it('should return locked if a reservation is found and the orderId is not undefined', function () {
                var seat = {
                    '$id': 'sid1'
                };
                var uid = 'uid1';
                var reservations = [{'$id': 'eid1:sid1', 'uid': 'uid1', 'orderId': 'oid1'}];
                var state = reservationState.get(seat, uid, reservations);
                expect(state).toEqual('locked');
            });
        });
    });
});