function randomChoice(list) {
    return list[Math.random() * list.length | 0];
};

function World(size) {
    this.size  = size;
    this.snake = [];
    this.growth = 0;
    this.apple = null;
    this.ateApple = false;
    this.grid = new Grid(this.size, this.size);
    
    this.recording = [];
};

World.prototype.placeObjects = function(obj) {
    if (obj) {
        this.snake = obj.snake.slice();
        this.apple = obj.apple;
        this.growth = obj.growth;
        for (var i = 0; i < this.snake.length; i++) {
            this.grid.setByIndex(this.snake[i], 1);
        }
    } else {
        var center = this.size * (this.size - 1) / 2 | 0;
        for (var i = 0; i < 5; i++) {
            this.snake.push(center + this.size * i);
            this.grid.setByIndex(center + this.size * i, 1);
        }
        this.relocateApple();
    }
    this.recording.push(this.apple);
};

World.prototype.id = function() {
    return this.snake[0];
};

World.prototype.relocateApple = function() {
    for (var empty = [], i = 0; i < this.size * this.size; i++) {
        if (this.snake.indexOf(i) == -1) {
            empty.push(i);
        }
    }
    
    this.apple = randomChoice(empty);
};

World.prototype.clone = function() {
    var clone    = new World();
    clone.size   = this.size;
    clone.snake  = this.snake.slice();
    clone.growth = this.growth;
    clone.apple  = this.apple;
    clone.ateApple = this.ateApple;
    clone.grid = this.grid.clone();
    return clone;
};

World.prototype.move = function(dir) {
    if (!this.isValidMove(dir)) {
        throw 'Invalid move';
    }

    dir = dir[0] + dir[1] * this.size;
    this.ateApple = false;
    if (!dir) {
        return;
    }
    
    if (this.growth) {
        this.growth--;
    } else {
        var oldTail = this.snake.pop();
        this.grid.setByIndex(oldTail, undefined);
    }
    
    this.snake.unshift(this.snake[0] + dir);
    this.grid.setByIndex(this.snake[0], 1);
    
    if (this.snake[0] == this.apple) {
        this.ateApple = true;
        this.growth += 1;
        this.relocateApple();
    }
    
    this.recording.push([this.apple, dir]);
};

World.prototype.isValidMove = function(dir) {
    var validMoves = this.validMoves(true);
    dir = dir[0] + dir[1] * this.size;
    return validMoves.indexOf(dir) > -1;
}

World.prototype.validMoves = function(num) {
    var head = this.snake[0];
    var tail = this.snake[this.snake.length - 1];
    var neighbors = this.neighbors(head);
    var moves = [];
    for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];
        if (neighbor == tail && !this.growth ||
            this.snake.indexOf(neighbor) == -1) {
            moves.push(num ? neighbor - head : this.cellCoords(neighbor - head));
        }
    }
    
    return moves;
};

World.prototype.neighbors = function(cell) {
    var neighbors = [];
    var x = this.cellX(cell);
    var y = this.cellY(cell);
    var s = this.size;
    
    if (x > 0)     neighbors.push(cell - 1);
    if (x < s - 1) neighbors.push(cell + 1);
    if (y > 0)     neighbors.push(cell - s);
    if (y < s - 1) neighbors.push(cell + s);
    
    return neighbors;
};

//  HELPERS

var UP    = [ 0, -1];
var DOWN  = [ 0,  1];
var RIGHT = [ 1,  0];
var LEFT  = [-1,  0];

World.prototype.cellCoords = function(cell) {
    return [this.cellX(cell), this.cellY(cell)];
};

World.prototype.cellX = function(cell) {
    return cell % this.size;
};

World.prototype.cellY = function(cell) {
    return cell / this.size | 0;
};

World.prototype.appleCoords = function() {
    return this.cellCoords(this.apple);
};

World.prototype.headCoords = function() {
    return this.cellCoords(this.snake[0]);
};

World.prototype.direction = function(move) {
    if (move ==  1) return RIGHT;
    if (move == -1) return LEFT;
    if (move > 0)   return DOWN;
    return UP;
};

World.prototype.moveFromDirection = function(dir) {
    return dir[0] + dir[1] * this.size;
};

World.prototype.snakeAsDirections = function() {
    var dirs = [];
    for (var i = 1; i < this.snake.length; i++) {
        dirs.push(this.direction(this.snake[i-1] - this.snake[i]));
    }
    dirs.unshift(dirs[0]);
    return this.cellCoords(this.snake[0]).concat([dirs]);
};

World.prototype.snakeCoords = function() {
    var cells = [];
    for (var i = 0; i < this.snake.length; i++) {
        cells.push(this.cellCoords(this.snake[i]));
    }
    return cells;
};