var polygonFromPointsConstructor = function (settings, core) {
    return oCanvas.extend({
        core: core,

        shapeType: "rectangular",

        init: function () { },

        draw: function () {
            var canvas = this.core.canvas;
            canvas.beginPath();
            canvas.moveTo(this.points[0].x, this.points[0].y);
            for (var i = 1; i < this.points.length; i += 1) {
                canvas.lineTo(this.points[i].x, this.points[i].y);
            }
            canvas.closePath();

            if (this.fill !== "") {
                canvas.fillStyle = this.fill;
            }

            if (this.strokeWidth > 0) {
                canvas.strokeStyle = this.strokeColor;
                canvas.lineWidth = this.strokeWidth;
            }

            canvas.fill();
            canvas.stroke();
        },

        // See http://stackoverflow.com/a/10673763
        isPointerInside: function (pointer) {
            var angle = 0;
            var x = pointer.x;
            var y = pointer.y;
            var n = this.points.length;
            for (var i = 0; i < n; i += 1) {
                var dx0 = this.points[i].x - x;
                var dy0 = this.points[i].y - y;
                var dx1 = this.points[(i+1) % n].x - x;
                var dy1 = this.points[(i+1) % n].y - y;
                angle += this._getAngleBetweenLines(dx0, dy0, dx1, dy1);
            }
            return (Math.abs(angle) >= Math.PI);
        },

        _getAngleBetweenLines: function(dx0, dy0, dx1, dy1) {
            var theta1 = Math.atan2(dy0, dx0);
            var theta2 = Math.atan2(dy1, dx1);
            var dtheta = theta2 - theta1;
            while (dtheta > Math.PI)
                dtheta -= 2 * Math.PI;
            while (dtheta < -Math.PI)
                dtheta += 2 * Math.PI;

            return(dtheta);
        }

    }, settings);
};

oCanvas.registerDisplayObject("polygonFromPoints", polygonFromPointsConstructor, "init");