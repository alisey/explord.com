var solveParkingPuzzle = function(start) {
    // JavaScript doesn't have immutable data structures, to avoid constant
    // serialization and deserialization states are represented as strings

    start       = gridToString(start);
    var path    = shortestPathSearch(start, carMoves, isExitReached);
    var actions = $.grep(path, function(item, i) { return i % 2 });
    return actions;
};

var gridToString = function(grid) {
    var flatGrid = Array(grid.width*grid.height + 1).join('.').split('');

    // put objects on it
    $.each(grid.objects, function(obj, locs) {
        $.each(locs, function(i, loc) {
            flatGrid[loc] = obj;
        });
    });

    return flatGrid.join('');
};

var carMoves = function(grid) {
    var moves = [];
    var cars  = carLocations(grid);

    for (var car in cars) {
        var locs = cars[car];
        var head = locs[0];
        var tail = locs[locs.length - 1];
        var step = locs[1] - locs[0];

        addSingleCarMoves(moves, grid, car, head, tail, +step);
        addSingleCarMoves(moves, grid, car, head, tail, -step);
    }
    return moves;
};

var addSingleCarMoves = function(moves, grid, car, head, tail, step) {
    var moveby = 0;
    if (step > 0) {
        var tmp = head;
        head = tail;
        tail = tmp;
    }

    while (car != '#') {
        moveby += step;
        head   += step;

        // Check collisions. Only "*" car can step onto "@", in which case
        // it becomes "#" to indicate overlapping
        if (car == '*' && grid[head] == '@') {
            car = '#';
        } else if (grid[head] != '.') {
            break;
        }

        grid = grid.substr(0, tail) + '.' + grid.substr(tail + 1);
        grid = grid.substr(0, head) + car + grid.substr(head + 1);
        moves.push([grid, [car == '#' ? '*' : car, moveby]]);
        tail += step;
    }
};

var carLocations = function(grid) {
    // return locations of all cars on the grid
    // as dictionary {car1: locations, ...}

    var cars = {};
    for (var i = 0; i < grid.length; i++) {
        var car = grid[i];
        if (car == '*' || (car >= 'A' && car <= 'Z')) {
            if (car in cars) {
                cars[car].push(i);
            } else {
                cars[car] = [i];
            }
        }
    }
    return cars;
};

var isExitReached = function(grid) {
    // "#" indicates car segment overlapping with one of exits
    return grid.indexOf('#') >= 0;
};

var shortestPathSearch = function(start, successors, isGoal) {
    if (isGoal(start)) {
        return [start];
    }
    
    var explored = {};
    var frontier = [[start]];
    
    while (frontier.length) {
        var path  = frontier.shift();
        var succs = successors(path[path.length-1]);
        for (var i = 0; i < succs.length; i++) {
            var state  = succs[i][0];
            var action = succs[i][1];
            
            if (state in explored) {
                continue;
            }
            
            explored[state] = true;
            var path2 = path.concat([action, state]);
            if (isGoal(state)) {
                return path2;
            } else {
                frontier.push(path2);
            }
        }
    }
    return [];
};