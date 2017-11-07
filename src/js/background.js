var bg = new Background({id: 'canvas', showGrid: true});

var nameBox = new Shape({
    corners: [
        [0, {perc: 0.5, offset: -4, dimension: 'height'}],
        [0, {perc: 0.5, offset: 0, dimension: 'height'}],
        [bg.scale(600), {perc: 0.5, offset: 0, dimension: 'height'}],
        [bg.scale(600), {perc: 0.5, offset: -4, dimension: 'height'}],
    ],
    color: 'rgba(255,0,0,0.8)',
});

var mobile = new Breakpoint(0);
var full = new Breakpoint(480);
bg.addBreakpoint(full);
bg.addBreakpoint(mobile);

var nameBoxMobile = new Shape({
    corners: [
        [0, {perc: 0.5, offset: -4, dimension: 'height'}],
        [0, {perc: 0.5, offset: 0, dimension: 'height'}],
        [{perc: 1, offset: 0, dimension: 'width'}, {perc: 0.5, offset: 0, dimension: 'height'}],
        [{perc: 1, offset: 0, dimension: 'width'}, {perc: 0.5, offset: -4, dimension: 'height'}],
    ],
    color: 'rgba(255,0,0,0.8)',
});

mobile.addShape(nameBoxMobile);
full.addShape(nameBox);

for(var i=0;i<6;i++){
    var random = function(){return Math.floor(Math.random()*24)};
    full.addShape({'corners':[[random(),random()],[random(),random()],[random(),random()]],'color':'rgba(0,0,0,0.5)'});
}

for(var i=0;i<6;i++){
    var randomPoint = function(){
        return [{perc: Math.random(), offset: 0, dimension: 'width'}, {perc: Math.random()/2 + 0.2, offset: 0, dimension: 'height'}]
    };
    mobile.addShape({'corners':[randomPoint(), randomPoint(), randomPoint()],'color':'rgba(0,0,0,0.5)'});
}

bg.drawGrid();
