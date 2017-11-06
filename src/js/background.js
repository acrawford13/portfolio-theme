var bg = new Grid('canvas');
var nameBox = new Shape({
    corners: [
        [0, {perc: 0.5, offset: -4, dimension: 'height'}],
        [0, {perc: 0.5, offset: 0, dimension: 'height'}],
        [bg.scale(600), {perc: 0.5, offset: 0, dimension: 'height'}],
        [bg.scale(600), {perc: 0.5, offset: -4, dimension: 'height'}],
    ],
    color: 'rgba(255,0,0,0.8)',
});
bg.addShape(nameBox);

for(var i=0;i<6;i++){
    var random = function(){return Math.floor(Math.random()*24)};
    bg.addShape({'corners':[[random(),random()],[random(),random()],[random(),random()]],'color':'rgba(0,0,0,0.5)'});
}
