function Platform($node) {
    this.$node = $node;
    this.y = 0;
    this.left = 0;
    this.right = 0;
}

Platform.prototype.updatePosition = function() {
    var offset = this.$node.offset();
    var width = this.$node.width();
    this.y = offset.top;
    this.left = offset.left;
    this.right = offset.left + width;
};

Platform.prototype.getY = function() {
    return this.y;
};

Platform.prototype.getLeft = function() {
    return this.left;
};

Platform.prototype.getRight = function() {
    return this.right;
};




function PlatformList($nodes) {
    this.platforms = [];
    for (var i = 0; i < $nodes.length; i++) {
        this.platforms.push(new Platform($nodes.eq(i)));
    }
}

PlatformList.prototype.updatePositions = function() {
    for (var i = 0; i < this.platforms.length; i++) {
        this.platforms[i].updatePosition();
    }
};

PlatformList.prototype.toArray = function() {
    return this.platforms;
};