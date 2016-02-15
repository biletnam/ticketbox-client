'use strict';

angular.module('ticketbox.admin.seats', [
        'ticketbox.components.firebase',
        'ticketbox.components.utils',
        'ticketbox.components.canvas',
        'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/seats', {
            controller: 'SeatsCtrl',
            templateUrl: 'admin/seats/seats.html'
        });
    }])

    .controller('SeatsCtrl', function ($scope, $location, $q, fbarray, fbobject, arrayModification, geometry, error) {
        $scope.blocks = fbarray.byPath('/blocks');
        $scope.block = null;
        $scope.seats = [];

        _resetState();

        $scope.filterSeats = function (blockId) {
            $scope.block = fbobject.byId('/blocks', blockId);
            $scope.seats = fbarray.byChildValue('/seats', 'blockId', blockId);
            _resetState();
        };

        $scope.add = function (blockId, namePattern, startNumber, endNumber, coordinates) {
            var promises = [];
            for (var seatNumber = startNumber; seatNumber <= endNumber; seatNumber += 1) {
                var name = '';
                if (namePattern.indexOf('{i}') !== -1) {
                    name = namePattern.replace('{i}', seatNumber);
                } else {
                    name = namePattern;
                }
                var data = {'blockId': blockId, 'name': name};
                if (coordinates.length === 4) {
                    var seatCoordinates = geometry.calculateSeatCoordinates(coordinates, endNumber - startNumber + 1, seatNumber - startNumber);
                    data.x0 = seatCoordinates.x0;
                    data.y0 = seatCoordinates.y0;
                    data.x1 = seatCoordinates.x1;
                    data.y1 = seatCoordinates.y1;
                    data.x2 = seatCoordinates.x2;
                    data.y2 = seatCoordinates.y2;
                    data.x3 = seatCoordinates.x3;
                    data.y3 = seatCoordinates.y3;
                }
                promises.push($scope.seats.$add(data));
            }
            $q.all(promises)
                .then(function () {
                }, error)
                .finally(function () {
                    _resetState();
                });
        };

        $scope.remove = function (seat) {
            $scope.seats.$remove(seat).then(function () {
            }, error);
        };

        $scope.removeAll = function () {
            arrayModification.removeAll($scope.seats).then(function () {
            }, error);
        };

        function _resetState() {
            $scope.namePattern = '';
            $scope.startSeatNumber = 1;
            $scope.endSeatNumber = 1;
            $scope.coordinates = [];
        }
    })

    .service('geometry', function() {
        return {
            calculateSeatCoordinates: function(coordinates, numberOfSeats, seatIndex) {
                var dx01 = coordinates[1].x - coordinates[0].x;
                var dy01 = coordinates[1].y - coordinates[0].y;
                var dx32 = coordinates[2].x - coordinates[3].x;
                var dy32 = coordinates[2].y - coordinates[3].y;
                var seatCoordinates = {};
                seatCoordinates.x0 = coordinates[0].x + (dx01 / numberOfSeats) * seatIndex;
                seatCoordinates.y0 = coordinates[0].y + (dy01 / numberOfSeats) * seatIndex;
                seatCoordinates.x1 = coordinates[3].x + (dx32 / numberOfSeats) * seatIndex;
                seatCoordinates.y1 = coordinates[3].y + (dy32 / numberOfSeats) * seatIndex;
                seatCoordinates.x2 = coordinates[3].x + (dx32 / numberOfSeats) * (seatIndex + 1);
                seatCoordinates.y2 = coordinates[3].y + (dy32 / numberOfSeats) * (seatIndex + 1);
                seatCoordinates.x3 = coordinates[0].x + (dx01 / numberOfSeats) * (seatIndex + 1);
                seatCoordinates.y3 = coordinates[0].y + (dy01 / numberOfSeats) * (seatIndex + 1);
                return seatCoordinates;
            }
        }
    })

    .directive('ngSeatDefinition', function (canvasImage, coordinates) {
        var coordinateMarkers = [];
        var currentPolygons = [];
        var selectedCoordinates;

        function _refreshSeats(canvas, seats) {
            _.each(currentPolygons, function (p) {
                canvas.removeChild(p, false);
            });
            currentPolygons = [];
            _.each(seats, function (seat) {
                var polygon = canvasImage.drawPolygon(canvas, coordinates.seatToCoordinates(seat), '#333', '2px #000');
                currentPolygons.push(polygon);
            });
            canvas.redraw();
        }

        function _bindClick(canvas) {
            canvas.bind("click tap", function () {
                if (selectedCoordinates.length < 4) {
                    var circle = canvasImage.drawCoordinate(canvas);
                    var point = {x: circle.x, y: circle.y};
                    coordinateMarkers.push({ point: point, marker: circle });
                    selectedCoordinates.push(point);
                }
            });
        }

        function _create(scope, element, attrs) {
            selectedCoordinates = scope.coordinates;
            var canvas = null;
            var canvasId = 'ngClickableImageCanvas';

            scope.$watch('src', function (newSrc, oldSrc) {
                canvas = canvasImage.createCanvasObject(newSrc, canvasId);
                _bindClick(canvas);
            }, true);

            scope.$watch('seats', function (newSeats, oldSeats) {
                if (canvas !== null) {
                    _refreshSeats(canvas, newSeats);
                }
            }, true);

            scope.$watch('coordinates', function (newCoordinates, oldCoordinates) {
                selectedCoordinates = newCoordinates;
                var removedCoordinates = _.filter(oldCoordinates, function(c) { return !_.contains(newCoordinates, c); });
                _.each(removedCoordinates, function(c) {
                    var coordinateMarker = _.find(coordinateMarkers, function(m) { return m.point.x === c.x && m.point.y === c.y; });
                    if (coordinateMarker !== undefined) {
                        if (canvas !== null) {
                            canvas.removeChild(coordinateMarker.marker);
                        }
                        coordinateMarkers.splice(coordinateMarker, 1);
                    }
                });
            }, true);
        }

        return {
            restrict: 'E',
            scope: {
                src: '=',
                seats: '=',
                coordinates: '='
            },
            template: '<canvas id="ngClickableImageCanvas"></canvas>',
            link: _create
        }
    });
