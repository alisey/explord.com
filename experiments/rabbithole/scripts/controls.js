function NullControls() {
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
    this.onPress = $.Callbacks();
    this.onRelease = $.Callbacks();
}

function KeyboardControls() {
    this.up = false;
    this.down = false;
    this.right = false;
    this.left = false;
    this.onPress = $.Callbacks();
    this.onRelease = $.Callbacks();

    $(document).on('keydown keyup', function(e) {
        var key = {37: 'left', 38: 'up', 39: 'right', 40: 'down'}[e.which];
        if (key) {
            if (e.type == 'keydown') {
                if (!this[key]) {
                    this[key] = true;
                    this.onPress.fire(key);
                }
            } else {
                this[key] = false;
                this.onRelease.fire(key);
            }
            e.preventDefault();
        }
    }.bind(this));
}