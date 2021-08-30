// VARS ############################################################################

class Dot {
    constructor (color) {
        this.DOM = '';
        this.ct = '';
        this.x = 0;
        this.y = 0;
        this.size = 50;
        this.color = color;
        this.selected = false;
        this.speed = 8;
    }
    setPosition (x,y) { // requires DOM
        this.DOM.style.top = `${y-this.size/2}px`; this.y = y;
        this.DOM.style.left = `${x-this.size/2}px`; this.x = x;
    }
    move (vec) {
        let mod = (vec[0]**2 + vec[1]**2)**(0.5); let uni = [(vec[0]/mod),(vec[1]/mod)]; 
        this.setPosition(this.x + uni[0]*this.speed, this.y - uni[1]*this.speed);
    }
    collides () {
        if (this.ct.className.includes ('collides') == false) {
            this.ct.classList.add ('collide');
            console.log ('adds collision');
        }
    }
    notCollides () {
        if (this.ct.className.includes ('collide')) {
            this.ct.classList.remove ('collide');
        }
    }
    startDOM (x,y) {
        let newDot = document.createElement ('div'); 
        newDot.classList.add ('dot'); 
        newDot.classList.add (`${this.color}D`);
        document.body.appendChild(newDot); 
        let ct = document.createElement ('div'); 
        ct.classList.add ('ct'); 
        this.DOM = newDot; 
        this.DOM.appendChild (ct);
        this.ct = ct;
        this.setPosition(x,y);
    }
    destroyDOM () {
        this.DOM.className = '';
        this.setPosition(0,0);
    }
}

class Line {
    constructor (a,b) {
        this.DOM = '';
        this.a = a; // review <==============
        this.b = b; // review <==============
        this.x1 = a.x;
        this.y1 = a.y;
        this.x2 = b.x;
        this.y2 = b.y;
        this.x = (this.x1 + this.x2)/2;
        this.y = (this.y1 + this.y2)/2;
        this.extension = Math.sqrt(Math.abs(this.x1 - this.x2)**2 + Math.abs(this.y1 - this.y2)**2);
        this.m = (this.y2 - this.y1)/(this.x2 - this.x1);
        this.angle = -angTo (vecTo (this.x1,this.y1,this.x2,this.y2));
    }
    setPosition (x,y) { // requires DOM
        this.DOM.style.top = `${y}px`; this.y = y; // <===== check
        this.DOM.style.left = `${x-this.extension/2}px`; this.x = x;
    }
    setExtension () {
        this.DOM.style.width = `${this.extension}px`;
    }
    setAngle (angle) {
        this.DOM.style.transform = `rotate(${angle}rad)`; this.angle = angle;   
    }
    detectCollision (point) {
        let fun = (x) => {return this.m*(x - this.x1) + this.y1;}
        let cR = 20; // collision Radio <======================
        // if there is collision
        if ((this.x1 < point.x && point.x < this.x2) || (this.x2 < point.x && point.x < this.x1)) {
            let cY = fun(point.x);
            if (inRad(point.x,cY,point.x,point.y,cR)) {
                console.log ('COLLIDE');
                point.collides ();
            } else {
                point.notCollides ();
            }
        }
    }
    startDOM () {
        let newLine = document.createElement ('div'); 
        newLine.classList.add ('line'); 
        document.body.appendChild(newLine); 
        this.DOM = newLine;
        this.setExtension (); 
        this.setPosition(this.x,this.y);
        this.setAngle(this.angle);
    }
    destroyDOM () {
        this.DOM.className = '';
        this.setPosition(0,0);
    }
    reSet () { // execute every iteration
        this.x = (this.a.x + this.b.x)/2;
        this.y = (this.a.y + this.b.y)/2;
        this.x1 = this.a.x;
        this.y1 = this.a.y;
        this.x2 = this.b.x;
        this.y2 = this.b.y;
        this.m = (this.y2 - this.y1)/(this.x2 - this.x1);
        this.extension = Math.sqrt(Math.abs(this.x1 - this.x2)**2 + Math.abs(this.y1 - this.y2)**2);
        this.angle = -angTo (vecTo (this.x1,this.y1,this.x2,this.y2));
        this.setPosition (this.x, this.y);
        this.setExtension ();
        this.setAngle (this.angle);
    }
}

// lines
let dots = [];
let lines = [];

// colors
let colors = ['red','green','blue','yellow','purple'];

// screen center
let mS = {x: window.innerWidth / 2, y: window.innerHeight / 2};
// mouse element 
let mouse = {x: 0, y: 0};

// FUNCTIONS ############################################################################

// check if element is on given radio
let inRad = (cenX, cenY, x, y, r) => {return ((cenX - x)*(cenX - x) + (cenY - y)*(cenY - y) < r*r) ? true : false;}

// get vector from a to b
let vecTo = (fromX, fromY, toX, toY) => {return [toX - fromX, fromY - toY];} // a list <==

// get angle given vector
let angTo = (vector) => {
    if (vector [0] > 0 && vector [1] > 0) {
        // 1 quad + +
        return Math.atan(vector[1]/vector[0]);
    } else if (vector [0] < 0 && vector [1] > 0) {
        // 2 quad - +
        return Math.PI + Math.atan(vector[1]/vector[0]);
    } else if (vector [0] < 0 && vector [1] < 0) {
        // 3 quad - - 
        return Math.PI + Math.atan(vector[1]/vector[0]);
    } else {
        // 4 cuad + -
        return Math.PI*2 + Math.atan(vector[1]/vector[0]);
    }
}; // returns - angles in radians

// EVENTS ############################################################################

// create lines and dots
document.addEventListener ('keyup', (event) => {
    if (event.code == 'KeyP') { // generate new line every time u press P <==============
        let f = Math.floor((Math.random() * 100) + 1); // random factor to choose a color
        let x = Math.floor((Math.random() * 100) + 1); // random factor to place dot.x
        let y = Math.floor((Math.random() * 100) + 1); // random factor to place dot.y
        let c = ''; // color 
        if (f < 20) {c = colors[0];} 
        else if (f < 40) {c = colors[1];}
        else if (f < 60) {c = colors[2];}
        else if (f < 80) {c = colors[3];}
        else {c = colors[4];}
        let nD1 = new Dot (c); // creates new dot 1
        let nD2 = new Dot (c); // creates second dot
        nD1.startDOM (mS.x + x, mS.y + y); nD2.startDOM (mS.x - x, mS.y - y); // initialize both dots
        let nL = new Line (nD1, nD2); // creates new line given those 2 dots
        nL.startDOM ();
        dots.push (nD1); dots.push (nD2); // send dots to a list
        lines.push (nL); // send line to a list
    }
})

// get mouse position 
document.addEventListener('mousemove', (event) => {mouse.x = event.clientX; mouse.y = event.clientY;})

// move dots with mouse
document.addEventListener ('mousedown', (event => {
    if (lines.length > 0) {
        for (let i = 0; i < dots.length; i++) {
            if (inRad(dots[i].x,dots[i].y,mouse.x,mouse.y,25)) {
                dots[i].selected = true;
            }
        }
    }
}))
// drop dots
document.addEventListener('mouseup', (event) => {
    if (lines.length > 0) {
        for (let i = 0; i < dots.length; i++) {
            dots[i].selected = false;
        }
    }
})

// get screen centre always
window.addEventListener ('resize', (event) => {mS = {x: window.innerWidth / 2, y: window.innerHeight / 2};})

// main clock
setInterval (() => {
    // dots control
    if (lines.length > 0) {
        for (let i = 0; i < dots.length; i++) {
            if (dots[i].selected == true) {
                dots[i].setPosition (mouse.x,mouse.y);
            }
        }
    }
    // lines control
    if (lines.length > 0) {
        for (let i = 0; i < lines.length; i++) {
            lines[i].reSet ();
        }
    }
    // detect collisions
    if (lines.length > 0) {
        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < dots.length; j++) {
                if (lines[i].a != dots[j] && lines[i].b != dots[i]) {
                    lines[i].detectCollision (dots[j]);
                }
            }
        }
    }
}, 25) // 40fps