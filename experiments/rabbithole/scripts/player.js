function Player(world) {
    this.jumpVelocity = 22;
    this.walkAcceleration = 3;
    this.turnAcceleration = 2;
    this.gravityAcceleration = 0.8;
    this.groundFriction = 0.6;
    this.airFriction = 0.95;
    this.maxWalkVelocity = 5;
    this.maxFallVelocity = 30;

    this.world = world;
    this.controls = null;
    this.behavior = null;
    this.speechBubble = null;
    this.sprite = new PlayerSprite();
    this.sprite.animate('idle');

    this.attachControls(new NullControls());

    this.width = this.sprite.getWidth();
    this.height = this.sprite.getHeight();
    this.halfWidth = this.width / 2;
    this.halfHeight = this.height / 2;
    this.feetSize = 20;
    this.feetYOffset = this.halfHeight;

    this.grounded = false;
    this.walled = false;
    this.onPlatform = false;
    this.onFloor = false;
    this.wantToJumpOffPlatform = false;
    this.flashing = false;
    this.velocity = {x: 0, y: 0};
    this.position = {x: 0, y: 0};
    this.desiredPosition = {x: 0, y: 0};

    // Shouldn't jump repeatedly when holding 'up' button
    this.holdingUpAfterJump = false;
    this.jumpShortened = false;

    // Can only initiate jump off platform when standing on it
    this.downPressedInPreviousFrame = false;
}

Player.prototype.getNode = function() {
    return this.sprite.getNode();
};

Player.prototype.attachControls = function(controls) {
    this.controls = controls;

    this.controls.onRelease.add(function(button) {
        if (button == 'up') {
            this.holdingUpAfterJump = false;
        }
    }.bind(this));
};

Player.prototype.attachBehavior = function(behavior) {
    this.behavior = behavior;
    this.behavior.init(this);
};

Player.prototype.getPosition = function() {
    return this.position;
};

Player.prototype.getVelocity = function() {
    return this.velocity;
};

Player.prototype.setPosition = function(newPosition) {
    this.position.x = newPosition.x;
    this.position.y = newPosition.y;
};

Player.prototype.update = function() {
    if (this.behavior) {
        this.behavior.update();
    }

    this.velocity.y += this.gravityAcceleration;

    // Variable height jumping a la Super Meat Boy
    if (this.grounded && this.controls.up && !this.holdingUpAfterJump) {
        this.velocity.y = -this.jumpVelocity;
        this.holdingUpAfterJump = true;
        this.jumpShortened = false;
    } else if (this.velocity.y < -5 && !this.controls.up && !this.jumpShortened) {
        this.jumpShortened = true;
        this.velocity.y *= 0.5;
    }

    this.wantToJumpOffPlatform = this.onPlatform && this.controls.down &&
                                 !this.downPressedInPreviousFrame;
    this.downPressedInPreviousFrame = this.controls.down;

    if (this.controls.right && !this.controls.left) {
        this.velocity.x += (this.velocity.x >= 0) ? this.walkAcceleration : this.turnAcceleration;
    } else if (this.controls.left && !this.controls.right) {
        this.velocity.x -= (this.velocity.x <= 0) ? this.walkAcceleration : this.turnAcceleration;
    } else {
        this.velocity.x *= this.grounded ? this.groundFriction : this.airFriction;
    }

    this.velocity.x = clamp(this.velocity.x, -this.maxWalkVelocity, this.maxWalkVelocity);
    this.velocity.y = clamp(this.velocity.y, -this.jumpVelocity,    this.maxFallVelocity);
    if (Math.abs(this.velocity.x) < 0.01) {
        this.velocity.x = 0;
    }
    if (Math.abs(this.velocity.x) < 0.01) {
        this.velocity.x = 0;
    }

    // These are updated by collisions
    this.desiredPosition.x = this.position.x + this.velocity.x;
    this.desiredPosition.y = this.position.y + this.velocity.y;
    this.collideAll();
    this.position.x = this.desiredPosition.x;
    this.position.y = this.desiredPosition.y;

    this.updateSprite();
};

Player.prototype.updateSprite = function() {
    var frameDuration = 10;
    if (this.flashing) {
        this.sprite.animate('flashing');
    } else if (this.velocity.y) {
        this.sprite.animate('tumbling');
        frameDuration = 3;
    } else if (Math.abs(this.velocity.x) > 0.5) {
        this.sprite.animate('walking');
        frameDuration = 4;
    } else {
        this.sprite.animate('idle');
    }

    if (this.velocity.x > 0) {
        this.sprite.faceRight();
    } else if (this.velocity.x < 0) {
        this.sprite.faceLeft();
    }

    if (this.world.getTick() % frameDuration === 0) {
        this.sprite.advanceToNextFrame();
    }
};

Player.prototype.render = function() {
    this.sprite.setPosition(this.position);
    if (this.speechBubble) {
        this.updateSpeechBubble();
    }
    this.sprite.render();
};

Player.prototype.collideAll = function() {
    this.walled = this.collideWalls();
    this.onFloor = this.collideFloor();
    this.onPlatform = this.collidePlatforms();
    this.grounded = this.onFloor || this.onPlatform;
};

Player.prototype.collideWalls = function() {
    if (this.desiredPosition.x - this.halfWidth <= this.world.getLeft()) {
        this.desiredPosition.x = this.world.getLeft() + this.halfWidth;
        this.velocity.x = 0;
        return true;
    } else if (this.desiredPosition.x + this.halfWidth >= this.world.getRight()) {
        this.desiredPosition.x = this.world.getRight() - this.halfWidth;
        this.velocity.x = 0;
        return true;
    }
    return false;
};

Player.prototype.collideFloor = function() {
    if (this.desiredPosition.y + this.feetYOffset >= this.world.getBottom()) {
        this.desiredPosition.y = this.world.getBottom() - this.feetYOffset;
        this.velocity.y = 0;
        return true;
    }
    return false;
};

Player.prototype.collidePlatforms = function() {
    var platforms = this.world.getPlatforms();
    for (var i = 0; i < platforms.length; i++) {
        var platform = platforms[i];
        // Can only collide when moving down.
        if (this.position.y + this.feetYOffset <= platform.getY() &&
            this.desiredPosition.y + this.feetYOffset >= platform.getY() &&
            this.desiredPosition.x > platform.getLeft()  - this.feetSize / 2 &&
            this.desiredPosition.x < platform.getRight() + this.feetSize / 2
        ) {
            if (!this.wantToJumpOffPlatform) {
                this.velocity.y = 0;
                this.desiredPosition.y = platform.getY() - this.feetYOffset;
            }
            return true;
        }
    }
    return false;
};

Player.prototype.speak = function(bubble) {
    this.shutUp();
    this.speechBubble = bubble;
    this.updateSpeechBubble();
    this.world.getNode().append(this.speechBubble.getNode());
    this.speechBubble.show();
};

Player.prototype.updateSpeechBubble = function() {
    this.speechBubble.setPosition({
        x: this.position.x + 24,
        y: this.position.y - 33
    });
};

Player.prototype.shutUp = function() {
    if (this.speechBubble) {
        this.speechBubble.remove();
    }
    this.speechBubble = null;
};