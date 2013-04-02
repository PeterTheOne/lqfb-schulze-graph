
var displayWidth = 1000;
var displayHeight = 700;
var oldTime = undefined;

var nodes = [
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 25
    },
];

var edges = [
    {
        node1: 0,
        node2: 2
    }
];

$(function() {
    // set random starting position
    $.each(nodes, function(index) {
        nodes[index].x = Math.random() * displayWidth;
        nodes[index].y = Math.random() * displayHeight;
    });

    // set requestAnimationFrame
    // see: http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    (function() {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    // start game loop
    oldTime = new Date().getTime();
    gameLoop(oldTime);
});

function gameLoop(time) {
    // calculate deltaTime
    var deltaTime = time - oldTime;

    // debug
    //console.log(deltaTime);

    // do stuff
    update(deltaTime);
    render();

    // safe latest time in oldTime
    oldTime = time;

    // request next frame
    window.requestAnimationFrame(gameLoop);
}

function update(dt) {
    // calculate force between ALL nodes
    $.each(nodes, function(index) {
        $.each(nodes, function(index2) {
            if (index != index2) {
                var dX = nodes[index].x - nodes[index2].x;
                var dY = nodes[index].y - nodes[index2].y;
                var distance = Math.sqrt(dX * dX + dY * dY);

                // attract
                /*var attractFactor = 0.01;
                nodes[index].velocityX += -dX * attractFactor;
                nodes[index].velocityY += -dY * attractFactor;
                nodes[index2].velocityX += dX * attractFactor;
                nodes[index2].velocityY += dY * attractFactor;*/

                // disperse
                nodes[index].velocityX += (4 / (0.5 * nodes.length)) * (dX / (10 * distance));
                nodes[index].velocityY += (4 / (0.5 * nodes.length)) * (dY / (10 * distance));
                nodes[index2].velocityX += (4 / (0.5 * nodes.length)) * (-dX / (10 * distance));
                nodes[index2].velocityY += (4 / (0.5 * nodes.length)) * (-dY / (10 * distance));
            }
        });
    });

    // or only between nodes with edges
    /*$.each(edges, function(index) {
        var node1Index = edges[index].node1;
        var node2Index = edges[index].node2;

        var node1 = nodes[node1Index];
        var node2 = nodes[node2Index];

        var dX = node1.x - node2.x;
        var dY = node1.y - node2.y;
        var distance = Math.sqrt(dX * dX + dY * dY);

        // attract
        var attractFactor = 0.01;
        node1.velocityX += -dX * attractFactor;
        node1.velocityY += -dY * attractFactor;
        node2.velocityX += dX * attractFactor;
        node2.velocityY += dY * attractFactor;

        // disperse
        node1.velocityX += dX / distance;
        node1.velocityY += dY / distance;
        node2.velocityX += -dX / distance;
        node2.velocityY += -dY / distance;
    });*/

    // basis node movement
    $.each(nodes, function(index) {
        // calculate distance from middle
        var dX = nodes[index].x - displayWidth / 2;
        var dY = nodes[index].y - displayHeight / 2;
        var distance = Math.sqrt(dX * dX + dY * dY);

        // attract to middle
        var attractFactor = 0.005;
        nodes[index].velocityX -= dX * attractFactor;
        nodes[index].velocityY -= dY * attractFactor;

        // disperse from middle
        var disperseFactor = 0.5;
        nodes[index].velocityX += (dX / distance) * disperseFactor;
        nodes[index].velocityY += (dY / distance) * disperseFactor;

        // damping
        nodes[index].velocityX *= 0.9;
        nodes[index].velocityY *= 0.9;

        // add velocity to position
        nodes[index].x += nodes[index].velocityX * dt;
        nodes[index].y += nodes[index].velocityY * dt;

        // clamping on edge
        if (nodes[index].x < 0) {
            nodes[index].x = 0;
            nodes[index].velocityX = 0;
        }
        if (nodes[index].y < 0) {
            nodes[index].y = 0;
            nodes[index].velocityY = 0;
        }
        if (nodes[index].x > displayWidth) {
            nodes[index].x = displayWidth;
            nodes[index].velocityX = 0;
        }
        if (nodes[index].y > displayHeight) {
            nodes[index].y = displayHeight;
            nodes[index].velocityY = 0;
        }
    });
}

function render() {
    $('canvas').clearCanvas();

    $.each(nodes, function(index) {
        $('canvas').drawArc({
            strokeStyle: '#000000',
            fillStyle: '#ffffff',
            strokeWidth: 1,
            x: nodes[index].x,
            y: nodes[index].y,
            radius: nodes[index].radius,
            closed: true
        });
    });

    $.each(edges, function(index) {
        var node1Index = edges[index].node1;
        var node2Index = edges[index].node2;

        var node1 = nodes[node1Index];
        var node2 = nodes[node2Index];

        var dX = node1.x - node2.x;
        var dY = node1.y - node2.y;
        var distance = Math.sqrt(dX * dX + dY * dY);
        dX /= distance;
        dY /= distance;

        var x1 = node1.x - dX * node1.radius;
        var y1 = node1.y - dY * node1.radius;
        var x2 = node2.x + dX * node2.radius;
        var y2 = node2.y + dY * node2.radius;

        // draw line
        $('canvas').drawLine({
            strokeStyle: '#000000',
            strokeWidth: 1,
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2
        });
    });
}