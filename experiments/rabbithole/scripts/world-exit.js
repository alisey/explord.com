// The exit is attached in the bottom right corner using CSS
function WorldExit(world) {
    this.world = world;
    this.$node = this.createNode();
    this.$maskNode = this.createMaskNode();

    this.world.getNode().append([this.$node, this.$maskNode]);
}

WorldExit.prototype.prepareForJump = function() {
    this.$maskNode.show();
};

WorldExit.prototype.blink = function() {
    this.$node.find('#exitblink')[0].beginElement();
};

WorldExit.prototype.grow = function() {
    this.$maskNode.hide();
    this.$node.addClass('growing');
    this.$node.find('#exitgrow')[0].beginElement();
};

WorldExit.prototype.getPosition = function() {
    return {
        x: this.world.getRight() - 300,
        y: this.world.getBottom()
    };
};

WorldExit.prototype.createNode = function() {
    return $(
        '<div id="exit"> ' +
            '<svg width="4000" height="4000"> ' +
                '<g transform="translate(3860 3750)"> ' +
                    '<path ' +
                        'fill="#05CC47" ' +
                        'd=" ' +
                            'M100 0 ' +
                            'L99.96 0 ' +
                            'L99.95 0 ' +
                                'L71.32 0 ' +
                                'L68.26 3.04 ' +
                                'L53.67 30.89 ' +
                                'L49.41 33.35 ' +
                                'L0 33.35 ' +
                            'L0 74.97 ' +
                                'L26.40 74.97 ' +
                                'L29.15 77.72 ' +
                                'L0 133.36 ' +
                            'L0 166.50 ' +
                            'L0 166.61 ' +
                            'L0 166.61 ' +
                                'L28.70 166.60 ' +
                                'L31.77 163.55 ' +
                                'L46.39 135.69 ' +
                                'L50.56 133.28 ' +
                                'L100 133.28 ' +
                            'L100 91.68 ' +
                                'L73.52 91.68 ' +
                                'L70.84 89.00 ' +
                                'L100 33.33 ' +
                        '" ' +
                    '> ' +
                        '<animate ' +
                            'attributeName="fill" ' +
                            'values="#000;#05CC47;#05AC37;#05CC47" ' +
                            'dur="0.4" ' +
                            'id="exitblink" ' +
                            'begin="indefinite" ' +
                        '/> ' +
                        '<animate ' +
                            'attributeName="fill" ' +
                            'to="#000" ' +
                            'dur="0.45" ' +
                            'fill="freeze" ' +
                            'begin="exitgrow.begin" ' +
                        '/> ' +
                        '<animateTransform ' +
                            'attributeName="transform" ' +
                            'type="scale" ' +
                            'fill="freeze" ' +
                            'from="1" ' +
                            'to="30" ' +
                            'dur="0.75" ' +
                            'id="exitgrow" ' +
                            'begin="indefinite" ' +
                        '/> ' +
                    '</path> ' +
                    '<animateTransform ' +
                        'attributeName="transform" ' +
                        'type="translate" ' +
                        'fill="freeze" ' +
                        'from="3860 3720" ' +
                        'to="2220 2220" ' +
                        'dur="0.75" ' +
                        'begin="exitgrow.begin" ' +
                    '/> ' +
                '</g> ' +
            '</svg> ' +
        '</div> '
    );
};

WorldExit.prototype.createMaskNode = function() {
    return $(
        '<div id="exitmask"> ' +
            '<svg width="200" height="210"> ' +
                '<path fill="#D4DFD1" d=" ' +
                    'M100 0 ' +
                    'H200 ' +
                    'L200 210 ' +
                        'L28.70 210 ' +
                        'L31.77 163.55 ' +
                        'L46.39 135.69 ' +
                        'L50.56 133.28 ' +
                        'L100 133.28 ' +
                    'L100 91.68 ' +
                        'L73.52 91.68 ' +
                        'L70.84 89.00 ' +
                        'L100 33.33 ' +
                '"> ' +
            '</svg> ' +
        '</div> '
    );
};