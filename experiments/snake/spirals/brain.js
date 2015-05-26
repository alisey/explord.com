function AsyncBrain(world) {
    var brain = new Brain(world, true);
    return {
        suggestMove: function(callback) {
            callback(brain.suggestMove() || null);
        }
    };
}

function Brain(world, predictOn) {
    var meta, plan = [], wantPrediction = false;
    
    function suggestMove() {
        meta = null;
        
        // dead.
        var validMoves = world.validMoves();
        
        if (validMoves.length == 0) {
            return null;
        }
        
        // reset plan when we ate an apple
        if (plan.length && world.ateApple) {
            plan = [];
        }
        
        // следовал плану и уткнулся в яблоко. какому плану следовал?
        var move = plannedMove();
        if (move) {
            return move;
        }
        
        if (true) {
            var _loop = loopToTail(world, true);
            if (_loop.solved) {
                plan = pathToMoves(_loop.bestPath); // longest path to tail
                plan.type = 'longest to tail';
                plan.path = _loop.bestPath;
                plan.world = world.clone();
                return plannedMove();
            }
            
            return validMoves[0] || null;
        }

        // what predictor says?
        // we can't do any automatic moves before predictor makes the decision, because it only works when we stepped on apple
        if (predictOn && world.ateApple || wantPrediction) {
            var prediction = predictorSaysWhat(world);
            if (!prediction.goodToGo) {
                wantPrediction = world.snake.length < 250; // as soon as we reach the tail, who knows what to do next
                var _loop = loopToTail(world, true);
                if (!_loop.solved) {
                    console.log('@@@ Cant solve longest path to tail, snake length: ' + world.snake.length);
                    // debugGrid(world);die(); 
                }
                plan = pathToMoves(_loop.bestPath); // longest path to tail
                plan.type = 'longest to tail';
                plan.path = _loop.bestPath;
                plan.world = world.clone();
                return plannedMove();
                
                var moves = prediction.moves;
                var head = world.snakeCoords()[0];
                var path = [head];
                for (var i = 0; i < moves.length; i++) {
                    head = Coords.add(head, moves[i]);
                    path.push(head);
                }
                meta = {predictedPath: path, bestPath: prediction.longest};
                return null; // let's see what we've got
            } else {
                // have good prediction, don't want one now
                wantPrediction = false;
            }
        }
        
        
        // planned move goes here
        
        if (validMoves.length == 1) {
            return validMoves[0] || null;
        }
        
        // shorest path to apple
        var move = shortestToApple();
        if (move) {
            return move;
        }
        
        // return validMoves[0];
        
        // wriggle! avg: 64 segments
        var loop = loopToTail(world);
        meta = loop;
        if (loop.solved) {
            plan = [];
            plan.type = '"minimal to tail (non-reachable apple)"';
            plan.path = loop.bestPath;
            plan.world = world.clone();
            var path = loop.bestPath;
            for (var i = 1; i < path.length; i++) {
                plan.push(Coords.sub(path[i], path[i-1]));
            }
            
            var move = plannedMove();
            return move;
        }
        
        return null;
    }
    
    function plannedMove() {
        var move = plan.shift();
        if (!move) {plan = [] }
        if (move && !world.isValidMove(move)) { // планировщик ходов значит не учитывает, когда мы съедаем яблоко во время wriggling, когда выбираем длиннейший путь к хвосту
            console.log('Invalid move ' + plan.type + ' at snake length ' + world.snake.length);
            debugGrid(plan.world, {red: plan.path});
            debugGrid(world, {red: plan.path});die();
        }
        return move;
    }
    
    function shortestToApple() {
        var headCoords  = world.cellCoords(world.snake[0]);
        var appleCoords = world.appleCoords();
        var path = shortestPath(headCoords, appleCoords, world.grid);
        if (path) {
            return Coords.sub(path[1], path[0]);
        } else {
            return null;
        }
    }
    
    function getMeta() {
        return meta;
    }
    
    return {
        suggestMove: suggestMove,
        getMeta: getMeta
    };
}

function pathToMoves(path) {
    moves = [];
    for (var i = 1; i < path.length; i++) {
        moves.push(Coords.sub(path[i], path[i-1]));
    }
    return moves;
}

function loopToTail(world, longLoop) {
    // we expect that finding the shortest path to apple failed, and the snake has a choice of at least 2 moves
    // try to reach the tail, if we can circle around, we will eventually get in direct visibility with apple
    // don't try to find the longest path, just long enough to put the head directly after the tail
    // btw, the tail will not move right now, because we've just eaten an apple
    // a) tail might be out of direct visibility, then we need to find a segment closest to tail that is.
    // b) even the colsest to tail segment might not give us a long enough path, try segments closer to head then
    //    for example, if the segment is a neighbor of head on this move, or the next one, we might not be able
    //    to wriggle that path.
    
    var snake = world.snakeCoords();
    var apple = world.appleCoords();
    var occupyMin = world.growth ? 0 : -1; // need at minimum one free cell if we've eaten apple and tail will grow now
    var bestPath = null;
    var bestExit = null;
    var solved = false;
    
    var longestPath = null;
    for (var i = snake.length - 1; i > 3; i--) {
        occupyMin++;
        var exit = snake[i];
        var path = shortestPath(snake[0], exit, world.grid);
        if (!path) {
            // the segment is not in direct visibility
            continue;
        }
        
        var wriggly = new WrigglyPath(world.grid.clone(), path);
        // some empty cells are already occupied by shortest path
        var occupied = (path.length - 2);
        // wriggle just enough to reach the tail
        while (((occupied < occupyMin) || longLoop) && wriggly.wriggleNext()) {
            occupied += 2; // each wriggle occupies 2 new cells
        }
        wriggly.wriggleNext(); // @@@ one more to give space for new apples that could emerge unexpectedly
        wriggly.wriggleNext(); // this stuff doesn't seem to help

        if (occupied >= occupyMin) {
            // yay! and maybe we didn't even need to wriggle
            solved = true;
            bestPath = wriggly.segments;
            bestExit = exit;
            break;
        // the most rational thing is to minimize the number of cells remaining to occupy
        // but let's optimize for longest path, to see a long beautiful death
        } else if (longestPath === null || path.length > longestPath) {
            longestPath = path.length;
            bestPath = wriggly.segments;
            bestExit = exit;
        }
    }
    
    return {
        solved: solved,
        bestPath: bestPath, // it's even possible there's no path, mkay?
        bestExit: bestExit
    };
}

function canLoop(world) {
    return loopToTail(world).solved;
}

function predictorSaysWhat(realWorld) {
    // valid move must exist when calling this, otherwise we're stuck at the same apple we just ate
    
    /*
    if (!realWorld.ateApple) {
        // go eat some apple first, and I'll tell ya what to do next
        return {goodToGo: true};
    }
    */
    
    var world = realWorld.clone();
    var brain = new Brain(world, false);
    var predictedMoves = [];
    for (var dir; dir = brain.suggestMove();) {
        world.move(dir);
        predictedMoves.push(dir);
        if (world.ateApple) {
            break;
        }
    }
    if (predictedMoves.length && world.ateApple) {
        return {
            goodToGo: canLoop(world), // if you can loop to tail when you eat that apple, you're on the right way
            moves: predictedMoves
        };
    }
    
    return {
        goodToGo: true // Sorry, no choice. You'll die without getting apple baby
    };
}