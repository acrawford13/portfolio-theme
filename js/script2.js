window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

var cw = window.innerWidth;
var ch = window.innerHeight;

var mouseX = 0;
var mouseY = 0;

canvas.width = cw;
canvas.height = ch;

//var gapSize = 20;
var gapSize = 30;
//var lineLength = gapSize/3;
var lineLength = 10;
var angle = Math.PI/10;

var ix = 403;
var iy = 500;

var lineArray;

c.beginPath();
c.arc(ix,iy,4,0,Math.PI*2);
c.stroke();


var gridH = Math.floor((ch)/gapSize);
var gridW = Math.floor((cw)/gapSize);
var hd = Math.floor(gridH/2);
var nameRect = {'corners':[[1,hd-4],[1,hd],[20,hd],[20,hd-4]],'color':'rgba(255,0,0,0.8)'};
var shapeArray = [nameRect];
var fadeClick = 1;

/*var gR = function(){
    return Math.floor((Math.random()*gridW*2)-(gridW/2));
};*/

var gR = function(howrandom){
    return Math.floor(Math.random()*howrandom);
};

var rCol = function(rfloor,rceil,gfloor,gceil,bfloor,bceil,ofloor,oceil){
    return "rgba("+(rfloor+(Math.floor(Math.random()*(rceil-rfloor))))+","+(gfloor+(Math.floor(Math.random()*(gceil-gfloor))))+","+(bfloor+(Math.floor(Math.random()*(bceil-bfloor))))+","+(ofloor+(Math.random()*(oceil-ofloor)))+")";
}


var mR = function(quant,random){
  for(var i=0;i<quant;i++){
    shapeArray.push({'corners':[[gR(random),gR(random)],[gR(random),gR(random)],[gR(random),gR(random)]],'color':rCol(0,0,0,0,0,0,0.3,0.7)});
  }
};

var othR = function(quant,areaMin,areaMax){
  for(var i=0;i<quant;i++){
    shapeArray.push({'corners':[[(gR(areaMax-areaMin))+areaMin,(gR(areaMax-areaMin))+areaMin],[(gR(areaMax-areaMin))+areaMin,(gR(areaMax-areaMin))+areaMin],[(gR(areaMax-areaMin))+areaMin,(gR(areaMax-areaMin))+areaMin]],'color':rCol(250,255,0,0,0,0,0.3,0.7)});
  }
};

var canvasMove = function(){
    shapeArray=[];
    fadeClick=0.2;
    $('.name').addClass('dark');
    $('#menu').addClass('dark');
    shapeArray.push({'corners':[[gridW+1,-1],[gridW-5,-1],[gridW-5,gridH+1],[gridW+1,gridH+1]],'color':'rgba(255,10,16,0.6)'});
    shapeArray.push({'corners':[[4,hd],[2,hd+2],[4,hd+4]],'color':'rgba(255,42,30,0.9)'});
    shapeArray.push({'corners':[[gridW-4,hd],[gridW-2,hd+2],[gridW-4,hd+4]],'color':'rgba(255,255,255,0.9)'});
    //shapeArray.push({'corners':[[Math.floor(Math.random()*gridW),Math.floor(Math.random()*gridW)],[Math.floor(Math.random()*gridW),Math.floor(Math.random()*gridW)],[Math.floor(Math.random()*gridW),Math.floor(Math.random()*gridW)]],'color':'rgba(253,'+Math.floor(Math.random()*255)+',19,0.4)'});
};



var makeCircles = function(){
        c.clearRect(0,0,cw,ch);


    for(var i=0; i<cw+gapSize; i+=gapSize) {
        for(var j=0;j<ch+gapSize;j+=gapSize){
        angle=Math.atan2(j-mouseY,i-mouseX);
        c.beginPath();
        c.arc(i-(lineLength*Math.cos(angle)),j-(lineLength*Math.sin(angle)),0.25,0,Math.PI*2);
        //var ij = Math.hypot(i-mouseX,j-mouseY);
        //support ie:
        var ij = Math.sqrt(Math.pow(i-mouseX,2),Math.pow(j-mouseY,2));
        //var cwch = Math.hypot(cw,ch);
        //support ie:
        var cwch = Math.sqrt(Math.pow(cw,2),Math.pow(ch,2));
        var fade = Math.floor(255-(255/(cwch/ij)));
        var opacityFade = 1-(ij/(cwch*2));
        if(cw<=1120){var tabletFade = 1-j/ch;}else{var tabletFade = 1};
        c.lineWidth=0.5;
        c.strokeStyle="rgba(120,120,120,"+opacityFade*tabletFade+")"
        c.stroke();
        }
    }


        for(var k=0;k<shapeArray.length;k++){
            //var goodPath = new Path2D();
            var secPath = [];
            for(var l=0;l<shapeArray[k].corners.length;l++){
            /*goodPath.lineTo((shapeArray[k].corners[l][0]*gapSize)-(lineLength*Math.cos(Math.atan2((shapeArray[k].corners[l][1]*gapSize)-mouseY,(shapeArray[k].corners[l][0]*gapSize)-mouseX))),(shapeArray[k].corners[l][1]*gapSize)-(lineLength*Math.sin(Math.atan2((shapeArray[k].corners[l][1]*gapSize)-mouseY,(shapeArray[k].corners[l][0]*gapSize)-mouseX))));*/
            secPath.push([((shapeArray[k].corners[l][0]*gapSize)-(lineLength*Math.cos(Math.atan2((shapeArray[k].corners[l][1]*gapSize)-mouseY,(shapeArray[k].corners[l][0]*gapSize)-mouseX)))),((shapeArray[k].corners[l][1]*gapSize)-(lineLength*Math.sin(Math.atan2((shapeArray[k].corners[l][1]*gapSize)-mouseY,(shapeArray[k].corners[l][0]*gapSize)-mouseX))))]);
            }
    c.lineWidth=1;
    c.fillStyle=shapeArray[k].color;
    //c.fill(goodPath);
    c.beginPath();
    c.moveTo(secPath[0][0],secPath[0][1]);
    for (var m=1;m<secPath.length;m++) {
      c.lineTo(secPath[m][0],secPath[m][1]);
    }
    c.closePath();
    c.fill();

        }

}

var contact = function(){
  shapeArray=[];
   //$('#content').scrollTop(300);
    shapeArray.push({'corners':[[0,1],[0,4],[10,4],[10,1]],'color':'rgba(255,0,0,0.8)'});
    mR(5,7);
    //$('.name').addClass('min');
    //$('#menu').addClass('min');
    makeCircles();
    //$('#content').show();
};

//$('#content').css({'margin-top':ch});
var filtermenu = $('#selectmenu2');
var checks = function(){
    if(filtermenu.find('input[type=radio]:checked').length==0||filtermenu.find('input[type=radio]:checked')[0].id=='all'){
        $('.folio-piece').show()

    } else {
        var keep = filtermenu.find('input[type=radio]:checked');
        $('.folio-piece').hide();
        for(var i=0;i<keep.length;i++){
            var show = (keep[i].id);
            $('.'+show).show();
        };
    }
    $('html, body').animate({scrollTop:0});
};


var init = function(){

    fadeClick = 1;
    shapeArray = [nameRect];
    mR(6,24);
    $('.dark').removeClass('dark');
    $('.min').removeClass('min');
    makeCircles();
    $('#content').hide();
};

//$('#folio-thumbs').height(ch/1.25);
contact();


	$("#filter").click(function(){
  if ($(this).parent('.open').length>0) {
    $(this).parent('.open').removeClass('open');
  } else {
    $(this).parent().addClass('open');
  }
    });

    filtermenu.find("input").change(function(){
        checks();
        $('li.checked').removeClass('checked');
        $(this).parents('li').addClass('checked');
    });


$(document).scroll(function(){
  filtermenu.removeClass('open');
});


var evenSpan = function(classSelect){
var selectedArray = document.getElementsByClassName(classSelect);
for(var i=0; i<selectedArray.length; i++){
    var span = selectedArray[i];
    var oldWidth = selectedArray[i].getBoundingClientRect().width;
    var newWidth = Math.ceil(oldWidth/gapSize)*gapSize;
    console.log(oldWidth + "//" + newWidth);
    span.style.width = newWidth-20 + 'px';
}
}

evenSpan('blockySpan');

evenSpan('blockySpanx');

document.onmousemove = (function(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    //makeArrows();
    //makeLittleArrows();
    //makeCircles();
    //makePlusSigns();
    makeCircles();
});

$(window).resize(function(){
cw = window.innerWidth;
ch = window.innerHeight;
canvas.width = cw;
canvas.height = ch;
makeCircles();
});
