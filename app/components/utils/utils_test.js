'use strict';

describe('ticketbox.components.utils', function () {
    describe('nameFilter', function () {
        var nameFilter;

        beforeEach(function () {
            angular.mock.module('ticketbox.components.utils', function ($provide) {
                $provide.value('separator', ':');
            });

            inject(function ($filter) {
                nameFilter = $filter('nameFilter', {});
            });
        });

        it('should select item from list and return its name', function () {
            var id = "id1";
            var list = [
                {"$id": "id2", "name": "Name 2"},
                {"$id": "id1", "name": "Name 1"}
            ];
            var name = nameFilter(id, list);
            expect(name).toEqual("Name 1");
        });

        it('should return empty string if item does not exist', function () {
            var id = "id3";
            var list = [
                {"$id": "id2", "name": "Name 2"},
                {"$id": "id1", "name": "Name 1"}
            ];
            var name = nameFilter(id, list);
            expect(name).toEqual("");
        });
    });

    describe('locker', function () {
        var locker, refSetSpy, refRemoveSpy, byChildValueSpy;

        beforeEach(module('ticketbox.components.utils', function ($provide) {
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
                timestamp: function () {
                    return 123;
                }
            };
            $provide.value('serverValue', serverValue);

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
            it('should fetch all locks with my uid when getMyLocks', function() {
                expect(byChildValueSpy).not.toHaveBeenCalled();
                locker.getMyLocks();
                expect(byChildValueSpy).toHaveBeenCalledWith('/reservations', 'uid', 'uid');
            });
        });

        describe('locker.getMyLocks()', function() {
            it('should fetch all locks with my uid when getMyLocks', function() {
                expect(byChildValueSpy).not.toHaveBeenCalled();
                locker.getLocksOfEvent('eid');
                expect(byChildValueSpy).toHaveBeenCalledWith('/reservations', 'eventId', 'eid');
            });
        });

        function _stubRef() {
            return new MockFirebase('Mock://');
        }
    });

    describe('coordinates', function () {
        var coordinates;

        beforeEach(module('ticketbox.components.utils'));

        beforeEach(inject(function (_coordinates_) {
            coordinates = _coordinates_;
        }));

        describe('seatToCoordiantes()', function() {
            it('should return array of x-y-coordinates', function() {
                var seat = {
                    x0: 0, y0: 1,
                    x1: 2, y1: 3,
                    x2: 4, y2: 5,
                    x3: 6, y3: 7
                };
                var c = coordinates.seatToCoordinates(seat);
                expect(c).toEqual([
                    { x: 0, y: 1 },
                    { x: 2, y: 3 },
                    { x: 4, y: 5 },
                    { x: 6, y: 7 }
                ]);
            });
        });
    });
});