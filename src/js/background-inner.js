var bg = new Grid('canvas', centre=false);
var nameBox = new Shape({
    corners: [
        [0,1],[0,4],[10,4],[10,1]
    ],
    color: 'rgba(255,0,0,0.8)',
});
bg.addShape(nameBox);

for(var i=0;i<6;i++){
    var random = function(){return Math.floor(Math.random()*7)};
    bg.addShape({'corners':[[random(),random()],[random(),random()],[random(),random()]],'color':'rgba(0,0,0,0.5)'});
}
