/*jshint esversion: 6 */

var logo = new Logo({id: 'logo-canvas', height: 140, showGrid: false});
var bg = new Background({id: 'canvas', showGrid: true});
var nameBox = new Shape({
    corners: [
        new Point({x: 0, y: 1}),
        new Point({x: 0, y: 4}),
        new Point({x: 10, y: 4}),
        new Point({x: 10, y: 1})
    ],
    color: 'rgba(255,0,0,0.8)',
});

var mobile = new Breakpoint(0);
var medium = new Breakpoint(800);
var full = new Breakpoint(1200);
bg.addBreakpoint(full);
bg.addBreakpoint(medium);
bg.addBreakpoint(mobile);

full.addShape(nameBox);


medium.addShape(
    new Shape({
        corners: [
            new Point({x: 0, y: 1}),
            new Point({x: 0, y: 4}),
            new Point({x: 6, y: 4}),
            new Point({x: 6, y: 1})
        ],
        color: 'rgba(255,0,0,0.8)',
    })
);

const randomPoint = function(range){
    return new Point({x: Math.floor(Math.random()*range.x), y: Math.floor(Math.random()*range.y)});
};

for(var i=0;i<6;i++){
    full.addShape({'corners':[
        randomPoint({x: 7, y: 7}),
        randomPoint({x: 7, y: 7}),
        randomPoint({x: 7, y: 7})],'color':'rgba(0,0,0,0.5)'});
}

bg.drawGrid();
