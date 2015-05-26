(function() {
    window.RecordPlayer = RecordPlayer;
    
    function RecordPlayer(recording) {
        if (!$.isArray(recording)) {
            throw('invalid_recording');
        }
        var str = recording.shift();
        if (!str || typeof str != 'string') {
            throw('invalid_recording');
        }
        var steps = recording;
        if (!$.isArray(steps)) {
            throw('invalid_recording');
        }
        
        var centers = str.split('');
        str = str.toLowerCase();
        var $node = $('<div class="pal-widget">');
        var wcenters = [];
        for (var i = 0; i < centers.length; i++) {
            var w = palCenterWidget(centers[i]);
            wcenters.push(w);
            $node.append(w.node);
        }
        
        var indicator = centerIndicator();
        var expander  = palExpander();
        var subexpander  = palSubExpander();
        $node.append(indicator.node);
        $node.append(expander.node);
        $node.append(subexpander.node);
        $node.append('<div style="clear: both"></div>');
        
        var isPalindrome = function(s) {
            return s == s.split('').reverse().join('');
        };
        
        var best = 0;
        
        var self = {
            node: $node,
            cmp: function(a, b, good) {
                setTimeout(function() {
                    if (good && (b - a > best) && isPalindrome(str.substring(a, b + 1))) {
                        best = b - a;
                        self.longest(a, b);
                    }
                
                    a = wcenters[a];
                    b = wcenters[b];
                    if (good) {
                        if (a == b) {
                            a.good();
                        } else {
                            a.good(true);
                            b.good();
                        }
                    } else {
                        if (a == b) {
                            a.bad();
                        } else {
                            a.bad(true);
                            b.bad();
                        }
                    }
                }, 500);
            },
            goto: function(a, b, good) {
                if (!wcenters[a] || !wcenters[b]) return false;
                if (a <= b)
                    expander.moveTo(wcenters[a], wcenters[b]);
                else
                    expander.moveTo(wcenters[b], wcenters[a]);
                self.cmp(a, b, good);
                return true;
            },
            longest: function(a, b) {
                subexpander.moveTo(wcenters[a], wcenters[b]);
            },
            point: function(i) {
                var after = (i != Math.floor(i));
                i = Math.floor(i);
                if (!wcenters[i]) return false;
                indicator.point(wcenters[i], after);
                return true;
            },
            fadeOut: function() {
                $(indicator.node).add(expander.node).fadeOut();
            },
            play: function() {
                var lol = function() {
                    var step = steps.shift();
                    if (!step || !$.isArray(step)) {
                        self.fadeOut();
                        return;
                    }
                    var cmd = step[0]
                    var args = step.slice(1);
                    
                    if (cmd == 'p') {
                       self.point(args[0]);
                       setTimeout(lol, 1);
                    } else if (cmd == 'c') {
                        if (self.goto(args[0], args[1], args[2])) {
                            setTimeout(lol, 1300);
                        } else {
                            setTimeout(lol, 1);
                        }
                    }
                };
                lol();
            },
            appendTo: function(selector) {
                $node.width(33 * wcenters.length + 1).appendTo(selector);
                
            }
        };
        
        return self;
    }

    function palCenterWidget(char) {
        var $char = $('<div class="pal-center-char">&nbsp;</div>');
        var $size = $('<div class="pal-center-size"></div>');
        var $node = $('<div class="pal-center">')
                    .append($char).append($size);
        
        if (char != ' ') {
            $char.text(char).addClass('filled');
        }
        
        return {
            node: $node,
            char: char,
            setSize: function(size) {
                $size.text(size).addClass('filled');
            },
            getPosition: function() {
                var offset = $char.position();
                var w      = $char.width();
                var h      = $char.height();
                return {
                    x1: offset.left,
                    x2: offset.left + w,
                    y1: offset.top,
                    y2: offset.top + h,
                    w : w,
                    h : h
                }
            },
            good: function(left) {
                $char.animate({
                    backgroundColor: '#6E6'
                }).animate({
                    backgroundColor: '#fff'
                });
            },
            bad: function(left) {
                $char.animate({
                    backgroundColor: '#f44'
                }).animate({
                    backgroundColor: '#fff'
                });                
            }
        }
    }
    
    function centerIndicator() {
        var $node = $('<div class="pal-center-indicator">&#9671;</div>');
        
        return {
            node: $node,
            point: function(c, after) {
                c = c.getPosition();
                var left = after ? c.x2 + 2 : (c.x1 + c.w / 2);
                $node.animate({
                    left: left - $node.width() / 2,
                    top:  c.y1 - $node.height()
                }, $node.is(':visible') ? 300 : 0).show();
            }
        }
    }
    
    function palExpander() {
        var $node = $('<div class="pal-expander">');
        var self = {
            node: $node,
            moveTo: function(i, j) {
                i = i.getPosition();
                j = j.getPosition();
                $node.animate({
                    left:   i.x1,
                    top:    i.y1,
                    width:  j.x2 - i.x1,
                    height: i.h
                }, $node.is(':visible') ? 300 : 0, 'easeOutBack').show();
            }
        };
        return self;
    }
    
    function palSubExpander() {
        var $node = $('<div class="pal-longest-match">');
        var self = {
            node: $node,
            moveTo: function(i, j) {
                i = i.getPosition();
                j = j.getPosition();
                $node.animate({
                    left:   i.x1,
                    top:    i.y2,
                    width:  j.x2 - i.x1
                }, $node.is(':visible') ? 300 : 0, 'easeOutBack').show();
            }
        };
        return self;
    }
})();