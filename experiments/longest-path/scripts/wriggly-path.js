WrigglyPath = function(grid, segments) {
    this.grid = grid;
    this.segments = [];
    if (segments) {
        for (var i = 0; i < segments.length; i++) {
            this.append(segments[i]);
        }
    }
};

var proto = WrigglyPath.prototype;

proto.get = function(index) {
    return this.segments[index];
};

proto.len = function() {
    return this.segments.length;
};

proto.set = function(index, cell) {
    this.segments[index] = cell;
    this.grid.set(cell, this);
};

proto.append = function(cell) {
    this.set(this.len(), cell);
};

proto.insert = function(index, cells) {
    for (var i = 0; i < cells.length; i++) {
        this.segments.splice(index + i, 0, null);
        this.set(index + i, cells[i]);
    }
};

proto.free = function(cell) {
    return this.grid.includes(cell) && !this.grid.get(cell);
};

proto.crease = function(index) {
    var a = this.get(index + 0);
    var b = this.get(index + 1);
    var step = Coords.sub(b, a);
    
    for (var i = -1; i <= 1; i += 2) {
        var new1 = Coords.add(a, [i*step[1], i*step[0]]);
        var new2 = Coords.add(b, [i*step[1], i*step[0]]);
        if (this.free(new1) && this.free(new2)) {
            this.insert(index + 1, [new1, new2]);
            return true;
        }
    }
};


proto.predictiveCrease = function(index) {

};

proto.flipL = function(index) {
    var a = this.get(index + 0);
    var b = this.get(index + 1);
    var c = this.get(index + 2);
    var step1 = Coords.sub(b, a);
    var step2 = Coords.sub(c, b);
    
    if (!Coords.equal(step1, step2)) {
        var b2 = Coords.add(a, step2);
        if (this.free(b2)) {
            this.set(index + 1, b2);
            return true;
        }
    }
};

proto.flipU = function(index) {
    var a = this.get(index + 0);
    var b = this.get(index + 1);
    var c = this.get(index + 2);
    var d = this.get(index + 3);
    
    if (Coords.adjacent(a, d)) {
        var b2 = Coords.sub(a, Coords.sub(b, a));
        var c2 = Coords.add(d, Coords.sub(d, c));
        if (this.free(b2) && this.free(c2)) {
            this.set(index + 1, b2);
            this.set(index + 2, c2);
            return true;
        }
    }
};

proto.wriggleAll = function() {
    while (this.wriggleNext());
};

proto.wriggleNext = function() {
    var success = false;
    var maxIndex = this.len() - 1;
    for (var i = 0; i < maxIndex && !success; i++) {
        success = this.crease(i);
    }
    return success;
};