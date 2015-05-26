function Grid(width, height) {
    this.width = width;
    this.height = height;
    this.cells = [];
    this.bounds = [[0, 0], [width - 1, height - 1]];
};

Grid.prototype.get = function(coords) {
    return this.cells[this.coordsToIndex(coords)];
};

Grid.prototype.set = function(coords, val) {
    this.cells[this.coordsToIndex(coords)] = val;
};

Grid.prototype.setAll = function(cells, val) {
    for (var i = 0; i < cells.length; i++) {
        this.cells[this.coordsToIndex(cells[i])] = val;
    }
};

Grid.prototype.setByIndex = function(index, val) {
    this.cells[index] = val;
};

Grid.prototype.includes = function(coords) {
    return Coords.within(coords, this.bounds);
};

Grid.prototype.coordsToIndex = function(coords) {
    return coords[1] * this.width + coords[0];
};

Grid.prototype.indexToCoords = function(index) {
    return [index % this.width, index / this.width | 0];
};

Grid.prototype.clone = function() {
    var grid = new Grid(this.width, this.height);
    grid.cells = this.cells.slice();
    return grid;
};

Grid.prototype.neighbors = function(cell) {
    var cells = [];
    if (cell[0] > 0) {
        cells.push([cell[0] - 1, cell[1]]);
    }
    if (cell[0] < this.width - 1) {
        cells.push([cell[0] + 1, cell[1]]);
    }
    if (cell[1] > 0) {
        cells.push([cell[0], cell[1] - 1]);
    }
    if (cell[1] < this.height - 1) {
        cells.push([cell[0], cell[1] + 1]);
    }
    return cells;
};

Grid.prototype.eachCell = function(fn) {
    for (var i = 0; i < this.cells.length; i++) {
        fn(this.indexToCoords(i), this.cells[i]);
    }
};

Grid.prototype.print = function() {
    var txt = '';
    for (var i = 0; i < this.width * this.height; i++) {
        if (!(i % this.width)) {
            txt += "\n";
        }
        txt += ' ' + (this.cells[i] || '.');
    }
    return txt;
};