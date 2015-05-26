function PlatformLockedCamera(world) {
    this.world = world;
    this.targetY = null;
}

PlatformLockedCamera.prototype.update = function() {
    var playerPosition = this.world.player.getPosition();
    var playerVelocity = this.world.player.getVelocity();
    var worldScroll = this.world.getScroll();
    var viewportWidth = this.world.getViewportWidth();
    var viewportHeight = this.world.getViewportHeight();
    var playerViewportX = playerPosition.x;
    var playerViewportY = playerPosition.y;

    if (playerVelocity.y === 0) {
        this.targetY = playerPosition.y;
    } else if (playerVelocity.y > 0 && playerPosition.y > this.targetY) {
        this.targetY = playerPosition.y;
    }

    var ySpeed = (worldScroll.y > this.targetY - viewportHeight / 2) ? 0.06 : 0.3;

    this.world.scrollTo({
        x: lerp(0.3, worldScroll.x, playerPosition.x - viewportWidth  / 2),
        y: lerp(ySpeed, worldScroll.y, this.targetY - viewportHeight / 2)
    });
};