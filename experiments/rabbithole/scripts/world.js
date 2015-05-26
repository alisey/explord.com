function World() {
    this.tick = 0;
    this.ended = false;
    this.$node = $('body');
    this.$backdropNode = $('body');

    this.platforms = new PlatformList($('.thumb'));
    this.updateDimensions();
    this.updatePlatformPositions();

    this.controls = new KeyboardControls();
    this.exit     = new WorldExit(this);
    this.camera   = new PlatformLockedCamera(this);
    this.player   = new Player(this);
    this.setupPlayer();

    $(window).on('resize', this.onResize.bind(this));
    this.mainLoop();
}

World.prototype.end = function() {
    this.ended = true;
    this.player.getNode().remove();
};

World.prototype.setupPlayer = function() {
    this.getNode().append(this.player.getNode());

    setTimeout(this.toggleLetterbox.bind(this, true), 600);

    var behavior =
        PlayerBehavior.intro()
        .then(PlayerBehavior.custom(this.toggleLetterbox.bind(this, false)))
        .then(PlayerBehavior.letsMove())
        .then(PlayerBehavior.moveFreelyUntilReachedFloor())
        .then(PlayerBehavior.custom(this.toggleLetterbox.bind(this, true)))
        .then(PlayerBehavior.findExit());

        behavior.onComplete = function() {
            var behavior = PlayerBehavior.jumpIntoExit();
            behavior.onComplete = this.end.bind(this);
            this.player.attachBehavior(behavior);
            this.exit.prepareForJump();
            setTimeout(this.exit.blink.bind(this.exit), 1000);
            setTimeout(this.toggleLetterbox.bind(this, false), 2000);
        }.bind(this);
    this.player.attachBehavior(behavior);
};

World.prototype.mainLoop = function() {
    if (this.ended) {
        return;
    }

    requestAnimationFrame(this.mainLoop.bind(this));

    this.player.update();
    this.camera.update();
    this.player.render();
    this.tick += 1;
};

World.prototype.toggleLetterbox = function(state) {
    $('body').toggleClass('letterbox', state);
};

World.prototype.toggleBlackout = function(state) {
    $('body').toggleClass('blackout', state);
};

World.prototype.getNode = function() {
    return this.$node;
};

World.prototype.onResize = function() {
    this.updateDimensions();
    this.updatePlatformPositions();
};

World.prototype.updateDimensions = function() {
    this.top = 0;
    this.left = 0;

    var backdropBox = this.$backdropNode[0].getBoundingClientRect();
    this.right  = window.pageXOffset + backdropBox.right;
    this.bottom = window.pageYOffset + backdropBox.bottom - 40; // hight of the black letterbox bar
};

World.prototype.getTick = function() {
    return this.tick;
};

World.prototype.getTop = function() {
    return this.top;
};

World.prototype.getLeft = function() {
    return this.left;
};

World.prototype.getRight = function() {
    return this.right;
};

World.prototype.getBottom = function() {
    return this.bottom;
};

World.prototype.scrollTo = function(newPosition) {
    window.scrollTo(newPosition.x, newPosition.y);
};

World.prototype.getScroll = function() {
    return {
        x: window.pageXOffset,
        y: window.pageYOffset
    };
};

World.prototype.getViewportWidth = function() {
    return $(window).width();
};

World.prototype.getViewportHeight = function() {
    return $(window).height();
};

World.prototype.updatePlatformPositions = function() {
    this.platforms.updatePositions();
};

World.prototype.getPlatforms = function() {
    return this.platforms.toArray();
};