'use strict';

describe('ticketbox.components.utils', function () {
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

    describe('displayNameFilter', function () {
        var displayNameFilter;

        beforeEach(function () {
            angular.mock.module('ticketbox.components.utils', function ($provide) {
                $provide.value('separator', ':');
            });

            inject(function ($filter) {
                displayNameFilter = $filter('displayNameFilter', {});
            });
        });

        it('should select item from list and return its displayName', function () {
            var id = "id1";
            var list = [
                {"$id": "id2", "displayName": "Name 2"},
                {"$id": "id1", "displayName": "Name 1"}
            ];
            var name = displayNameFilter(id, list);
            expect(name).toEqual("Name 1");
        });

        it('should return empty string if item does not exist', function () {
            var id = "id3";
            var list = [
                {"$id": "id2", "displayName": "Name 2"},
                {"$id": "id1", "displayName": "Name 1"}
            ];
            var name = displayNameFilter(id, list);
            expect(name).toEqual("");
        });
    });
});