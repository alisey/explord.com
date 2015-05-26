function shortestPath(start, end, grid) {
    grid = grid.clone();
    var front = [end];
    grid.set(end, -1);
    var ring = -2;
    
    // fill weights
    dance:
    while (front.length) {
        var newFront = [];
        for (var i = 0; i < front.length; i++) {
            var cell = front[i];
            if (Coords.equal(cell, start)) {
                break dance;
            }
            
            var neighbors = grid.neighbors(cell);
            for (var j = 0; j < neighbors.length; j++) {
                if (!grid.get(neighbors[j])) {
                    grid.set(neighbors[j], ring);
                    newFront.push(neighbors[j]);
                }
            }
        }
        front = newFront;
        ring--;
    }
    
    var cheapestNeighbor = function(cell, heading) {
        if (grid.get(cell) == -1) {
            return;
        }
        var neighbors = grid.neighbors(cell);
        var bestBud = null;
        var bestCost = null;
        for (var i = 0; i < neighbors.length; i++) {
            var bud = neighbors[i];
            var cost = grid.get(bud);
            if (!(cost < 0)) {
                continue;
            }
            if (heading) {
                cost += Coords.equal(heading, Coords.sub(bud, cell)) ? 0.5 : 0;
            }
            
            if (!bestCost || cost > bestCost) {
                bestBud = bud;
                bestCost = cost;
            }
        }
        return bestBud;
    };
    
    var path = [];
    var current = start;
    while (current) {
        path.push(current);
        var heading = path.length < 2 ? null : Coords.sub(current, path[path.length - 2]);
        current = cheapestNeighbor(current, heading);
    };
    return path.length > 1 ? path : null;
}