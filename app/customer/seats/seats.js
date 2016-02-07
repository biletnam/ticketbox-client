'use strict';

angular.module('ticketbox.customer.seats', [
        'ticketbox.components.firebase',
        'ticketbox.components.utils',
        'ticketbox.components.canvas',
        'ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/seats/:eventId/:categoryId/:blockId', {
            controller: 'SeatsCtrl',
            templateUrl: 'customer/seats/seats.html'
        });
    }])

    .controller('SeatsCtrl', function ($scope, $routeParams, fbarray, fbobject, error) {
        $scope.event = fbobject.byId('/events', $routeParams.eventId);
        $scope.category = fbobject.byId('/categories', $routeParams.categoryId);
        $scope.block = fbobject.byId('/blocks', $routeParams.blockId);
        $scope.seats = fbarray.byChildValue('/seats', 'blockId', $routeParams.blockId);

        $scope.handlers = {
            draw: function(seat, element) {
                var style = _getSeatStyle(seat);
                element.fill = style.background;
                element.stroke = style.stroke;
                element.opacity = style.opacity;
            },
            click: function(seat, element) {
                // TODO: Reserve/release seat
            },
            mouseenter: function(seat, element) {
                element.fill = '#33f';
            },
            mouseleave: function(seat, element) {
                var style = _getSeatStyle(seat);
                element.fill = style.background;
                element.stroke = style.stroke;
                element.opacity = style.opacity;
            }
        };

        function _getSeatStyle(seat) {
            return {
                'background': '#3f3',
                'stroke': '1px solid #aaa',
                'opacity': 0.4
            };
        }
    })

    .directive('ngSeatSelection', function (canvasImage) {
        var currentPolygons = [];

        function _refreshSeats(scope, canvas, seats) {
            _.each(currentPolygons, function (p) {
                canvas.removeChild(p, false);
            });
            currentPolygons = [];

            _.each(seats, function (seat) {
                var polygon = _drawSeat(scope, canvas, seat);
                currentPolygons.push(polygon);
            });

            canvas.redraw();
        };

        function _drawSeat(scope, canvas, seat) {
            var coordinates = [
                { x: seat.x0, y: seat.y0 },
                { x: seat.x1, y: seat.y1 },
                { x: seat.x2, y: seat.y2 },
                { x: seat.x3, y: seat.y3 }
            ];
            var polygon = canvasImage.drawPolygon(canvas, coordinates, '#333', '2px #000');
            scope.handlers.draw(seat, polygon);
            _bind(scope, canvas, polygon, seat);
            return polygon;
        };

        function _bind(scope, canvas, element, seat) {
            element.bind("click tap", function () {
                scope.handlers.click(seat, element);
                element.redraw();
            });
            element.bind("mouseenter", function () {
                scope.handlers.mouseenter(seat, element);
                element.redraw();
            });
            element.bind("mouseleave", function () {
                scope.handlers.mouseleave(seat, element);
                element.redraw();
            });
        };

        function _create(scope, element, attrs) {
            var canvas = null;
            var seats = null;
            var canvasId = 'ngSelectableImageCanvas';

            scope.$watch('src', function (newSrc, oldSrc) {
                canvas = canvasImage.createCanvasObject(newSrc, canvasId);
                if (seats != null) {
                    _refreshSeats(scope, canvas, seats);
                }
            }, true);

            scope.$watch('seats', function (newSeats, oldSeats) {
                seats = newSeats;
                if (canvas != null) {
                    _refreshSeats(scope, canvas, newSeats);
                }
            }, true);
        };

        return {
            restrict: 'E',
            scope: {
                src: '=',
                seats: '=',
                handlers: '='
            },
            template: '<canvas id="ngSelectableImageCanvas"></canvas>',
            link: _create
        }
    })
;