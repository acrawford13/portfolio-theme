var logo = new Logo({id: 'logo-canvas', height: 140, showGrid: false});
var bg = new Background({id: 'canvas', showGrid: true});
var nameBox = new Shape({
    corners: [
        [0,1],[0,4],[10,4],[10,1]
    ],
    color: 'rgba(255,0,0,0.8)',
});


var mobile = new Breakpoint(0);
var medium = new Breakpoint(640);
var full = new Breakpoint(1024);
bg.addBreakpoint(full);
bg.addBreakpoint(medium);
bg.addBreakpoint(mobile);

full.addShape(nameBox);
medium.addShape(
    new Shape({
        corners: [
            [0,1],[0,4],[6,4],[6,1]
        ],
        color: 'rgba(255,0,0,0.8)',
    })
);

for(var i=0;i<6;i++){
    var random = function(){return Math.floor(Math.random()*7)};
    full.addShape({'corners':[[random(),random()],[random(),random()],[random(),random()]],'color':'rgba(0,0,0,0.5)'});
}

bg.drawGrid();
