function SnakeView(paper, tileSize) {
    var stepsPerSquare = 5;
    
    function segment(prev, cur) {
        prev = prev || cur;
        
        var points = seg([-prev[0], -prev[1]], cur, stepsPerSquare);
        for (var i = 0; i < points.length; i++) {
            points[i][0] = (tileSize * points[i][0] + tileSize) / 2;
            points[i][1] = (tileSize * points[i][1] + tileSize) / 2;
        }
        return points;
    }

    function seg(a, b, steps) {
        var points = [];
        var dx = b[0] - a[0];
        var dy = b[1] - a[1];
        for (var i = 0; i < steps; i++) {
            if (!dx || !dy) {
                points.push([
                    a[0] + dx * i / steps,
                    a[1] + dy * i / steps
                ]);
            } else {
                var dir = (b[0] == -a[1] && b[1] == a[0]) ? -1 : 1;
                var angle = Math.atan2(b[1], b[0]) + dir * i / steps * Math.PI / 2;
                points.push([
                    (a[0] || b[0]) - Math.cos(angle),
                    (a[1] || b[1]) - Math.sin(angle)
                ]);
            }
        }
        return points;
    }
    
    function generatePoints(segments) {
        var x = 0;
        var y = 0;
        var points = [];
        for (var i = 0; i < segments.length; i++) {
            var segmentPoints = segment(segments[i-1], segments[i], segments[i+1]);
            for (var j = 0; j < segmentPoints.length; j++) {
                points.push([x + segmentPoints[j][0], y + segmentPoints[j][1]]);
            }
            x = x + segments[i][0] * tileSize;
            y = y + segments[i][1] * tileSize;
        }
        return points;
    }
    
    function drawPoints(points, offset) {
        // shadow
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#000';
        ctx.globalAlpha = 0.2;
        ctx.translate(offset[0] + 2, offset[1] + 2);
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.stroke();
        ctx.restore();
    
        // shadow
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#000';
        ctx.globalAlpha = 0.4;
        ctx.translate(offset[0] + 1, offset[1] + 1);
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.stroke();
        ctx.restore();
    
        // body
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#000';
        ctx.translate(offset[0], offset[1]);
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.stroke();
        ctx.restore();
        
        // yellow dots
        ctx.save();
        ctx.translate(offset[0], offset[1]);
        for (var i = 1; i < points.length - 1; i++) {
            if (i % 3) continue;
            var angle = Math.atan2(points[i+1][1] - points[i-1][1], points[i+1][0] - points[i-1][0]);
            ctx.beginPath();
            if (i % 6) {
                ctx.fillStyle = '#fc0';
                ctx.arc(points[i][0] + Math.sin(angle) * 4, points[i][1] - Math.cos(angle) * 4, 1.1, 0, Math.PI * 2);
                ctx.arc(points[i][0] - Math.sin(angle) * 4, points[i][1] + Math.cos(angle) * 4, 1.1, 0, Math.PI * 2);
            } else {
                ctx.fillStyle = '#eee';
                ctx.arc(points[i][0], points[i][1], 1.1, 0, Math.PI * 2);
            }
            ctx.fill();
        }
        ctx.restore();
    }
    
    function redraw(step, growing) {
        var segments = [];
        for (var i = 1; i < this.snake.length; i++) {
            var dx = this.snake[i][0] - this.snake[i-1][0];
            var dy = this.snake[i][1] - this.snake[i-1][1];
            segments.push([dx, dy]);
        }
        var points = generatePoints(segments);
        // always remove front half of segment
        var cutoff = Math.floor(stepsPerSquare / 2) + stepsPerSquare - step;
        points = points.slice(cutoff, cutoff + (this.snake.length - 3) * stepsPerSquare);
        if (growing) {
            points = points.slice(0, points.length - stepsPerSquare + step + 1);
        }
        drawPoints(points, [this.snake[0][0] * tileSize, this.snake[0][1] * tileSize]);
    }
    
    var ctx = paper.getContext('2d');
    
    this.snake = [];
    return {
        redraw: redraw,
        stepsPerSquare: stepsPerSquare
    };
}

function Betty(paper, tileSize) {
    var view = new SnakeView(paper, tileSize);
    var substep = 4;
    var growing = 0;
    
    function setSegments(x, y, dirs) {
        var coords = [[x, y]];
        for (var i = 0; i < dirs.length; i++) {
            x = x - dirs[i][0];
            y = y - dirs[i][1];
            coords.push([x, y]);
        }
        
        coords.push(coords[coords.length - 1]);
        
        view.snake = coords;
    }
    
    return {
        go: function(dir, grow) {
            substep = 0;
            growing = grow;
            view.snake.unshift([
                view.snake[0][0] + dir[0],
                view.snake[0][1] + dir[1]
            ]);
            
            if (!grow) {
                view.snake.pop();
            }
        },
        tick: function() {
            if (substep < 4) {
                substep += 1;
                return true;
            } else {
                return false;
            }
        },
        render: function() {
            view.redraw(substep, growing);
        },
        setSegments: setSegments
    };
}


function SnakeWorldView(params) {
    var tileSize = 15;
    var animationInterval = 16;
    var fastmo = false;
    var slowmo = false;
    var nextFrameTimer;
    
    var paper = document.createElement('canvas');
    paper.style.position = 'absolute';
    
    
    var appleDiv = document.createElement('div');
    appleDiv.className = 'apple';
    appleDiv.style.position = 'absolute';
    appleDiv.style.background = 'url(target.png) no-repeat';
    appleDiv.style.width = '28px';
    appleDiv.style.height = '28px';
    appleDiv.style.marginLeft = '-6px';
    appleDiv.style.marginTop = '-6px';
    appleDiv.style.display = 'none';
    var appleCoords = null;
    
    var ctx = paper.getContext('2d');
    var bet = new Betty(paper, tileSize);
    var awaiting = false;
    bet.setSegments(params.snake[0], params.snake[1], params.snake[2]);
    paper.width = params.width * tileSize;
    paper.height = params.height * tileSize;
    params.container.appendChild(appleDiv);
    params.container.appendChild(paper);
    params.container.style.width = params.width * tileSize + 'px';
    params.container.style.height = params.height * tileSize + 'px';
    params.container.style.position = 'relative';
    
    function render() {
        ctx.clearRect(0, 0, paper.width, paper.height);
        //drawGrid(); //@@@
        bet.render();
    }

    var globalTick = 0;
    var dead = false;
    function tick(boo) {
        if (!boo) {
            nextFrameTimer = setTimeout(tick, 16);
        }

        if (!bet.tick()) {
            params.onStepCompletion(function(dir, grow) {
                bet.go(dir, grow);
            });
        }

        if (dead) {
            render();
            return;
        }

        if (globalTick < 1) {
            if (location.hash == '#fast') {
                globalTick += 0.05;
            } else if (location.hash == '#superfast') {
                globalTick += 0.001;
            } else {
                globalTick += 0.5;
            }
            tick(true);
        } else {
            globalTick = 0;
            render();
        }
    }

    function drawGrid() {
        ctx.save();
        ctx.strokeStyle = '#eee';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        for (var x = 0; x < paper.width; x += tileSize) {
            for (var y = 0; y < paper.height; y += tileSize) {
                ctx.strokeRect(x + 0.5, y + 0.5, tileSize , tileSize);
            }
        }
        ctx.globalAlpha = 1;
        ctx.restore;
    }
    
    function placeApple(coords) {
        if (!appleCoords || coords[0] != appleCoords[0] || coords[1] != appleCoords[1]) {
            appleCoords = coords;
            appleDiv.style.webkitAnimation = 'none';
            appleDiv.style.animation = 'none';
            appleDiv.style.display = 'none';
            setTimeout(function() {
                appleDiv.style.webkitAnimation = '';
                appleDiv.style.animation = '';
                appleDiv.style.display = '';
            });
        }
        
        appleDiv.style.left = coords[0] * tileSize + 'px';
        appleDiv.style.top = coords[1] * tileSize + 'px';
    };
    
    setTimeout(tick, animationInterval);
    
    render();
    placeApple(params.apple);
    
    return {
        placeApple: placeApple,
        fastmo: function(onOrOff) {
            fastmo = onOrOff;
        },
        slowmo: function(onOrOff) {
            slowmo = onOrOff;
        },
        destroy: function() {
            clearTimeout(nextFrameTimer);
            paper.parentNode.removeChild(paper);
            appleDiv.parentNode.removeChild(appleDiv);
        },
        stop: function() {
            clearTimeout(nextFrameTimer);
            dead = true;
        }
    }
}



function ForceField(container, tileSize, width, height) {
    var field = document.createElement('div');
    var cells = [];
    field.className = 'force-field';
    field.style.width = width * tileSize + 'px';
    field.style.height = height * tileSize + 'px';
    field.style.position = 'absolute';
    for (var i = 0; i < width * height; i++) {
        var cell = document.createElement('div');
        cell.style.width = tileSize + 'px';
        cell.style.height = tileSize + 'px';
        cell.innerHTML = '';
        field.appendChild(cell);
        cells.push(cell);
    }
    
    container.appendChild(field);
    var visible = true;
    var clean = true;
    
    return {
        clear: function() {
            if (clean) {return;}
            clean = true;
            for (var i = 0; i < cells.length; i++) {
                //cells[i].style.background = '';
                cells[i].style.opacity = 0;
            }
        },
        setDirection: function(cell, dirs) {
            if (!visible) return;
            
            clean = false;
            bg = [];
            for (var i = 0; i < dirs.length; i++) {
            
                dir = dirs[i];
                     if (dir == -1) dir = 'left';
                else if (dir ==  1) dir = 'right';
                else if (dir <   0) dir = 'up';
                else if (dir >   0) dir = 'down';
                
                bg.push('url(arrow-' + dir + '.png)');
                cells[cell].style.background = bg.join(',');
                cells[cell].style.opacity = 0.4;
            }
        },
        highlight: function(cell) {
            if (!visible) return;
            cells[cell].style.opacity = 1;
        },
        toggle: function(showOrHide) {
            visible = showOrHide;
        },
        isOn: function() {
            return visible;
        },
        destroy: function() {
            container.removeChild(field);
        }
    };
}