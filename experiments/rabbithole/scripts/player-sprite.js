function SpritesheetFrame(x, y) {
    this.x = x;
    this.y = y;
}

SpritesheetFrame.prototype.getCSSBackgroundPosition = function() {
    return '-' + this.x + 'px -' + this.y + 'px';
};



function PlayerSpritesheet() {
    this.imageURL = 'images/fella-spritesheet.png';
    this.frameWidth  = 80;
    this.frameHeight = 80;
    this.frameSpacing  = 20;
    this.animations = {
        idle:     this.createFrameSequence(0, 0, 8),
        walking:  this.createFrameSequence(2, 0, 8),
        jumping:  this.createFrameSequence(3, 0, 8),
        tumbling: this.createFrameSequence(4, 0, 3),
        flashing: [this.createFrame(5, 0), this.createFrame(3, 5)]
    };
}

PlayerSpritesheet.prototype.createFrame = function(row, col) {
    return new SpritesheetFrame(
        col * (this.frameWidth  + this.frameSpacing),
        row * (this.frameHeight + this.frameSpacing)
    );
};

PlayerSpritesheet.prototype.createFrameSequence = function(row, col, count) {
    var frames = [];
    for (var i = 0; i < count; i++) {
        frames.push(this.createFrame(row, col + i));
    }
    return frames;
};



function SpriteAnimation(spritesheet, frames) {
    this.spritesheet = spritesheet;
    this.frames = frames;
    this.frameIndex = 0;
}

SpriteAnimation.prototype.getCurrentFrame = function() {
    return this.frames[this.frameIndex];
};

SpriteAnimation.prototype.advanceToNextFrame = function() {
    this.frameIndex = (this.frameIndex + 1) % this.frames.length;
};



function PlayerSprite() {
    this.spritesheet = new PlayerSpritesheet();
    this.animation = null;
    this.animationName = null;
    this.width  = this.spritesheet.frameWidth;
    this.height = this.spritesheet.frameHeight;
    this.position = {x: 0, y: 0};
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    this.$node = this.createNode();
    this.flipX = false;
}

PlayerSprite.prototype.createNode = function() {
    return $('<div class="player">').css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: this.width,
        height: this.height,
        marginTop: '2px',
        backgroundImage: 'url(' + this.spritesheet.imageURL + ')',
        backgroundPosition: '0 0'
    });
};

PlayerSprite.prototype.getWidth = function() {
    return this.width;
};

PlayerSprite.prototype.getHeight = function() {
    return this.height;
};

PlayerSprite.prototype.getNode = function() {
    return this.$node;
};

PlayerSprite.prototype.setPosition = function(newPosition) {
    this.position.x = newPosition.x;
    this.position.y = newPosition.y;
};

PlayerSprite.prototype.render = function() {
    var frame = this.animation.getCurrentFrame();
    this.$node.css({
        backgroundPosition: frame.getCSSBackgroundPosition(),
        transform: 'translate3d(' + Math.round(this.position.x - this.halfWidth)  + 'px, ' +
                                    Math.round(this.position.y - this.halfHeight) + 'px, ' +
                                    '0)' +
                   (this.flipX ? ' scaleX(-1)' : '')
    });
};

PlayerSprite.prototype.advanceToNextFrame = function() {
    this.animation.advanceToNextFrame();
};

PlayerSprite.prototype.faceLeft = function() {
    this.flipX = true;
};

PlayerSprite.prototype.faceRight = function() {
    this.flipX = false;
};

PlayerSprite.prototype.animate = function(animationName) {
    if (animationName != this.animationName) {
        this.animationName = animationName;
        this.animation = new SpriteAnimation(
            this.spritesheet,
            this.spritesheet.animations[animationName]
        );
    }
};