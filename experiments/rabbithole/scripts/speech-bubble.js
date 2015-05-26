function LoginSpeechBubble() {
    return new SpeechBubble([
        '<u style="cursor:pointer">LOG IN</u> and take me to',
        'the rabbit hole!'
    ]);
}

function LetsMoveSpeechBubble() {
    return new SpeechBubble(['Take me to the rabbit', 'hole using &larr;&uarr;&rarr;']);
}

function FoundItSpeechBubble() {
    return new SpeechBubble(['I\'ve found it!']);
}

function SpeechBubble(lines) {
    this.lines = lines;
    this.tailPoint = {x: 25, y: 96};
    this.$node = this.createNode();
}

SpeechBubble.prototype.setPosition = function(position) {
    this.$node.css({
        left: position.x - this.tailPoint.x,
        top:  position.y - this.tailPoint.y
    });
};

SpeechBubble.prototype.getNode = function() {
    return this.$node;
};

SpeechBubble.prototype.remove = function() {
    this.$node.remove();
};

SpeechBubble.prototype.show = function() {
    setTimeout(function() {
        this.$node.css({
            transform: 'scale(' + (this.lines.length > 1 ? 1 : 0.7) + ')',
            margin: this.lines.length > 1 ? 0 : '-3px 0 0 -15px'
        });
    }.bind(this), 16);
};

SpeechBubble.prototype.createNode = function() {
    var bubbleShape =
        '<svg width="196" height="96">' +
            '<path fill="rgba(222, 222, 222, .85)" stroke="#fff" stroke-width="4"' +
            ' d="M 2 2 m 18 0 h 174 v 54 l -18 18 h -124 l -25 18 v -18 h -25 v -55 Z"' +
        '></svg>';

    return $('<div class="speech-bubble">').css({
        position: 'absolute',
        width: 196,
        height: 96,
        boxSizing: 'border-box',
        transform: 'scale(0)',
        transformOrigin: this.tailPoint.x + 'px ' + this.tailPoint.y + 'px',
        transition: 'transform 0.3s cubic-bezier(0.7, 0.1, 0.6, 1.4)' // resembles easeOutBack
    }).append(
        $(bubbleShape).css({
            position: 'absolute',
            zIndex: -1
        })
    ).append(
        $('<div>').css({
            lineHeight: '76px',
            textAlign: 'center'
        }).append(
            $('<div>').css({
                display: 'inline-block',
                textAlign: 'left',
                verticalAlign: 'middle',
                fontFamily: 'Arial, sans-serif',
                fontSize: this.lines.length > 1 ? '16px' : '30px',
                fontWeight: 'bold',
                lineHeight: '20px',
                cursor: 'default'
            }).append(
                this.lines.join('<br>')
            )
        )
    );
};