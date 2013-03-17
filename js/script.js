
var displayWidth = 800;
var displayHeight = 600;

var nodes = [
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 10
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 10
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 10
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 10
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 10
    },
    {
        x: 0,
        y: 0,
        velocityX: 0,
        velocityY: 0,
        radius: 10
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

    //gameloop
    this.intervalId = setInterval(function() {
        update();
        render();
    }, 1000 / 60);
});

function update() {
    // calculate force between nodes
    $.each(nodes, function(index) {
        $.each(nodes, function(index2) {
            if (index != index2) {
                var dX = nodes[index].x - nodes[index2].x;
                var dY = nodes[index].y - nodes[index2].y;
                var distance = Math.sqrt(dX * dX + dY * dY);

                // attract
                var attractFactor = 0.01;
                nodes[index].velocityX += -dX * attractFactor;
                nodes[index].velocityY += -dY * attractFactor;
                nodes[index2].velocityX += dX * attractFactor;
                nodes[index2].velocityY += dY * attractFactor;

                // disperse
                nodes[index].velocityX += dX / distance;
                nodes[index].velocityY += dY / distance;
                nodes[index2].velocityX += -dX / distance;
                nodes[index2].velocityY += -dY / distance;
            }
        });
    });

    // basis node movement
    $.each(nodes, function(index) {
        // add velocity to position
        nodes[index].x += nodes[index].velocityX;
        nodes[index].y += nodes[index].velocityY;

        // damping
        nodes[index].velocityX *= 0.9;
        nodes[index].velocityY *= 0.9;

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

        // attract to middle of display
        var dX = nodes[index].x - displayWidth / 2;
        var dY = nodes[index].y - displayHeight / 2;
        var distance = Math.sqrt(dX * dX + dY * dY);

        nodes[index].velocityX -= dX / (10 * distance);
        nodes[index].velocityY -= dY / (10 * distance);
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

        console.log(x1);

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