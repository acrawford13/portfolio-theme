/*jshint esversion: 6 */

// requestAnimationFrame polyfill
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
})();

/**
 * Creates a new Grid 
 * @class
 * @param {Object} opts - options object
 * @param {string} opts.id - grid canvas id
 * @param {string} opts.class - grid canvas class
 * @param {number} opts.height - grid canvas height
 * @param {boolean} opts.showGrid - show/hide dot grid
 * @param {number} opts.pixDensity - grid pixel density
 * @param {number} opts.angle - initial dot angle
 * @param {number} opts.dotRadius - dot radius
 * @param {string} opts.dotColor - dot color
 * @param {number} opts.dotLineWidth - dot line width
 * @param {number} opts.spacing - dot spacing
 * @param {number} opts.lineLength - grid line length
 * 
 */
class Grid {
    constructor(opts) {
        this.id = opts.id;
        this.class = opts.class;
        this.height = opts.height;
        this.showGrid = opts.showGrid;
        this.pixDensity = opts.pixDensity || 2;
        this.angle = opts.angle || Math.PI/10;
        this.dotRadius = (opts.dotRadius || 0.5) * this.pixDensity;
        this.dotColor = opts.dotColor || '#787878';
        this.dotLineWidth = opts.dotLineWidth || 1;
        this.spacing = (opts.spacing || 30) * this.pixDensity;
        this.lineLength = (opts.lineLength || 10) * this.pixDensity;

        // array of shapes on grid
        this.shapes = [];
        // array of breakpoints
        this.breakpoints = [];
        this.currentBreakpoint = 0;
        // initial mouse position
        this.mouseX = 0;
        this.mouseY = 0;
        // canvas context
        this.element = null;
        this.context = null;
        // initialise canvas
        this.init();
    }

    init(){
        // create canvas element
        const canvas = $('<canvas></canvas>');
        canvas.attr('id',this.id);
        canvas.css({'width':'100%'});
        canvas.addClass(this.class);

        // add to body
        $('body').prepend(canvas);

        // store references to element and context
        this.element = document.getElementById(this.id);
        this.context = this.element.getContext('2d');

        // fit canvas to window
        this.resize();

        // draw grid
        this.drawGrid();

        const self = this;
        document.addEventListener('touchmove', function(e){
            self.mouseX = e.changedTouches[0].clientX*self.pixDensity;
            self.mouseY = e.changedTouches[0].clientY*self.pixDensity;
            self.drawGrid();
        });

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
    
    /**
     * Takes a pixel value x and returns its location on the grid
     * @param {number} x
     * @returns {number}
     */
    scale(x){
        return Math.floor((x*this.pixDensity)/this.spacing);
    }

    makeBreakpoints(){
        // make breakpoints from grid instance's breakpoints array
        // loop through breakpoints in breakpoints array
        this.breakpoints.forEach((breakpoint)=>{
            // if looped breakpoint size is smaller than canvas size
            if(breakpoint.size < this.width/this.pixDensity){
                // set as current breakpoint
                this.currentBreakpoint = breakpoint.size;
                // and use this breakpoint's shapes
                this.shapes = breakpoint.shapes;
            } else {
                return;
            }
        });
    }

    /**
     * Adds new breakpoint object to breakpoints array
     * @param {Instance.<Breakpoint>} breakpoint 
     */
    addBreakpoint(breakpoint){
        this.breakpoints.push(breakpoint);
        // re-sort breakpoints in ascending order of size
        this.breakpoints = this.breakpoints.sort(function(a,b){return a.size - b.size;});
        this.makeBreakpoints();
    }

    /** 
     * Draw the grid
     */
    drawGrid() {
        const canvas = this.context;
        const canvasHeight = this.height;
        const canvasWidth = this.width;

        // clear entire canvas
        canvas.clearRect(0, 0, canvasWidth, canvasHeight);

        // establish location of first point
        const start = {
            x: (this.width - (Math.floor(this.width/this.spacing) * this.spacing))/2
        };

        if(this.showGrid){
            // loop through dots from left to right
            for(let x = start.x; x < (canvasWidth + this.spacing); x += this.spacing) {
                // loop through dots from top to bottom
                for(let y = 0; y < (canvasHeight + this.spacing); y += this.spacing){
                    this.angle = Math.atan2(y - this.mouseY, x - this.mouseX);
                    canvas.beginPath();
                    // create dot
                    canvas.arc(
                        x-(this.lineLength*Math.cos(this.angle)),
                        y-(this.lineLength*Math.sin(this.angle)),
                        this.dotRadius, 0, Math.PI*2);

                    canvas.lineWidth = this.dotLineWidth;
                    canvas.strokeStyle = this.dotColor;
                    canvas.stroke();
                }
            }
        }

        // draw shapes
        this.shapes.forEach((shape)=>{
            // for each shape in shapes array
            // create empty path array
            var shapePath = [];

            shape.corners.forEach((corner)=>{
                // calculate dynamic points based on canvas dimensions
                corner = corner.calc(this);

                // calculate points based on mouse position
                shapePath.push(
                    {
                        x: ((start.x+corner.x*this.spacing)-(this.lineLength*Math.cos(Math.atan2((corner.y*this.spacing)-this.mouseY,(corner.x*this.spacing)-this.mouseX)))),
                        y: ((corner.y*this.spacing)-(this.lineLength*Math.sin(Math.atan2((corner.y*this.spacing)-this.mouseY,(corner.x*this.spacing)-this.mouseX))))
                    });
            });

            canvas.fillStyle = shape.color;
            
            // draw shape path
            canvas.beginPath();
            shapePath.forEach((point, index)=>{
                if(index === 0){
                    canvas.moveTo(point.x, point.y);
                } else {
                    canvas.lineTo(point.x, point.y);
                }
            });
            canvas.closePath();
            canvas.fill();

        });
    }
}

/**
 * Creates a new Shape to be added to a Breakpoint 
 * @class Shape
 * @param {Object} opts - options object
 * @param {Array} opts.corners - array of corner points
 * @param {string} opts.color - shape color
 */

class Shape {
    constructor(opts) {
        this.corners = opts.corners;
        this.color = opts.color;
        for (var key in opts){
            this[key] = opts[key];
        }
    }
}

/**
 * Creates a new Breakpoint to be added to a Grid 
 * @class
 * @param {number} size - breakpoint size
 */

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

/**
 * Creates a new Point to be used within a Shape
 * @class
 */

class Point {
    constructor(opts){
        this.x = opts.x;
        this.y = opts.y;
    }

    calc(){
        return this;
    }
}

/**
 * Creates a new Dynamic Point to be used within a Shape
 * @class
 * @extends Point
 */

class DynamicPoint extends Point {
    constructor(opts) {
        super(opts);
    }

    calc(canvas){
        let calculatedVal = {x: this.x, y: this.y};
        if(typeof(this.x)==='object'){
            calculatedVal.x = canvas.scale(this.x.perc * canvas.width/canvas.pixDensity) + this.x.offset;
        }

        if(typeof(this.y)==='object'){
            calculatedVal.y = canvas.scale(this.y.perc * canvas.height/canvas.pixDensity) + this.y.offset;
        }

        return calculatedVal;
    }
}

/**
 * Creates a new Logo Grid
 * @class
 * @extends Grid
 */

class Logo extends Grid {
    constructor(opts) {
        super(opts);
        this.height = opts.height * this.pixDensity;

        var randomPoint = function(){
            return new DynamicPoint({perc: Math.random()/2, offset: 0}, Math.round(Math.random()*6)-1);
        };

        for(var i=0;i<6;i++){
            this.shapes.push(new Shape({'corners':[randomPoint(), randomPoint(), randomPoint()],'color':'rgba(0,0,0,0.5)'}));
        }
    }

    resize(){
        this.width = window.innerWidth*this.pixDensity;
        this.element.width = this.width;
        this.element.height = this.height;
    }
}


/**
 * Creates a new Background Grid
 * @class
 * @extends Grid
 */

class Background extends Grid {
    constructor(id, spacing, showGrid, fixedHeight, angle, lineLength) {
        super(id, spacing, showGrid, fixedHeight, angle, lineLength);
    }

    resize(){
        this.width = window.innerWidth * this.pixDensity;
        this.height = window.innerHeight * this.pixDensity;
        this.element.width = this.width;
        this.element.height = this.height;
        this.makeBreakpoints();
    }
}