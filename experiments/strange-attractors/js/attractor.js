/* global THREE */
'use strict';

function euler(y, h, f) {
    var k1 = f(y[0], y[1], y[2]);
    return [
        y[0] + h * k1[0],
        y[1] + h * k1[1],
        y[2] + h * k1[2]
    ];
}

function rk4(y, h, f) {
    var k1 = f(y[0], y[1], y[2]);
    var k2 = f(y[0] + k1[0]*h/2, y[1] + k1[1]*h/2, y[2] + k1[2]*h/2);
    var k3 = f(y[0] + k2[0]*h/2, y[1] + k2[1]*h/2, y[2] + k2[2]*h/2);
    var k4 = f(y[0] + k3[0]*h/1, y[1] + k3[1]*h/1, y[2] + k3[2]*h/1);
    return [
        y[0] + h/6*(k1[0] + 2*k2[0] + 2*k3[0] + k4[0]),
        y[1] + h/6*(k1[1] + 2*k2[1] + 2*k3[1] + k4[1]),
        y[2] + h/6*(k1[2] + 2*k2[2] + 2*k3[2] + k4[2])
    ];
}

function vectorFromPoint(x) {
    return new THREE.Vector3(x[0], x[1], x[2]);
}

function vectorsFromPoints(xs) {
    return xs.map(vectorFromPoint);
}

function vectorsAverage(xs) {
    var sum = xs.reduce(function(sum, x) {
        return sum.add(x);
    }, new THREE.Vector3());
    return sum.divideScalar(xs.length);
}

function vectorsMaxLength(xs) {
    var len = 0;
    for (var i = 0; i < xs.length; i++) {
        len = Math.max(len, xs[i].length());
    }
    return len;
}

function integrateAttractor(attractor) {
    var f = attractor.equation;
    var y = attractor.start;
    var t = attractor.time;
    var h = attractor.timeStep;
    var takeEvery = attractor.takeEvery;
    var steps = Math.floor(t / h);

    var points = [];
    for (var i = 0; i < steps; i++) {
        if (i % takeEvery === 0) {
            points.push(y);
        }
        y = rk4(y, h, f);
    }
    return points;
}

function generateAttractorVertices(attractor, size) {
    var xs = vectorsFromPoints(integrateAttractor(attractor));
    var center = vectorsAverage(xs);
    xs.forEach(function(x) {
        x.sub(center);
    });
    var scale = size / vectorsMaxLength(xs);
    xs.forEach(function(x) {
        return x.multiplyScalar(scale);
    });
    return xs;
}

var AttractorTypes = {
    lorenz: {
        equation: function(x, y, z) {
            var p = 28, a = 10, b = 8/3;
            return [a*(y - x), x*(p - z) - y, x*y - b*z];
        },
        start: [0.6, 0, 19],
        time: 20,
        timeStep: 0.01,
        takeEvery: 1,
        angle: [-1.5, 0, 2.5]
    },
    halvorsen: {
        equation: function(x, y, z) {
            var a = 1.4;
            return [
                -a*x - 4*y - 4*z - y*y,
                -a*y - 4*z - 4*x - z*z,
                -a*z - 4*x - 4*y - x*x
            ];
        },
        start: [-3.3, -6.5, -1.9],
        time: 50,
        timeStep: 0.01,
        takeEvery: 1,
        angle: [0.35, -0.8, -0.3]
    },
    hadley: {
        equation: function(x, y, z) {
            var a = 0.2, b = 4, c = 8, d = 1;
            return [
                -y*y - z*z + a*c,
                x*y - b*x*z - y + d,
                b*x*y + x*z - z
            ];
        },
        start: [2, 0.09, -1],
        time: 50,
        timeStep: 0.01,
        takeEvery: 1,
        angle: [-0.72, 0.63, -2.3],
    },
    noseHoover: {
        equation: function(x, y, z) {
            return [y, y*z - x, 1.5 - y*y];
        },
        start: [0, 1, 0],
        time: 200,
        timeStep: 0.05,
        takeEvery: 1,
        angle: [3, 0.55, 1.47]
    },
    genesioTesi: {
        equation: function(x, y, z) {
            return [y, z, x*x - x - 1.1*y - 0.44*z];
        },
        start: [0, 0.5, 0.2],
        time: 400,
        timeStep: 0.1,
        takeEvery: 1,
        angle: [-0.4, 0.38, 2.3]
    },
    rossler: {
        equation: function(x, y, z) {
            var a = 0.2, b = 0.2, c = 5.7;
            return [-y - z, x + a*y, b + z*(x - c)];
        },
        start: [1, 0, 0],
        time: 70,
        timeStep: 0.05,
        takeEvery: 1,
        angle: [0, 0, 0]
    },
    aizawa: {
        equation: function(x, y, z) {
            var e = 0.25, a = 0.95, l = 0.6, d = 3.5, b = 0.7, c = 0.1;
            return [
                (z - b)*x - d*y,
                d*x + (z - b)*y,
                l + a*z - z*z*z/3-(x*x+y*y)*(1+e*z)+c*z*x*x*x
            ]
        },
        start: [0.1, 0.1, 0.2],
        time: 100,
        timeStep: 0.02,
        takeEvery: 1,
        angle: [0.6, 0.8, -0.1]
    },
    thomas: {
        equation: function(x, y, z) {
            var b = 0.15;
            return [
                Math.sin(y) - b*x,
                Math.sin(z) - b*y,
                Math.sin(x) - b*z
            ];
        },
        start: [2.5, 2.53, 2.375],
        time: 600,
        timeStep: 0.1,
        takeEvery: 1,
        angle: [-1, 0, -2.3]
    }
};


function AttractorVisualization(args) {
    this.attractor = args.attractor;
    this.width = args.width;
    this.height = args.height;
    this.autorotate = args.autorotate;
    this.renderer = this.createRenderer(this.width, this.height);
    this.camera = this.createCamera(this.width / this.height);
    this.scene = new THREE.Scene();
    this.addLights(this.scene);
    this.attractorMesh = this.createAttractorMesh(this.attractor);
    this.scene.add(this.attractorMesh);
    this.domElement = this.renderer.domElement;
    this.needsUpdate = true;
    this.textureLoaded = false;
    this.envMapLoaded = false;
    this.addController();
    this.play();
}

AttractorVisualization.prototype.createEnvMap = function(attractor) {
    var envMap = THREE.ImageUtils.loadTextureCube([
      'images/attractor-envmap/pos-x.png',
      'images/attractor-envmap/neg-x.png',
      'images/attractor-envmap/pos-y.png',
      'images/attractor-envmap/neg-y.png',
      'images/attractor-envmap/pos-z.png',
      'images/attractor-envmap/neg-z.png'
    ], undefined, function() {
        this.envMapLoaded = true;
        this.needsUpdate = true;
    }.bind(this));
    envMap.format = THREE.RGBFormat;
    return envMap;
};

AttractorVisualization.prototype.createTexture = function(s, t) {
    var texturePixelsPerUnit = 256 / 40;
    var sPixels = 256;
    var tPixels = 256;
    var sScale = 0.5;
    var tScale = 0.5;

    var sRepeat = s * texturePixelsPerUnit / (sScale * sPixels);
    var tRepeat = t * texturePixelsPerUnit / (tScale * tPixels);
    var texture = THREE.ImageUtils.loadTexture(
        "images/attractor-texture.png", undefined, function() {
            this.textureLoaded = true;
            this.needsUpdate = true;
        }.bind(this)
    );
    texture.repeat.set(sRepeat, tRepeat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.anisotropy = 16;
    return texture;
};

AttractorVisualization.prototype.createMaterial = function(s, t) {
    var texture = this.createTexture(s, t);
    var envMap = this.createEnvMap();
    return new THREE.MeshPhongMaterial({
        bumpMap: texture,
        bumpScale: 0.05,
        color: 0xdddddd,
        specular: 0xffffff,
        shininess: 2,
        shading: THREE.FlatShading,
        envMap: envMap
    });
};

AttractorVisualization.prototype.createAttractorMesh = function(attractor) {
    var scale = 33;
    var radius = 0.8;
    var radiusSegments = 5;

    var vertices = generateAttractorVertices(attractor, scale);
    var path = new THREE.SplineCurve3(vertices);
    var pathLength = path.getLength();
    var geometry = new THREE.TubeGeometry(
        path, vertices.length, radius, radiusSegments, false);
    var material = this.createMaterial(pathLength, radius * radiusSegments);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.set(
        attractor.angle[0],
        attractor.angle[1],
        attractor.angle[2]
    );
    return mesh;
};

AttractorVisualization.prototype.createRenderer = function(width, height) {
    var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(this.width, this.height);
    return renderer;
};

AttractorVisualization.prototype.createCamera = function(aspect) {
    var camera = new THREE.PerspectiveCamera(33, aspect, 1, 350);
    camera.position.set(0, 0, 120);
    return camera;
};

AttractorVisualization.prototype.addLights = function(scene) {
    var light = new THREE.AmbientLight(0x615454);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffee, 0.5);
    light.position.set(1, 2, 5);
    scene.add(light);

    light = new THREE.SpotLight(0xddffff, 1, 50);
    light.position.set(-20, 40, 10);
    scene.add(light);
};

AttractorVisualization.prototype.addBoundingSphere = function(scene) {
    var geometry = new THREE.SphereGeometry(33, 32, 32);
    var material = new THREE.MeshLambertMaterial({
        color: 0x00ffaa,
        transparent: true,
        opacity: 0.5
    });
    scene.add(new THREE.Mesh(geometry, material));
};

AttractorVisualization.prototype.addController = function() {
    var x = 0, y = 0, mousePressed = false;

    this.domElement.addEventListener('mousedown', function(e) {
        this.autorotate = false;
        mousePressed = true;
        x = e.clientX;
        y = e.clientY;
    }.bind(this));

    document.addEventListener('mouseup', function(e) {
        mousePressed = false;
    });

    document.addEventListener('mousemove', function(e) {
        if (mousePressed) {
            this.rotateAttractor(e.clientX - x, e.clientY - y);
            x = e.clientX;
            y = e.clientY;
        }
    }.bind(this));
};

AttractorVisualization.prototype.rotateAttractor = function(dx, dy) {
    var axis = new THREE.Vector3(dy, dx, 0);
    var distance = axis.length();
    axis = this.attractorMesh.worldToLocal(axis).normalize();
    this.attractorMesh.rotateOnAxis(axis, 0.01 * distance);
    this.needsUpdate = true;
};

AttractorVisualization.prototype.play = function() {
    var animate = function() {
        requestAnimationFrame(animate);
        if (this.autorotate) {
            this.rotateAttractor(-1, 0);
        }
        if (this.needsUpdate && this.textureLoaded && this.envMapLoaded) {
            this.needsUpdate = false;
            this.renderer.render(this.scene, this.camera);
        }
    }.bind(this);

    animate();
};

AttractorVisualization.renderComponent = function(elem) {
    var type = elem.getAttribute('type');
    var width = +elem.getAttribute('width');
    var height = +elem.getAttribute('height');
    var autorotate = elem.hasAttribute('autorotate');

    var visualization = new AttractorVisualization({
        attractor: AttractorTypes[type],
        width: width * 2,
        height: height * 2,
        autorotate: autorotate
    });

    visualization.domElement.style.display = 'block';
    visualization.domElement.style.width = width + 'px';
    visualization.domElement.style.height = height + 'px';
    elem.style.cursor = 'move';
    elem.style.display = 'block';
    elem.style.width = width + 'px';
    elem.style.height = height + 'px';
    elem.appendChild(visualization.domElement);
};

AttractorVisualization.renderComponentsOnLoad = function() {
    document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('strange-attractor');
        for (var i = 0; i < elems.length; i++) {
            AttractorVisualization.renderComponent(elems[i]);
        }
    });
};

AttractorVisualization.renderComponentsOnLoad();
