'use strict';

describe('ticketbox.components.locker', function () {
    describe('locker', function () {
        var locker, refSetSpy, refRemoveSpy, byChildValueSpy;

        beforeEach(module('ticketbox.components.locker', function ($provide) {
            var ref = _stubRef();
            refSetSpy = spyOn(ref, 'set');
            refRemoveSpy = spyOn(ref, 'remove');
            var fbref = function () {
                return ref;
            };
            $provide.value('fbref', fbref);

            var rootScope = {
                'authData': {
                    'uid': 'uid'
                }
            };
            $provide.value('$rootScope', rootScope);

            var serverValue = {
                currentTimestamp: function () {
                    return 123;
                }
            };
            $provide.value('serverValue', serverValue);

            $provide.value('separator', ':');

            var fbarray = {
                byChildValue: function() {}
            };
            byChildValueSpy = spyOn(fbarray, 'byChildValue').and.returnValue('myLocks');
            $provide.value('fbarray', fbarray);
        }));

        beforeEach(inject(function (_locker_) {
            locker = _locker_;
        }));

        describe('locker.lock()', function() {
            it('should call ref.set()', function () {
                expect(refSetSpy).not.toHaveBeenCalled();
                locker.lock('eid', 'sid');
                expect(refSetSpy).toHaveBeenCalledWith({'eventId': 'eid', 'uid': 'uid', 'timestamp': 123}, jasmine.any(Function));
            });
        });

        describe('locker.unlock()', function() {
            it('should call ref.remove() when lock is released', function () {
                expect(refRemoveSpy).not.toHaveBeenCalled();
                locker.unlock('eid', 'sid');
                expect(refRemoveSpy).toHaveBeenCalledWith(jasmine.any(Function));
            });
        });

        describe('locker.getMyLocks()', function() {
            it('should fetch all locks with my uid', function() {
                expect(byChildValueSpy).not.toHaveBeenCalled();
                locker.getMyLocks();
                expect(byChildValueSpy).toHaveBeenCalledWith('/reservations', 'uid', 'uid');
            });
        });

        describe('locker.getLocksOfEvent()', function() {
            it('should fetch all locks for event eid when', function() {
                expect(byChildValueSpy).not.toHaveBeenCalled();
                locker.getLocksOfEvent('eid');
                expect(byChildValueSpy).toHaveBeenCalledWith('/reservations', 'eventId', 'eid');
            });
        });

        function _stubRef() {
            return new MockFirebase('Mock://');
        }
    });
});