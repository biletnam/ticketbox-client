angular.module('ticketbox.components.canvas', [])

    .service('canvasImage', function () {
        return {
            createCanvasObject: function (src, id) {
                var canvas = oCanvas.create({
                    canvas: "#" + id
                });
                var img = new Image();
                img.onload = function () {
                    canvas.width = this.width;
                    canvas.height = this.height;
                    canvas.redraw();
                };
                img.src = src;
                var image = canvas.display.image({
                    x: 0,
                    y: 0,
                    origin: {x: "left", y: "top"},
                    image: img
                });
                canvas.addChild(image);
                return canvas;
            },

            drawCoordinate: function (canvas) {
                var mouseX = canvas.mouse.x;
                var mouseY = canvas.mouse.y;
                var circle = canvas.display.ellipse({
                    x: mouseX,
                    y: mouseY,
                    radius: 3,
                    fill: "#0aa"
                });
                canvas.addChild(circle);
                return circle;
            },

            drawPolygon: function (canvas, coordinates, fill, stroke) {
                var polygon = canvas.display.polygonFromPoints({
                    points: coordinates,
                    fill: fill,
                    stroke: stroke,
                    opacity: 0.7
                });
                canvas.addChild(polygon, false);
                return polygon;
            }
        };
    });