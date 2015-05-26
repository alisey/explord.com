// Chainable sequences of behaviors that hook into player code.

PlayerBehavior = function(hooks) {
    // These will run in the context of player.
    this.initHook        = hooks.init        || $.noop;
    this.updateHook      = hooks.update      || $.noop;
    this.isCompletedHook = hooks.isCompleted || $.noop;
    this.onCompleteHook  = hooks.onComplete  || $.noop;

    this.tick = 0;
    this.player = null;
    this.nextBehavior = null;
    this.isCompleted = false;
    this.onComplete = $.noop;
};

// Behavior chaining.
PlayerBehavior.prototype.then = function(behavior) {
    if (this.nextBehavior) {
        this.nextBehavior.then(behavior);
    } else {
        this.nextBehavior = behavior;
    }
    return this;
};

PlayerBehavior.prototype.init = function(player) {
    this.player = player;
    this.initHook.call(this.player, this);
};

// Runs just before player physics update.
PlayerBehavior.prototype.update = function() {
    if (this.isCompleted) {
        return;
    }

    if (this.isCompletedHook.call(this.player, this)) {
        this.onCompleteHook.call(this.player, this);
        if (this.nextBehavior) {
            // Pass the baton.
            this.nextBehavior.onComplete = this.onComplete;
            this.player.attachBehavior(this.nextBehavior);
        } else {
            this.isCompleted = true;
            this.onComplete();
        }
    } else {
        this.updateHook.call(this.player, this);
    }

    this.tick += 1;
};



PlayerBehavior.custom = function(callback) {
    return new PlayerBehavior({
        init: function(behavior) {
            callback.call(this, behavior);
        },
        isCompleted: function() {
            return true;
        }
    });
};

PlayerBehavior.dropOff = function() {
    return new PlayerBehavior({
        init: function() {
            // Drop off above the first platform.
            var firstPlatform = this.world.getPlatforms()[0];
            this.attachControls(new NullControls());
            this.position.x = firstPlatform.getLeft() + this.feetSize * 2;
            this.position.y = this.world.getTop() - this.feetYOffset;
            this.flashing = true;
        },
        update: function() {
            this.velocity.y = this.gravityAcceleration;
        },
        isCompleted: function() {
            return this.grounded;
        },
        onComplete: function() {
            this.flashing = false;
        }
    });
};

PlayerBehavior.walkOffPlatformRight = function() {
    return new PlayerBehavior({
        update: function() {
            this.velocity.x = this.maxWalkVelocity;   
        },
        isCompleted: function() {
            return !this.onPlatform || this.walled;
        },
        onComplete: function() {
            this.velocity.x /= 3;
        }
    });
};

PlayerBehavior.waitForLanding = function() {
    return new PlayerBehavior({
        isCompleted: function() {
            return this.grounded;
        }
    });
};

PlayerBehavior.wait = function(ticks) {
    return new PlayerBehavior({
        isCompleted: function(behavior) {
            return behavior.tick > ticks;
        }
    });
};

PlayerBehavior.speak = function(bubble) {
    return PlayerBehavior.custom(function() {
        this.speak(bubble);
    });
};

PlayerBehavior.shutUp = function() {
    return PlayerBehavior.custom(function() {
        this.shutUp();
    });
};

PlayerBehavior.letsMove = function(callback) {
    return new PlayerBehavior({
        init: function() {
            this.speak(new LetsMoveSpeechBubble());
            this.attachControls(this.world.controls);
        },
        isCompleted: function() {
            return this.controls.left || this.controls.right || this.controls.up || this.onFloor;
        },
        onComplete: function() {
            this.shutUp();
        }
    });
};

PlayerBehavior.moveFreelyUntilReachedFloor = function() {
    return new PlayerBehavior({
        isCompleted: function() {
            return this.onFloor;
        }
    });
};

PlayerBehavior.approachExit = function() {
    return new PlayerBehavior({
        init: function() {
            this.maxWalkVelocity = 10;
            this.groundFriction = 1;
            this.walkAcceleration = 0.3;
        },
        update: function() {
            var distanceToExit = this.world.exit.getPosition().x - this.position.x;
            this.velocity.x += this.walkAcceleration * sign(distanceToExit);
        },
        isCompleted: function() {
            var distanceToExit = this.world.exit.getPosition().x - this.position.x;
            return sign(distanceToExit) != sign(distanceToExit + this.velocity.x);
        },
        onComplete: function() {
            this.position.x = this.world.exit.getPosition().x;
            this.velocity.x = 0;
            this.sprite.faceRight();
        }
    });
};

PlayerBehavior.jumpIntoExit = function() {
    return new PlayerBehavior({
        init: function() {
            this.velocity.y = -30;
            this.maxWalkVelocity = 15;
            this.velocity.x = 15;
        },
        isCompleted: function(behavior) {
            return this.grounded;
        },
        onComplete: function() {
            this.velocity.x = 0;
        }
    });
};

PlayerBehavior.intro = function() {
    return PlayerBehavior.dropOff()
        .then(PlayerBehavior.wait(20))    
        .then(PlayerBehavior.walkOffPlatformRight())
        .then(PlayerBehavior.waitForLanding());
};

PlayerBehavior.findExit = function() {
    return PlayerBehavior.custom(function() {
            this.attachControls(new NullControls());
            this.jumpShortened = false;
            this.velocity.y = 0;
        })
        .then(PlayerBehavior.wait(30))
        .then(PlayerBehavior.approachExit())
        .then(PlayerBehavior.wait(30))
        .then(PlayerBehavior.speak(new FoundItSpeechBubble()))
        .then(PlayerBehavior.wait(120))
        .then(PlayerBehavior.shutUp());
};