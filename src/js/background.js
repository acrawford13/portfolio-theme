/*jshint esversion: 6 */

var bg = new Background({id: 'canvas', showGrid: true});

const randomPoint = function(range){
    return new Point({x: Math.floor(Math.random()*range.x), y: Math.floor(Math.random()*range.y)});
};

var nameBox = new Shape({
    corners: [
        new DynamicPoint({x: 0, y: {perc: 0.5, offset: -4}}),
        new DynamicPoint({x: 0, y: {perc: 0.5, offset: 0}}),
        new DynamicPoint({x: bg.scale(600), y: {perc: 0.5, offset: 0}}),
        new DynamicPoint({x: bg.scale(600), y: {perc: 0.5, offset: -4}}),
    ],
    color: 'rgba(255,0,0,0.8)',
});

var mobile = new Breakpoint(0);
var full = new Breakpoint(480);
bg.addBreakpoint(full);
bg.addBreakpoint(mobile);

var nameBoxMobile = new Shape({
    corners: [
        new DynamicPoint({x: 0, y: {perc: 0.5, offset: -4}}),
        new DynamicPoint({x: 0, y: {perc: 0.5, offset: 0}}),
        new DynamicPoint({x: {perc: 1, offset: 0}, y: {perc: 0.5, offset: 0}}),
        new DynamicPoint({x: {perc: 1, offset: 0}, y: {perc: 0.5, offset: -4}}),
    ],
    color: 'rgba(255,0,0,0.8)',
});

mobile.addShape(nameBoxMobile);
full.addShape(nameBox);

for(var i=0;i<6;i++){
    full.addShape({'corners':[
        randomPoint({x: 24, y: 24}),
        randomPoint({x: 24, y: 24}),
        randomPoint({x: 24, y: 24})],'color':'rgba(0,0,0,0.5)'});
}

var randomPointMobile = function(){
    return new DynamicPoint({x: {perc: Math.random(), offset: 0}, y: {perc: Math.random()/2 + 0.2, offset: 0}});
};

for(var i=0;i<6;i++){
    mobile.addShape({'corners':[randomPointMobile(), randomPointMobile(), randomPointMobile()],'color':'rgba(0,0,0,0.5)'});
}

bg.drawGrid();
