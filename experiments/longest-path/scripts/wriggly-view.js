SnakeGridView = function(containerElem, width, height) {
    this.containerElem = containerElem;
    this.width = width;
    this.height = height;
    this.grid = new Grid(this.width, this.height);
    this.startPoint = null;
    this.endPoint = null;
    
    this.dragging = null;
    this.lastTickledCell = null;
    this.onStartPointMove = function() {};
    this.onEndPointMove = function() {};
    this.onWallChange = function() {};
    
    this.tileSize = 30;
    
    this.gridElem = document.createElement('div');
    this.gridElem.className = 'wriggly-grid';
    this.gridElem.style.width  = this.width  * this.tileSize + 'px';
    this.gridElem.style.height = this.height * this.tileSize + 'px';
    
    this.paper = document.createElement('canvas');
    this.paper.width  = this.width  * this.tileSize;
    this.paper.height = this.height * this.tileSize;
    this.gridElem.appendChild(this.paper);
    
    this.cellsElem = document.createElement('div');
    this.cellsElem.className = 'cells';
    this.cellsElem.style.width  = this.width  * this.tileSize + 'px';
    this.cellsElem.style.height = this.height * this.tileSize + 'px';
    this.gridElem.appendChild(this.cellsElem);
    
    this.cellElems = [];
    for (var i = 0; i < this.width * this.height; i++) {
        var cell = document.createElement('div');
        this.cellElems.push(cell);
        this.cellsElem.appendChild(cell);
    }
    
    this.textureElem = document.createElement('div');
    this.textureElem.className = 'texture';
    this.textureElem.style.width  = this.width  * this.tileSize + 1 + 'px';
    this.textureElem.style.height = this.height * this.tileSize + 1 + 'px';
    this.gridElem.appendChild(this.textureElem);
    
    this.containerElem.appendChild(this.gridElem);
    this.bindEvents();
};

var proto = SnakeGridView.prototype;

proto.setStartPoint = function(coords) {
    if (this.startPoint) {
        this.setCell(this.startPoint, this.grid.get(coords));
    }
    this.startPoint = coords;
    this.setCell(this.startPoint, 'start-point');
};

proto.setEndPoint = function(coords) {
    if (this.endPoint) {
        this.setCell(this.endPoint, this.grid.get(coords));
    }
    this.endPoint = coords;
    this.setCell(this.endPoint, 'end-point');
};

proto.setWall = function(coords, wall) {
    this.grid.set(coords, 'wall');
    if (!this.isTerminal(coords)) {
        this.setCell(coords, wall ? 'wall' : null);
    }
};

proto.setCell = function(coords, val) {
    this.cellElems[this.grid.coordsToIndex(coords)].className = val || '';
};

proto.drawPath = function(path) {
    this.clearPath();
    var tile = this.tileSize;
    var ctx = this.paper.getContext('2d');
    ctx.beginPath();
    for (var i = 0, coords; coords = path.get(i); i++) {
        ctx[i == 0 ? 'moveTo' : 'lineTo']((coords[0] + 0.5) * tile - 0.5, (coords[1] + 0.5) * tile - 0.5);
    }
    
    ctx.lineWidth = 27;//tile / 2 | 0;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#60a1bd';
    ctx.stroke();
};

proto.clearPath = function() {
    var ctx = this.paper.getContext('2d');
    ctx.clearRect(0, 0, this.paper.width, this.paper.height);
};

proto.isTerminal = function(coords) {
    return this.startPoint && Coords.equal(coords, this.startPoint) ||
           this.endPoint   && Coords.equal(coords, this.endPoint);
};

proto.bindEvents = function() {
    var self = this;
    
    var mousemove = function(e) {
        self.onDrag(self.eventCoords(e));
    };
    
    var mouseup = function(e) {
        $(document).off('mousemove', mousemove)
        $(document).off('mouseup', mouseup);
        self.onDragEnd(self.eventCoords(e));
    };
    
    $(this.gridElem).on('mousedown', function(e) {
        if (e.which == 1) {
            $(document).on('mousemove', mousemove);
            $(document).on('mouseup',   mouseup);
            self.onDragStart(self.eventCoords(e));
        }
    });
    
    document.body.ondragstart   = function() { return false; };
    document.body.onselectstart = function() { return false; };
};

proto.eventCoords = function(e) {
    var offset = $(this.cellsElem).offset();
    var x = Math.floor((e.pageX - offset.left) / this.tileSize);
    var y = Math.floor((e.pageY - offset.top)  / this.tileSize);
    return [x, y];
};

proto.onDragStart = function(coords) {
    if (this.startPoint && Coords.equal(this.startPoint, coords)) {
        this.dragging = 'start-point';
    } else if (this.endPoint && Coords.equal(this.endPoint, coords)) {
        this.dragging = 'end-point';
    } else {
        this.dragging = 'wall';
    }
    
    this.tickleCell(coords);
};

proto.onDrag = function(coords) {
    this.tickleCell(coords);
};

proto.onDragEnd = function(coords) {
    this.dragging = false;
    this.lastTickledCell = null;
};

proto.tickleCell = function(coords) {
    if (!this.dragging || this.lastTickledCell && Coords.equal(coords, this.lastTickledCell)) {
        return;
    }
    
    this.lastTickledCell = coords;
    var clampedCoords = Coords.clamp(coords, this.grid.bounds);
    
    if (this.isTerminal(clampedCoords)) {
        return;
    } else if (this.dragging == 'start-point') {
        this.setCell(this.startPoint, this.grid.get(this.startPoint));
        this.startPoint = clampedCoords;
        this.setCell(this.startPoint, 'start-point');
        this.onStartPointMove(this.startPoint);
    } else if (this.dragging == 'end-point') {
        this.setCell(this.endPoint, this.grid.get(this.endPoint));
        this.endPoint = clampedCoords;
        this.setCell(this.endPoint, 'end-point');
        this.onEndPointMove(this.endPoint);
    } else if (this.dragging == 'wall' && this.grid.includes(coords)) {
        var wall = !this.grid.get(coords);
        this.grid.set(coords, wall ? 'wall' : null);
        this.setCell(coords, wall ? 'wall' : null);
        this.onWallChange(coords, wall);
    }
};