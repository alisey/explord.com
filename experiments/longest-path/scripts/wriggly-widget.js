function WrigglyWidget(params) {
    var width = params.width;
    var height = params.height;
    var startPoint = params.startPoint;
    var endPoint = params.endPoint;
    var walls = params.walls;
    var container = document.createElement('div');
    container.className = 'wriggly-widget';
    var grid = new Grid(width, height);
    var view = new SnakeGridView(container, width, height);
    var drawTimer = null;
    
    view.setStartPoint(startPoint);
    view.setEndPoint(endPoint);
    for (var i = 0; i < walls.length; i++) {
        grid.set(walls[i], 1);
        view.setWall(walls[i], 1);
    };
    
    view.onWallChange = function(coords, hasWall) {
        grid.set(coords, hasWall);
        draw();
    };
    
    view.onStartPointMove = function(newStartPoint) {
        startPoint = newStartPoint;
        draw();
    };
    
    view.onEndPointMove = function(newEndPoint) {
        endPoint = newEndPoint;
        draw();
    };
    
    function draw() {
        clearInterval(drawTimer);
        var path = shortestPath(startPoint, endPoint, grid);
        if (path) {
            var snake = new WrigglyPath(grid.clone(), path);
            snake.wriggleAll();
            view.drawPath(snake);
        } else {
            view.clearPath();
        }
    }
    
    function drawAnimate() {
        var path = shortestPath(startPoint, endPoint, grid);
        if (path) {
            var snake = new WrigglyPath(grid.clone(), path);
            drawTimer = setInterval(function() {
                if (snake.wriggleNext()) {
                    view.drawPath(snake);
                } else {
                    clearInterval(drawTimer);
                }
            }, 100);
        } else {
            view.clearPath();
        }
    }
    
    function resetAnimation() {
        clearInterval(drawTimer);
    }
    
    function dump() {
        return JSON.stringify({
            width: width,
            height: height,
            startPoint: startPoint,
            endPoint: endPoint,
            walls: function() {
                var walls = [];
                grid.eachCell(function(coords, val) {
                    if (val) walls.push(coords);
                });
                return walls;
            }()
        });
    }
    
    drawAnimate();
    
    return {
        node: container,
        dump: dump
    };
}