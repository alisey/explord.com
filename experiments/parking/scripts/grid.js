function parseGrid(str) {
    str = $.trim(str);
    var squares = str.match(/[A-Z|@*.]/g);
    if (!squares) {
        throw "Lot doesn't contain any cars";
    }
    
    var H = str.split(/\n/).length;
    var W = squares.length / H;
    
    if (squares.length % H) {
        throw 'Lot should be rectangular or square';
    }
    
    var grid = {};
    $.each(squares, function(i, sq) {
        if (sq == '.') {
            return;
        }
        if (!grid[sq]) {
            grid[sq] = []
        }
        grid[sq].push(i);
    });
    
    if (!grid['*']) {
        throw('Lot should contain a "*" car');
    }
    
    if (!grid['@']) {
        throw("It's a trap!");
    }
    
    // Car should be at least 2 squares long and all its segments should form
    // a row or column
    for (car in grid) {
        if (car == '|' || car == '@') {
            continue;
        }
        
        var sq = grid[car];
        if (sq.length < 2) {
            throw 'Car "' + car + '" should be at least 2 squares long';
        }
        
        var step = sq[1] - sq[0];
        if (step != 1 && step != W) {
            throw 'Segments of "' + car + '" don\'t form a row or column';
        }
        for (var i = 1; i < sq.length; i++) {
            if (sq[i] - sq[i-1] != step) {
                throw 'Segments of "' + car + '" don\'t form a row or column';
            }
        }
    }
    
    // Parking lot should be fenced with walls
    for (var i = 0; i < squares.length; i++) {
        if ((i < W || i >= (H*W - W) || i % W == 0 || (i+1) % W == 0) &&
            squares[i] != '|' && squares[i] != '@'
        ) {
            throw 'Lot should be fully fenced with walls "|" and exits "@"';
        }
    }
    
    return {objects: grid, width: W, height: H};
}

function validateGrid(grid, W, H) {

}

function GridView(grid) {
    this.grid = grid.objects;
    this.gridWidth  = grid.width;
    this.gridHeight = grid.height;
    this.node = $('<div class="car-grid">');
    this.node.css({
        width:  this.gridWidth  * (this.tileSize + this.tileSpacing),
        height: this.gridHeight * (this.tileSize + this.tileSpacing)
    });

    var exits = this.grid['@'] || [];
    for (var i = 0; i < exits.length; i++) {
        this.addTile('exit', this.coords(exits[i]));
    }
    
    var walls = this.grid['|'] || [];
    for (var i = 0; i < walls.length; i++) {
        this.addTile('wall', this.coords(walls[i]));
    }
    
    this.cars = {};
    for (car in this.grid) {
        if (car == '|' || car == '@') {
            continue;
        }
        var start    = this.coords(this.grid[car][0]);
        var vertical = this.grid[car][1] - this.grid[car][0] > 1;
        var len      = this.grid[car].length;
        var carObj = new Car(this, car, len, vertical);
        carObj.moveTo(start.row, start.col);
        this.cars[car] = carObj;
        this.node.append(carObj.node);
    }
}

GridView.prototype.coords = function(i) {
    return {
        row: Math.floor(i / this.gridWidth),
        col: i % this.gridWidth
    };
};

GridView.prototype.addTile = function(type, coords) {
    $('<div>').addClass(type).css({
        left: coords.col * (this.tileSize + this.tileSpacing),
        top:  coords.row * (this.tileSize + this.tileSpacing)
    }).appendTo(this.node);
};

GridView.prototype.animate = function(actions) {
    var self = this;
    var action = actions[0];
    if (!action) {
        return;
    }
    var carName = action[0];
    var car = this.cars[carName];
    var moveby = car.vertical ? action[1] / this.gridWidth : action[1];
    car.moveBy(moveby);
    setTimeout(function() {
        self.animate(actions.slice(1));
    }, 500);
};

GridView.prototype.tileSize = 40;
GridView.prototype.tileSpacing = 3;