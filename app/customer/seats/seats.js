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

    .controller('SeatsCtrl', function ($scope, $routeParams, fbarray, fbobject, locker, error) {
        $scope.event = fbobject.byId('/events', $routeParams.eventId);
        $scope.category = fbobject.byId('/categories', $routeParams.categoryId);
        $scope.block = fbobject.byId('/blocks', $routeParams.blockId);
        $scope.seats = fbarray.byChildValue('/seats', 'blockId', $routeParams.blockId);
        $scope.reservations = locker.getLocksOfEvent($routeParams.eventId);

        $scope.handlers = {
            draw: function(seat, element, reservationState) {
                var style = _getSeatStyle(reservationState);
                element.fill = style.background;
                element.stroke = style.stroke;
                element.opacity = style.opacity;
            },
            click: function(seat, element, reservationState) {
                if (reservationState == 'free') {
                    locker.lock($scope.event.$id, seat.$id);
                } else if (reservationState == 'lockedByMyself') {
                    locker.unlock($scope.event.$id, seat.$id);
                }
            },
            mouseenter: function(seat, element, reservationState) {
                if (reservationState == 'free') {
                    element.fill = '#33f';
                }
            },
            mouseleave: function(seat, element, reservationState) {
                var style = _getSeatStyle(reservationState);
                element.fill = style.background;
                element.stroke = style.stroke;
                element.opacity = style.opacity;
            }
        };

        function _getSeatStyle(reservationState) {
            if (reservationState == 'free') {
                return {
                    'background': '#3f3',
                    'stroke': '1px solid #aaa',
                    'opacity': 0.4
                };
            } else if (reservationState == 'lockedByMyself') {
                return {
                    'background': '#f33',
                    'stroke': '2px solid #aaa',
                    'opacity': 0.4
                };
            } else if (reservationState == 'locked') {
                return {
                    'background': '#000',
                    'stroke': '1px solid #000',
                    'opacity': 1
                };
            }
        }
    })

    .directive('ngSeatSelection', function (canvasImage, $rootScope, separator) {
        var currentPolygons = [];

        function _refreshSeats(scope, canvas, seats, reservations) {
            _.each(currentPolygons, function (p) {
                canvas.removeChild(p, false);
            });
            currentPolygons = [];

            _.each(seats, function (seat) {
                var reservation = _.find(reservations, function(r) {
                    return r.$id.split(separator)[1] == seat.$id;
                });
                var reservationState = '';
                if (reservation === undefined) {
                    reservationState = 'free';
                } else if (reservation.uid === $rootScope.authData.uid) {
                    reservationState = 'lockedByMyself';
                } else {
                    reservationState = 'locked';
                }
                var polygon = _drawSeat(scope, canvas, seat, reservationState);
                currentPolygons.push(polygon);
            });

            canvas.redraw();
        }

        function _drawSeat(scope, canvas, seat, reservationState) {
            var coordinates = [
                { x: seat.x0, y: seat.y0 },
                { x: seat.x1, y: seat.y1 },
                { x: seat.x2, y: seat.y2 },
                { x: seat.x3, y: seat.y3 }
            ];
            var polygon = canvasImage.drawPolygon(canvas, coordinates, '#333', '2px #000');
            scope.handlers.draw(seat, polygon, reservationState);
            _bind(scope, canvas, polygon, seat, reservationState);
            return polygon;
        }

        function _bind(scope, canvas, element, seat, reservationState) {
            element.bind("click tap", function () {
                scope.handlers.click(seat, element, reservationState);
                element.redraw();
            });
            element.bind("mouseenter", function () {
                scope.handlers.mouseenter(seat, element, reservationState);
                element.redraw();
            });
            element.bind("mouseleave", function () {
                scope.handlers.mouseleave(seat, element, reservationState);
                element.redraw();
            });
        }

        function _create(scope, element, attrs) {
            var canvas = null;
            var seats = null;
            var reservations = null;
            var canvasId = 'ngSelectableImageCanvas';

            scope.$watch('src', function (newSrc, oldSrc) {
                if (newSrc !== undefined) {
                    canvas = canvasImage.createCanvasObject(newSrc, canvasId);
                    if (seats != null) {
                        _refreshSeats(scope, canvas, seats);
                    }
                }
            }, true);

            scope.$watch('seats', function (newSeats, oldSeats) {
                if (newSeats !== undefined) {
                    seats = newSeats;
                    if (canvas != null) {
                        _refreshSeats(scope, canvas, newSeats, reservations);
                    }
                }
            }, true);

            scope.$watch('reservations', function(newReservations, oldReservations) {
                if (newReservations !== undefined) {
                    reservations = newReservations;
                    if (canvas != null) {
                        _refreshSeats(scope, canvas, seats, newReservations);
                    }
                }
            }, true);
        }

        return {
            restrict: 'E',
            scope: {
                src: '=',
                seats: '=',
                reservations: '=',
                handlers: '='
            },
            template: '<canvas id="ngSelectableImageCanvas"></canvas>',
            link: _create
        }
    })
;