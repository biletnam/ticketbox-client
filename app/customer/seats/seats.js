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

    .factory('styles', function() {
        return {
            'free': { 'background': '#3f3', 'stroke': '1px solid #aaa', 'opacity': 0.4 },
            'freeHover': { 'background': '#3f3', 'stroke': '1px solid #aaa', 'opacity': 0.4 },
            'locked': { 'background': '#000', 'stroke': '1px solid #000', 'opacity': 1 },
            'lockedByMyself': { 'background': '#f33', 'stroke': '2px solid #aaa', 'opacity': 0.4 }
        };
    })

    .controller('SeatsCtrl', function ($scope, $routeParams, fbarray, fbobject, locker, draw, styles) {
        $scope.event = fbobject.byId('/events', $routeParams.eventId);
        $scope.category = fbobject.byId('/categories', $routeParams.categoryId);
        $scope.block = fbobject.byId('/blocks', $routeParams.blockId);
        $scope.seats = fbarray.byChildValue('/seats', 'blockId', $routeParams.blockId);
        $scope.reservations = locker.getLocksOfEvent($routeParams.eventId);

        $scope.handlers = {
            draw: function(seat, element, reservationState) {
                draw.applySeatStyle(element, reservationState, false);
            },
            click: function(seat, element, reservationState) {
                if (reservationState === 'free') {
                    locker.lock($scope.event.$id, seat.$id);
                } else if (reservationState === 'lockedByMyself') {
                    locker.unlock($scope.event.$id, seat.$id);
                }
            },
            mouseenter: function(seat, element, reservationState) {
                draw.applySeatStyle(element, reservationState, true);
            },
            mouseleave: function(seat, element, reservationState) {
                draw.applySeatStyle(element, reservationState, false);
            }
        };
    })

    .service('draw', function(styles) {
        return {
            applySeatStyle: function(element, reservationState, isHovered) {
                var style = {};
                if (reservationState === 'free') {
                    if (isHovered) {
                        style = styles.freeHover;
                    } else {
                        style = styles.free;
                    }
                } else if (reservationState === 'lockedByMyself') {
                    style = styles.lockedByMyself;
                } else if (reservationState === 'locked') {
                    style = styles.locked;
                }
                element.fill = style.background;
                element.stroke = style.stroke;
                element.opacity = style.opacity;
            }
        };
    })

    .directive('ngSeatSelection', function (canvasImage, $rootScope, separator, coordinates) {
        var currentPolygons = [];

        function _refreshSeats(scope, canvas, seats, reservations) {
            _.each(currentPolygons, function (p) {
                canvas.removeChild(p, false);
            });
            currentPolygons = [];

            _.each(seats, function (seat) {
                var reservation = _.find(reservations, function(r) {
                    return r.$id.split(separator)[1] === seat.$id;
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
            var polygon = canvasImage.drawPolygon(canvas, coordinates.seatToCoordinates(seat), '#333', '2px #000');
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
                    if (seats !== null) {
                        _refreshSeats(scope, canvas, seats, reservations);
                    }
                }
            }, true);

            scope.$watch('seats', function (newSeats, oldSeats) {
                if (newSeats !== undefined) {
                    seats = newSeats;
                    if (canvas !== null) {
                        _refreshSeats(scope, canvas, newSeats, reservations);
                    }
                }
            }, true);

            scope.$watch('reservations', function(newReservations, oldReservations) {
                if (newReservations !== undefined) {
                    reservations = newReservations;
                    if (canvas !== null) {
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