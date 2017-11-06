window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

class Grid {
    constructor(id, size, angle, lineLength) {
        this.id = id;
        this.shapes = [];
        this.breakpoints = [];
        this.currentBreakpoint = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.pixDensity = 2;
        this.size = size*this.pixDensity || 30*this.pixDensity;
        this.angle = angle || Math.PI/10;
        this.lineLength = lineLength*this.pixDensity || 10*this.pixDensity;
        this.init();
    }

    init() {
        var canvas = document.createElement('canvas');
        canvas.id = this.id;
        canvas.style = "height: 100%";
        document.getElementsByTagName('body')[0].prepend(canvas);
        this.element = document.getElementById(this.id);
        this.context = this.element.getContext('2d');
        this.resize();
        this.drawGrid();
        var self = this;
        document.addEventListener('mousemove', function(e){
            self.mouseX = e.clientX*self.pixDensity;
            self.mouseY = e.clientY*self.pixDensity;
            self.drawGrid();
        });
        window.addEventListener('resize', function(e){
            self.resize();
            self.drawGrid();
        });
    }

    makeBreakpoints(){
        for(var i=0; i<this.breakpoints.length; i++){
            if(this.breakpoints[i].size < this.width/this.pixDensity){
                this.currentBreakpoint = this.breakpoints[i].size;
                this.shapes = this.breakpoints[i].shapes;
            } else {
                return;
            }
        }
    }

    resize(){
        this.width = window.innerWidth*2;
        this.height = window.innerHeight*2;
        this.element.width = this.width;
        this.element.height = this.height;
        this.makeBreakpoints();
    }

    scale(x){
        return Math.floor((x*this.pixDensity)/this.size);
    }

    calc(object){
        if (typeof(object) === 'object'){
            return this.scale(object.perc * this[object.dimension]/this.pixDensity) + object.offset;
        }
        return object;
    }

    addBreakpoint(settings){
        var object = {};
        for(var key in settings){
            object[key] = settings[key];
        }
        this.breakpoints.push(object);
        this.breakpoints = this.breakpoints.sort(function(a,b){return a.size - b.size});
        this.makeBreakpoints();
    }

    drawGrid() {
        var c = this.context;
        var ch = this.height;
        var cw = this.width;

        c.clearRect(0,0,cw,ch);
        var start = {
            x: (this.width - (Math.floor(this.width/this.size) * this.size))/2
        };

        for(var i=start.x; i<cw+this.size; i+=this.size) {
            for(var j=0;j<ch+this.size;j+=this.size){
                this.angle=Math.atan2(j-this.mouseY,i-this.mouseX);
                c.beginPath();
                c.arc(i-(this.lineLength*Math.cos(this.angle)),j-(this.lineLength*Math.sin(this.angle)),0.75,0,Math.PI*2);
                //support ie:
                var ij = Math.sqrt(Math.pow(i-this.mouseX,2),Math.pow(j-this.mouseY,2));
                //support ie:
                var cwch = Math.sqrt(Math.pow(cw,2),Math.pow(ch,2));
                var fade = Math.floor(255-(255/(cwch/ij)));
                var opacityFade = 1-(ij/(cwch*2));
                c.lineWidth=1;
                c.strokeStyle="rgba(120,120,120,"+1+")";
                c.stroke();
            }
        }

        // draw shapes

        for(var k=0; k<this.shapes.length; k++){
            var secPath = [];
            for(var l=0;l<this.shapes[k].corners.length;l++){
                var shape = this.shapes[k];
                var corners = [this.calc(shape.corners[l][0]), this.calc(shape.corners[l][1])];
                secPath.push([((start.x+corners[0]*this.size)-(this.lineLength*Math.cos(Math.atan2((corners[1]*this.size)-this.mouseY,(corners[0]*this.size)-this.mouseX)))),((corners[1]*this.size)-(this.lineLength*Math.sin(Math.atan2((corners[1]*this.size)-this.mouseY,(corners[0]*this.size)-this.mouseX))))]);
            }

            c.fillStyle=shape.color;
            c.beginPath();
            c.moveTo(secPath[0][0],secPath[0][1]);

            for (var m=1; m<secPath.length; m++) {
              c.lineTo(secPath[m][0],secPath[m][1]);
            }

            c.closePath();
            c.fill();
        }
    }
}

class Shape {
    constructor(settings) {
        for (var key in settings){
            this[key] = settings[key];
        }
    }
}

class Breakpoint {
    constructor(size){
        this.size = size;
        this.shapes = [];
    }

    addShape(shape){
        this.shapes.push(shape);
    }

    removeShapes(){
        this.shapes = [];
    }
}