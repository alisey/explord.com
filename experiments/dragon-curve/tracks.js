function dragonPoints(folds, everyN) {
    var x         = 0,
        y         = 0,
        n         = 0,
        dir       = 3,
        segments  = 1 << folds,
        points    = [];
    
    for (var n = 0; n < segments; n++) {
        dir = ((dir + ((((n & -n) << 1) & n) ? -1 : 1)) + 4) % 4;
        x += [0, 1, 0, -1][dir];
        y += [1, 0, -1, 0][dir];
        if (n % everyN == 0) {
            points.push({x: x, y: y});
        }
    }
    
    return points;
}

function catmullRom(x0, y0, x1, y1, x2, y2, x3, y3, t, c) {
    var vx0 = (x2 - x0) * 0.5 * c,
        vy0 = (y2 - y0) * 0.5 * c,
        vx1 = (x3 - x1) * 0.5 * c,
        vy1 = (y3 - y1) * 0.5 * c,
        t2 = t * t,
        t3 = t2 * t;
    return {
        x: (2.0 * x1 - 2.0 * x2 + vx0 + vx1) * t3
        + (-3 * x1 + 3 * x2 - 2 * vx0 - vx1) * t2
        + vx0 * t + x1,
        y: (2 * y1 - 2 * y2 + vy0 + vy1) * t3
        + (-3 * y1 + 3 * y2 - 2 * vy0 - vy1) * t2
        + vy0 * t + y1
    };
}

function catmullRomInterpolate(p, steps, tension) {
    var result = [];
    
    p = [].concat(p[0], p, p[p.length - 1]);
    for (var i = 3; i < p.length; i++) {
        for (var j = 0; j < steps; j++) {
            result.push(catmullRom(
                p[i-3].x, p[i-3].y,
                p[i-2].x, p[i-2].y,
                p[i-1].x, p[i-1].y,
                p[i-0].x, p[i-0].y,
                j / steps,
                tension || 1
            ));
        }
    }
    return result;
}

function centerOfPoints(points) {
    var sumX = 0;
    var sumY = 0;
    for (var i = 0; i < points.length; i++) {
        sumX += points[i].x;
        sumY += points[i].y;
    }
    return {x: sumX / points.length,
            y: sumY / points.length};
}

function smoothPoints(points, factor) {
    var result = [];
    for (var i = 0; i < points.length; i++) {
        result.push(centerOfPoints(points.slice(
            Math.max(i - factor, 0), i + 1)));
    }
    return result;
}

function everyNthPoint(points, n) {
    result = [];
    for (i = 0; i < points.length; i+=n) {
        result.push(points[i]);
    }
    
    if (result[result.length - 1] != points[points.length - 1]) {
        result.push(points[points.length - 1]);
    }
    
    return result;
}


function scalePoints(points, factor) {
    points = points.slice();
    for (var i = 0; i < points.length; i++) {
        points[i] = {x: points[i].x * factor, y: points[i].y * factor};
    }
    return points;
}

function translatePoints(points, x, y) {
    points = points.slice();
    for (var i = 0; i < points.length; i++) {
        points[i] = {x: points[i].x + x, y: points[i].y + y};
    }
    return points;
}

function boundingBox(points) {
    var x1, x2, y1, y2;
    x1 = x2 = points[0].x;
    y1 = y2 = points[0].y;
    
    for (var i = 0; i < points.length; i++) {
        x1 = Math.min(x1, points[i].x);
        x2 = Math.max(x2, points[i].x);
        y1 = Math.min(y1, points[i].y);
        y2 = Math.max(y2, points[i].y);
    }
    
    return {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        width:  x2 - x1,
        height: y2 - y1
    };
}

function trace(canvas, points, color) {
    var ctx = canvas.getContext('2d');
    ctx.save();
    ctx.strokeStyle = color || '#000';
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 0; i < points.length - 1; i++) {
        ctx.lineTo(points[i+1].x, points[i+1].y);
    }
    ctx.stroke();
    ctx.restore();
}

function traceVersus(canvas, p1, p2) {
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#cccccc';
    ctx.beginPath();
    for (var i = 0; i < p1.length; i++) {
        ctx.moveTo(p1[i].x, p1[i].y);
        ctx.lineTo(p2[i].x, p2[i].y);
    }
    ctx.stroke();
    
    trace(canvas, p1, '#00a7ef');
    trace(canvas, p2, '#ec0082');
}

function fitPointsToCanvas(canvas, points, border) {
    var bbox  = boundingBox(points);
    var scale = Math.min((canvas.width - border * 2) / bbox.width,
                         (canvas.height - border * 2) / bbox.height);
    points = scalePoints(points, scale);
    
    return translatePoints(points,
                           (canvas.width  - (bbox.x1 + bbox.x2) * scale) / 2,
                           (canvas.height - (bbox.y1 + bbox.y2) * scale) / 2);
}

function centerCanvasAt(canvas, p) {
    var ww = window.innerWidth;
    var wh = window.innerHeight;
    
    canvas.style.left = ww / 2 - p.x + 'px';
    canvas.style.top  = wh / 2 - p.y + 'px';
}

function flyThroughPoints(canvas, points, interval) {
    var marker = document.createElement('div');
    marker.style.width = '6px';
    marker.style.height = '6px';
    marker.style.backgroundColor = '#f14ca5';
    marker.style.borderRadius = '3px';
    marker.style.position = 'absolute';
    marker.style.left = window.innerWidth  / 2 - 3 + 'px';
    marker.style.top  = window.innerHeight / 2 - 3 + 'px';
    document.body.appendChild(marker);
    
    var i = 0;
    var timer = setInterval(function() {
        var p = points[i++];
        if (p) {
            centerCanvasAt(canvas, p);
        } else {
            clearInterval(timer);
        }
    }, interval);
}