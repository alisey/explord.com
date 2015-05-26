function Car(view, letter, size, vertical) {
    if (letter == '*') {
        this.colorVariant = 8;
    } else {
        this.colorVariant = Car.colorCounter++ % 8;
    }
    
    this.tileSize    = view.tileSize;
    this.tileSpacing = view.tileSpacing;
    this.size        = size;
    this.vertical    = vertical;
    this.node        = this.createNode();
}

Car.colorCounter = 3;

Car.prototype.moveTo = function(row, col) {
    this.row = row;
    this.col = col;
    $(this.node).css(this.position());
};

Car.prototype.moveBy = function(tiles) {
    if (this.vertical) {
        this.row += tiles;
    } else {
        this.col += tiles;
    }
    
    $(this.node).animate(this.position(), 700);
};

Car.prototype.position = function() {
    return {
        left: this.col * (this.tileSize + this.tileSpacing),
        top:  this.row * (this.tileSize + this.tileSpacing)};
};

Car.prototype.createNode = function() {
    var $node = $(
        '<div class="car">' +
            '<div class="front"></div>' + 
            '<div class="middle"></div>' + 
            '<div class="back"></div>' + 
        '</div>').addClass(this.vertical ? 'vert' : 'horiz');
    
    var carWidth = 39;
    var size = this.size * this.tileSize + this.tileSpacing * (this.size - 1);
    var middleSize = -this.colorVariant * carWidth;
    if (this.vertical) {
        $node.css({
            height: size
        }).find('.front, .middle, .back').css({
            'background-position': middleSize + 'px 0'
        });
    } else {
        $node.css({
            width: size
        }).find('.front, .middle, .back').css({
            'background-position': '0 ' + middleSize + 'px'
        });
    }
    
    return $node[0];
};