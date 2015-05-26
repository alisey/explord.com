(function() {
    var map,
        Zaporozhye = new google.maps.LatLng(47.839028, 35.139728),
        Malmo = new google.maps.LatLng(55.604633, 13.003864);

    function initMap() {
        var mapOptions = {
            zoom: 14,
            minZoom: 4,
            maxZoom: 15,
            center: Malmo,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        map.overlayMapTypes.insertAt(0, new ExploredMapType(new google.maps.Size(256, 256)));
        addPins(map);
    }

    function ExploredMapType(tileSize) {
        this.tileSize = tileSize;
    }

    ExploredMapType.prototype.getTile = function(coord, zoom, doc) {
        var tileCanvas  = doc.createElement('canvas');
        var tileContext = tileCanvas.getContext('2d');
        var subTileSize = 64;
        var explored = exploredSquares(subTileSize, zoom);
        
        tileCanvas.width  = this.tileSize.width;
        tileCanvas.height = this.tileSize.height;
        
        for (var subTileX = 0; subTileX < 4; subTileX++) {
            for (var subTileY = 0; subTileY < 4; subTileY++) {
                var x = coord.x * 4 + subTileX;
                var y = coord.y * 4 + subTileY;
                
                var o = !!explored[(x + 0) + ',' + (y + 0)];
                var t = !!explored[(x + 0) + ',' + (y - 1)];
                var r = !!explored[(x + 1) + ',' + (y + 0)];
                var b = !!explored[(x + 0) + ',' + (y + 1)];
                var l = !!explored[(x - 1) + ',' + (y + 0)];
                
                if (o) {
                    var tr = !!explored[(x + 1) + ',' + (y - 1)];
                    var br = !!explored[(x + 1) + ',' + (y + 1)];
                    var bl = !!explored[(x - 1) + ',' + (y + 1)];
                    var tl = !!explored[(x - 1) + ',' + (y - 1)];
                    
                    var spriteX = 1 * !(tl || l || t) + 2 * !(tr || r || t) + 4 * !(br || r || b) + 8 * !(bl || l || b);
                    var spriteY = 1;
                } else {
                    var spriteX = 1 * (l && t) + 2 * (r && t) + 4 * (r && b) + 8 * (l && b);
                    var spriteY = 0;
                }
                
                tileContext.drawImage(fogSprite,
                    spriteX  * subTileSize, spriteY  * subTileSize, subTileSize, subTileSize,
                    subTileX * subTileSize, subTileY * subTileSize, subTileSize, subTileSize);
            }
        }
        
        return tileCanvas;
    }

    function addPins(map) {
        var pinIcon = new google.maps.MarkerImage(
            'img/pin.png',
            null, // size
            null, // origin
            new google.maps.Point(3, 3) // anchor
        );
        
        for (var i = 0; i < spots.length; i++) {
            var spot = spots[i];
            new google.maps.Marker({
                position: new google.maps.LatLng(spot[0], spot[1]),
                map: map,
                icon: pinIcon,
                title: spot[2]
            });
        }
    }
    
    function exploredSquares(tileSize, zoom) {
        if (!exploredSquares.cache) {
            exploredSquares.cache = {};
        }
        
        if (!exploredSquares.cache[zoom]) {
            var cache = exploredSquares.cache[zoom] = {};
            var projection = map.getProjection();
            var tileScale = Math.pow(2, zoom) / tileSize;
            for (var i = 0; i < spots.length; i++) {
                var spot = spots[i];
                var worldCoords = projection.fromLatLngToPoint(new google.maps.LatLng(spot[0], spot[1]));
                var tileX = Math.floor(worldCoords.x * tileScale);
                var tileY = Math.floor(worldCoords.y * tileScale);
                cache[tileX + ',' + tileY] = 1;
            }
        }
        
        return exploredSquares.cache[zoom];
    }
    
    var fogSprite = (function() {
        var s = 64;
        var r = 15;
        var fill = 'rgba(0, 20, 30, 0.6)';
        var border = 'rgba(0, 0, 0, 0.2)';
        
        var cv = document.createElement('canvas');
        cv.width = s * 16;
        cv.height = s * 2;
        var ct = cv.getContext('2d');
        ct.fillStyle = fill;
        ct.strokeStyle = border;
        
        for (var x = 0; x < 16; x++) {
            for (var y = 0; y < 2; y++) {
                var x1 = x * s, y1 = y * s,
                    x2 = x1 + s, y2 = y1 + s,
                    pi = Math.PI;
                
                if (y == 1) {
                    ct.fillRect(x1, y1, s, s);
                    ct.globalCompositeOperation = 'destination-out';
                    ct.fillStyle = '#000';
                }
                
                ct.beginPath();
                // Opera doesn't work correctly with arcTo(), grrr
                x & 1 ? ct.moveTo(x1 + r, y1)       : ct.moveTo(x1, y1);
                x & 2 ? (ct.lineTo(x2 - r, y1), ct.arc(x2 - r, y1 + r, r, -pi/2, 0))  : ct.lineTo(x2, y1);
                x & 4 ? (ct.lineTo(x2, y2 - r), ct.arc(x2 - r, y2 - r, r, 0, pi/2))   : ct.lineTo(x2, y2);
                x & 8 ? (ct.lineTo(x1 + r, y2), ct.arc(x1 + r, y2 - r, r, pi/2, pi))  : ct.lineTo(x1, y2);
                x & 1 ? (ct.lineTo(x1, y1 + r), ct.arc(x1 + r, y1 + r, r, pi, -pi/2)) : ct.lineTo(x1, y1);
                ct.fill();
                
                ct.globalCompositeOperation = 'source-over';
                ct.fillStyle = fill;
                // at the bottom for a subtle 3d effect
                ct.beginPath();
                    ct.moveTo(x1, y2 - 0.5);
                    ct.lineTo(x2 - 0.5, y2 - 0.5);
                    ct.lineTo(x2 - 0.5, y1);
                ct.stroke();
            }
        }
        
        return cv;
    })();
    
    initMap();
})();