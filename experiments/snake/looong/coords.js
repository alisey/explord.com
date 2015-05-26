Coords = {
    within: function(cell, rect) {
        return cell[0] >= rect[0][0]
            && cell[1] >= rect[0][1]
            && cell[0] <= rect[1][0]
            && cell[1] <= rect[1][1];
    },
    adjacent: function(a, b) {
        return (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])) == 1;
    },
    neighbors: function(cell) {
        return [[cell[0] - 1, cell[1]],
                [cell[0] + 1, cell[1]],
                [cell[0], cell[1] - 1],
                [cell[0], cell[1] + 1]];
    },
    add: function(a, b) {
        return [a[0] + b[0], a[1] + b[1]];
    },
    sub: function(a, b) {
        return [a[0] - b[0], a[1] - b[1]];
    },
    equal: function(a, b) {
        return a[0] == b[0] && a[1] == b[1];
    },
    abs: function(a) {
        return [Math.abs(a[0]), Math.abs(a[1])];
    },
    clamp: function(cell, rect) {
        return [Math.max(rect[0][0], Math.min(cell[0], rect[1][0])),
                Math.max(rect[0][1], Math.min(cell[1], rect[1][1]))];
    }
};