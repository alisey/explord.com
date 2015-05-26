function Orbit(planets, steps) {
    var self;
    return self = {
        planets: planets,
        steps: steps,
        leg: function(time) {
            var planets = self.planets;
            var points = [];
            var x = 0;
            var y = 0;
            
            for (var i = 0; i < planets.length; i++) {
                var distance = planets[i][0];
                var speed    = planets[i][1];
                var angle    = speed * time * Math.PI * 2;
                x += Math.cos(angle) * distance;
                y += Math.sin(angle) * distance;
                points.push([x, y]);
            }
            return points;
        },
        iterator: function() {
            var i = 0;
            return {next: function() {
                return i < self.steps
                    ? self.leg(i++ / self.steps)
                    : false;
            }};
        },
        bbox: function() {
            var legs = self.iterator();
            var leg  = [];
            var i    = 0;
            return getBbox({next: function() {
                if (!leg[i]) {
                    i = 0, leg = legs.next();
                }
                return leg ? leg[i++] : false;
            }});
        }
    };
}

function getBbox(points) {
    var p = points.next();
    var box = {
        xmin: p[0],
        ymin: p[1],
        xmax: p[0],
        ymax: p[1]
    };
    while (p = points.next()) {
        box.xmin = Math.min(box.xmin, p[0]);
        box.xmax = Math.max(box.xmax, p[0]);
        box.ymin = Math.min(box.ymin, p[1]);
        box.ymax = Math.max(box.ymax, p[1]);
    }
    box.width  = box.xmax - box.xmin;
    box.height = box.ymax - box.ymin;
    return box;
}