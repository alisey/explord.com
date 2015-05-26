function remapRange(a, b) {
    if (a[0] == a[1]) {
        return function() {
            return (b[0] + b[1]) / 2;
        };
    }

    return function(x) {
        return (b[1] - b[0]) * (x - a[0]) / (a[1] - a[0]) + b[0];
    };
}

function pointMapper(xr0, xr1, yr0, yr1) {
    var forward = function(point) {
        return [remapRange(xr0, xr1)(point[0]),
                remapRange(yr0, yr1)(point[1])];
    };
    forward.back = function(point) {
        return [remapRange(xr1, xr0)(point[0]),
                remapRange(yr1, yr0)(point[1])];
    };
    forward.wrapFunction = function(fn) {
        return function(x) {
            return remapRange(yr1, yr0)(fn(remapRange(xr0, xr1)(x)));
        };
    };
    return forward;
}

function zipLists(a, b) {
    return a.map(function(_, i) { return [a[i], b[i]]; });
}

function listColumn(list, columnIndex) {
    return list.map(function(row) { return row[columnIndex]; });
}

function listBounds(list) {
    return [Math.min.apply(null, list),
            Math.max.apply(null, list)];
}

// Map hsla to rgba, range 0..1
var hsla = function(h, s, l, a) {
    function hue_to_rgb(m1, m2, h) {
        if (h < 0) h += 1;
        if (h > 1) h -= 1;
        if (h < 1/6) return m1 + (m2 - m1) * 6 * h;
        if (h < 1/2) return m2;
        if (h < 2/3) return m1 + (m2 - m1) * 6 * (2/3 - h);
        return m1;
    }

    var m2 = l < 0.5 ? l * (s + 1) : l + s - l * s;
    var m1 = 2 * l - m2;
    return [hue_to_rgb(m1, m2, h + 1/3),
            hue_to_rgb(m1, m2, h),
            hue_to_rgb(m1, m2, h - 1/3),
            a];
};


/* Canvas */

CanvasRenderingContext2D.prototype.setSize = function(size) {
    this.canvas.width  = size[0];
    this.canvas.height = size[1];
};

CanvasRenderingContext2D.prototype.getSize = function() {
    return [this.canvas.width, this.canvas.height];
};

CanvasRenderingContext2D.prototype.clear = function() {
    var canvas = this.canvas;
    var ctx    = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

CanvasRenderingContext2D.prototype.fillCircle = function(center, size, color) {
    this.save();
    this.fillStyle = color || '#000';
    this.beginPath();
    this.arc(center[0], center[1], size, 0, 2 * Math.PI);
    this.fill();
    this.restore();
};

CanvasRenderingContext2D.prototype.strokeLinearFunction = function(fn, color) {
    this.save();
    this.strokeStyle = color || '#000';
    this.lineWidth = 1;
    this.beginPath();
    this.moveTo(0, fn(0));
    this.lineTo(this.canvas.width, fn(this.canvas.width));
    this.stroke();
    this.restore();
};

CanvasRenderingContext2D.prototype.fillPixels = function(fn) {
    var width  = this.canvas.width,
        height = this.canvas.height,
        pixels = this.createImageData(width, height),
        i      = 0;

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var color = fn(x, y);
            pixels.data[i++] = Math.floor(color[0] * 256);
            pixels.data[i++] = Math.floor(color[1] * 256);
            pixels.data[i++] = Math.floor(color[2] * 256);
            pixels.data[i++] = Math.floor(color[3] * 256);
        }
    }
    this.putImageData(pixels, 0, 0);
};