// VARS ################################################################################
class Dot {
    constructor () {
        this.DOM = ''; this.ct = '';
        this.x = 0; this.y = 0;
        this.size = 50;
        this.selected = false;
        this.manual = true;
        this.speed = 5; this.vec = [];
        this.collide = false;
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
        if (this.ct.className.includes ('collides') == false) {this.ct.classList.add ('collide');}
    }
    notCollides () {
        if (this.ct.className.includes ('collide')) {this.ct.classList.remove ('collide');}
    }
    startDOM (x,y) {
        let newDot = document.createElement ('div'); 
        newDot.classList.add ('dot'); 
        document.body.appendChild(newDot); 
        let ct = document.createElement ('div'); 
        ct.classList.add ('ct'); 
        this.DOM = newDot; 
        this.DOM.appendChild (ct);
        this.ct = ct;
        this.setPosition(x,y);
    }
    addBuff (buff) {
        let newBuff = document.createElement ('i'); 
        newBuff.classList.add ('fas');
        newBuff.classList.add (buff); 
        this.DOM.appendChild(newBuff); 
        this.DOM.classList.add ('buff');
        this.DOM.classList.add ('buffSpawn');
    }
    destroyDOM () {
        this.DOM.className = '';
        this.setPosition(this.x,0);
        this.ct.className = '';
        this.DOM.remove ();
        this.ct.remove ();
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
        this.lim = '';
        this.x = (this.x1 + this.x2)/2;
        this.y = (this.y1 + this.y2)/2;
        this.extension = Math.sqrt(Math.abs(this.x1 - this.x2)**2 + Math.abs(this.y1 - this.y2)**2) + 10; // +10
        this.side = 10; // new
        this.m = (this.y2 - this.y1)/(this.x2 - this.x1);
        this.angle = -angTo (vecTo (this.x1,this.y1,this.x2,this.y2));
    }
    setPosition (x,y) { // requires DOM
        this.DOM.style.top = `${y-this.side/2}px`; this.y = y; // <===== check
        this.DOM.style.left = `${x-this.extension/2}px`; this.x = x;
    }
    setDimentions () {
        this.DOM.style.width = `${this.extension}px`;
        this.DOM.style.height = `${this.side}px`;
    }
    setAngle (angle) {
        this.DOM.style.transform = `rotate(${angle}rad)`; this.angle = angle;   
    } // <========================= add rotate feature
    detectCollision (point) {
        let fun = (x) => {return this.m*(x - this.x1) + this.y1;}
        let cR = 10; // collision Radio <======================
        // if there is collision
        if ((this.x1 < point.x && point.x < this.x2) || (this.x2 < point.x && point.x < this.x1)) {
            let cY = fun(point.x);
            if (inRad(point.x,cY,point.x,point.y,cR)) {
                // console.log ('COLLIDE');
                point.collides ();
                if (point.collide == false) {
                    // console.log('COLLISION'); <====================
                    point.collide = true;
                    lifes.removeLife ();
                }
            } else {
                point.notCollides ();
            }
        }
    }
    detectBuff (point) {
        let fun = (x) => {return this.m*(x - this.x1) + this.y1;}
        let cR = 20; // collision Radio <======================
        // if there is collision
        if ((this.x1 < point.x && point.x < this.x2) || (this.x2 < point.x && point.x < this.x1)) {
            let cY = fun(point.x);
            if (inRad(point.x,cY,point.x,point.y,cR)) {
                point.destroyDOM ();
                if (point.collide == false) { // expand
                    // console.log('SIZE BUFF');
                    point.collide = true;
                    this.expand ();
                }
            } else {
                point.notCollides ();
            }
        }
    }
    detectLife (point) {
        let fun = (x) => {return this.m*(x - this.x1) + this.y1;}
        let cR = 20; // collision Radio <======================
        // if there is collision
        if ((this.x1 < point.x && point.x < this.x2) || (this.x2 < point.x && point.x < this.x1)) {
            let cY = fun(point.x);
            if (inRad(point.x,cY,point.x,point.y,cR)) {
                // console.log("now???");
                point.destroyDOM ();
                if (point.collide == false && lifeBuffers.length < 5) { // new life
                    // console.log('LIFE BUFF');
                    point.collide = true;
                    lifes.addLife ();
                }
            } else {
                point.notCollides ();
            }
        }
    }
    startDOM (spawn) {
        let newLine = document.createElement ('div'); 
        newLine.classList.add ('block'); // block from line
        newLine.classList.add (spawn); // get spawn animation
        document.body.appendChild(newLine); 
        this.DOM = newLine;
        this.setDimentions (); 
        this.setPosition(this.x,this.y);
        this.setAngle(this.angle);
    }
    destroyDOM () {
        this.DOM.className = '';
        this.setPosition(this.x,0);
        this.a.destroyDOM();
        this.b.destroyDOM();
        this.DOM.remove ();
    }
    reSet () { // execute every iteration
        this.x = (this.a.x + this.b.x)/2;
        this.y = (this.a.y + this.b.y)/2;
        this.x1 = this.a.x; this.y1 = this.a.y;
        this.x2 = this.b.x; this.y2 = this.b.y;
        this.m = (this.y2 - this.y1)/(this.x2 - this.x1);
        this.extension = Math.sqrt(Math.abs(this.x1 - this.x2)**2 + Math.abs(this.y1 - this.y2)**2) + 10;
        this.angle = -angTo (vecTo (this.x1,this.y1,this.x2,this.y2));
        this.setPosition (this.x, this.y); this.setDimentions (); this.setAngle (this.angle);
        if (this.lim != '') {
            this.lim.style.top = `${this.y}px`;
            this.lim.style.left = `${this.x}px`;
        }
    }
    verticalMove (direction) {
        if ((direction == 'up') && (this.y > mS.y - 235)) {
            this.a.move([0,1]);
            this.b.move([0,1]); 
        } else if ((direction == 'down') && (this.y < mS.y + 235)) {
            this.a.move([0,-1]);
            this.b.move([0,-1]);
        }
    }
    horizontalReset () { // do not remove... ???
        if (this.extension <= 150) {
            this.a.x = mS.x - (Math.cos(this.angle)*(this.extension-10))/2; 
            this.b.x = mS.x + (Math.cos(this.angle)*(this.extension-10))/2; 
        }
    }
    rotate (side,speed) {
        if (side == 'left') {  //  && this.extension <= 250
            let f = this.extension - 10;
            let xa = this.x - (Math.cos(this.angle - speed)*f)/2; 
            let ya = this.y - (Math.sin(this.angle - speed)*f)/2; 
            let xb = this.x + (Math.cos(this.angle - speed)*f)/2; 
            let yb = this.y + (Math.sin(this.angle - speed)*f)/2;
            // let extension = Math.sqrt(Math.abs(xa - xb)**2 + Math.abs(ya - yb)**2) + 10;
            this.a.setPosition (xa, ya);
            this.b.setPosition (xb, yb);

        } else if (side == 'right') { //  && this.extension <= 250
            let f = this.extension - 10;
            let xa = this.x - (Math.cos(this.angle + speed)*f)/2; 
            let ya = this.y - (Math.sin(this.angle + speed)*f)/2; 
            let xb = this.x + (Math.cos(this.angle + speed)*f)/2; 
            let yb = this.y + (Math.sin(this.angle + speed)*f)/2;
            // let extension = Math.sqrt(Math.abs(xa - xb)**2 + Math.abs(ya - yb)**2) + 10;
            this.a.setPosition (xa, ya);
            this.b.setPosition (xb, yb);
        }
    }
    expand () {
        let f = this.extension + 20;
        let xa = this.x - (Math.cos(this.angle)*f)/2; 
        let ya = this.y - (Math.sin(this.angle)*f)/2; 
        let xb = this.x + (Math.cos(this.angle)*f)/2; 
        let yb = this.y + (Math.sin(this.angle)*f)/2;
        this.a.setPosition (xa, ya);
        this.b.setPosition (xb, yb);
    }
    // setLimit () {
    //     let lim = document.createElement ('div'); 
    //     lim.classList.add ('lim'); // block from line
    //     // lim.classList.add (spawn); // get spawn animation
    //     this.DOM.appendChild(lim); 
    //     this.lim = lim;
    //     this.lim.style.top = `${this.y}px`;
    //     this.lim.style.left = `${this.x}px`;
    // }
}

// instructions
let instructions = document.getElementById ('instructions');

// screen center
let mS = {x: window.innerWidth / 2, y: window.innerHeight / 2};
//stage
let stage = {
    x: 0, y: 0, DOM: '',
    playerOn: false,
    size: [850,500],
    time: 0,
    over: false,
    setPosition (x,y) { // requires DOM
        stage.DOM.style.top = `${y-stage.size[1]/2}px`; stage.y = y; 
        stage.DOM.style.left = `${x-stage.size[0]/2}px`; stage.x = x;
    },
    startDOM () {
        let dom = document.createElement ('div'); 
        dom.classList.add ('stage'); document.body.appendChild(dom); 
        stage.DOM = dom; stage.setPosition(mS.x,mS.y);
    }
}
let lim = {
    x:0, y:0, size: 400,
    DOM: '',
    setPosition (x,y) { // requires DOM
        lim.DOM.style.top = `${y-lim.size/2}px`; lim.y = y; 
        lim.DOM.style.left = `${x-lim.size/2}px`; lim.x = x;
    },
    startDOM () {
        lim.DOM = document.createElement ('div'); 
        lim.DOM.classList.add ('lim'); // block from line
        // lim.classList.add (spawn); // get spawn animation
        document.body.appendChild(lim.DOM); 
        lim.setPosition (player.x, player.y);
    }
}
// interface
let time = {
    x:0, y:0, size: [250,50],
    DOM: '',
    setPosition (x,y) { // requires DOM
        time.DOM.style.top = `${y-time.size[1]/2}px`; time.y = y; 
        time.DOM.style.left = `${x-time.size[0]/2}px`; time.x = x;
    },
    startDOM () {
        time.DOM = document.createElement ('div'); 
        time.DOM.classList.add ('time'); // block from line
        // lim.classList.add (spawn); // get spawn animation
        document.body.appendChild(time.DOM); 
        time.setPosition (mS.x - 230, mS.y - 220);
        time.DOM.innerText = '[ TIME: ]';
    },
    setTime (t) {
        time.DOM.innerText = ` [ Time: ${t} ]`;
    }
}
let lifes = {
    x:0, y:0, size: [250,50],
    DOM: '', num: [],
    setPosition (x,y) { // requires DOM
        lifes.DOM.style.top = `${y-lifes.size[1]/2}px`; lifes.y = y; 
        lifes.DOM.style.left = `${x-lifes.size[0]/2}px`; lifes.x = x;
    },
    startDOM () {
        lifes.DOM = document.createElement ('div'); 
        lifes.DOM.classList.add ('time');
        lifes.DOM.classList.add ('lifes');
        // lim.classList.add (spawn); // get spawn animation
        document.body.appendChild(lifes.DOM); 
        lifes.setPosition (mS.x + 230, mS.y - 220);
    },
    addLife () {
        let newLife = document.createElement ('i');
        newLife.classList.add ('fas'); newLife.classList.add ('fa-heart');
        lifes.DOM.appendChild (newLife); this.num.push (newLife);
    },
    removeLife () {
        if (lifes.num.length > 0) {
            let dat = lifes.num.pop();
            dat.remove ();
        }
    }
}

// ENDGAME
let won = document.getElementById ('won');
let lost = document.getElementById ('lost');

// lines
let dots = [];
let lines = [];
let buffers = [];
let lifeBuffers = [];

// mouse element 
let mouse = {x: 0, y: 0};

// player
let player;
let auxPlayer = {
    vMoving: false,
    aMoving: false,
    // vBrakes: false,
    // aBrakes: false,
    vA: 0.05, // vertical aceleration
    sA: 0.001, // angular aceleration
}
let direction = '';
let side = '';
let pS = 0; // 5
let sS = 0; // 0.05

 // audio
let audio1 = document.createElement('audio');
audio1.setAttribute('src', 'v3.0.mpeg');

// FUNC ################################################################################

// check if element is on given radio
let inRad = (cenX, cenY, x, y, r) => {return ((cenX - x)*(cenX - x) + (cenY - y)*(cenY - y) < r*r) ? true : false;}

// get vector from a to b
let vecTo = (fromX, fromY, toX, toY) => {return [toX - fromX, fromY - toY];} // a list <==

// get angle given vector
let angTo = (vector) => {
    if (vector [0] > 0 && vector [1] > 0) {return Math.atan(vector[1]/vector[0]);
    } else if (vector [0] < 0 && vector [1] > 0) {return Math.PI + Math.atan(vector[1]/vector[0]);
    } else if (vector [0] < 0 && vector [1] < 0) {return Math.PI + Math.atan(vector[1]/vector[0]);
    } else {return Math.PI*2 + Math.atan(vector[1]/vector[0]);}
};

// get Dat angle
let dAng = (p) => {
    let fy = Math.floor((Math.random() * 100) + 1) * 5; 
    let fx = Math.floor((Math.random() * 100) + 1);
    let x = (mS.x-50) + fx;
    let y = (mS.y-250) + fy;
    let ang = angTo (vecTo (p.x, p.y, x, y));
    return -ang;
}

// get pos
let randXY = () => {
    let fy = Math.floor((Math.random() * 100) + 1); 
    let fx = Math.floor((Math.random() * 100) + 1); 
    let y = (fy*500)/100 + mS.y-250;
    let x = fx > 50 ? mS.x - 550 : mS.x + 550; 
    return [x,y];
}

// get the other point
let otherP = (p,ang) => {
    // r = 80
    let x = p.x + Math.cos(ang)*80;
    let y = p.y + Math.sin(ang)*80;
    let p2 = new Dot ();
    p2.startDOM (x,y);
    return p2;
}

// set new grow buff
let newGrowBuff = () => {
    let xy = randXY (); let x = xy[0]; let y = xy[1];
    let v =x > mS.x ? [-1,0] : [1,0];
    let p = new Dot (); p.startDOM (x,y); p.addBuff ('fa-arrows-alt-h');
    p.vec = v; buffers.push (p);
}
// set new life buff
let newLifeBuff = () => {
    let xy = randXY (); let x = xy[0]; let y = xy[1];
    let v =x > mS.x ? [-1,0] : [1,0];
    let p = new Dot (); p.startDOM (x,y); p.addBuff ('fa-heart');
    p.vec = v; lifeBuffers.push (p);
}

// EVENTS ################################################################################

// create lines and dots
document.addEventListener ('keyup', (event) => {
    if (event.code == 'Space' && stage.DOM == '') { // starts stage
        stage.startDOM();
        instructions.remove();
        let x1 = mS.x - 70; let x2 = mS.x + 70;
        let nD1 = new Dot (); 
        let nD2 = new Dot ();
        nD1.startDOM (x1, mS.y); nD2.startDOM (x2, mS.y);
        player = new Line (nD1, nD2); 
        player.startDOM ('playerSpawn');
        dots.push (nD1); dots.push (nD2); 
        stage.playerOn = true;
        player.a.speed = pS;
        player.b.speed = pS;
        player.DOM.classList.add ('player');

        time.startDOM ();
        lifes.startDOM ();
        lifes.addLife ();lifes.addLife ();lifes.addLife ();

        lim.startDOM ();
        audio1.play();

    } else if (event.code == "KeyU") { // generates player
        // let x1 = mS.x - 70; let x2 = mS.x + 70;
        // let nD1 = new Dot (); 
        // let nD2 = new Dot ();
        // nD1.startDOM (x1, mS.y); nD2.startDOM (x2, mS.y);
        // player = new Line (nD1, nD2); 
        // player.startDOM ('playerSpawn');
        // dots.push (nD1); dots.push (nD2); 
        // stage.playerOn = true;
        // player.a.speed = pS;
        // player.b.speed = pS;
        // player.DOM.classList.add ('player');

        // time.startDOM ();
        // lifes.startDOM ();
        // lifes.addLife ();lifes.addLife ();lifes.addLife ();

        // lim.startDOM ();
        // audio1.play();
    } else if (event.code == 'KeyW' || event.code == 'KeyS') {
        direction = '';
        pS = 0; 
        auxPlayer.vMoving = false; 
    } else if (event.code == 'ArrowLeft' || event.code == 'ArrowRight') {
        side = '';
        sS = 0; 
        auxPlayer.aMoving = false; 
    } else if (event.code == 'KeyF' && stage.playerOn == true) { // grow up
        player.expand ();
    }
})

document.addEventListener ('keydown', (event) => {
    if (event.code == 'KeyW' && stage.playerOn == true) { // UP
        direction = 'up';
        //auxPlayer.vBrakes = false; // acelerates in vertical
        auxPlayer.vMoving = true;
    } else if (event.code == 'KeyS' && stage.playerOn == true) { // DOWN
        direction = 'down';
        //auxPlayer.vBrakes = false; // acelerates in vertical
        auxPlayer.vMoving = true;
    } else if (event.code == 'ArrowRight' && stage.playerOn == true) { // rotate RIGHT
        side = 'right';
        //auxPlayer.aBrakes = false; // acelerates in angles
        auxPlayer.aMoving = true;
    } else if (event.code == 'ArrowLeft' && stage.playerOn == true) { // rotate LEFT
        side = 'left';
        //auxPlayer.aBrakes = false; // acelerates in angles
        auxPlayer.aMoving = true;
    }
})

// main clock
setInterval (() => {
    let mC = stage.over == false;
    // screen centre control
    mS = {x: window.innerWidth / 2, y: window.innerHeight / 2};
    if (stage.playerOn == true && mC) {
        stage.time++;
    }
    if (stage.DOM != '' && mC) {
        stage.setPosition(mS.x,mS.y);
    }
    // actualize lines
    if (lines.length > 0 && mC) {
        for (let i = 0; i < lines.length; i++) {
            lines[i].reSet ();
        }
    }
    // move lim
    if (lim.DOM != '' && mC) {
        lim.setPosition (player.x, player.y);
        // console.log ('now');
    }
    // lines auto control
    if (lines.length > 0 && mC) {
        for (let i = 0; i < lines.length; i++) {
            if (inRad(mS.x, mS.y, lines[i].b.x, lines[i].b.y, 555) && lines[i].b.manual == false) {
                lines[i].a.move (lines[i].a.vec);
                lines[i].b.move (lines[i].b.vec);
            }
            else if (inRad(mS.x, mS.y, lines[i].b.x, lines[i].b.y, 650) && lines[i].b.manual == false) {
                lines[i].a.move (lines[i].a.vec);
                lines[i].b.move (lines[i].b.vec);
                lines[i].DOM.classList.add ('blockGone');
            } else if (lines[i].b.manual == false){ 
                lines[i].destroyDOM ()
            }
        }
    }
    // generate a enemy each second
    if (stage.time % 25 == 0 && stage.playerOn == true && mC) {
        let xy = randXY ();
        let p1 = new Dot ();
        p1.startDOM (xy[0], xy[1]);
        let a = dAng (p1);
        let p2 = otherP (p1, a);
        let L = new Line (p1, p2);
        L.startDOM ('blockSpawn');
        p1.manual = false; p2.manual = false;
        dots.push (p1); dots.push (p2); 
        lines.push (L);
        let vec = vecTo (p1.x,p1.y,p2.x,p2.y);
        p1.vec = vec; p2.vec = vec;
    }
    // detect enemies collisions
    if (lines.length > 0 && mC) {
        for (let i = 0; i < lines.length; i++) {
            player.detectCollision (lines[i].a);
            player.detectCollision (lines[i].b);
        }
    }
    // player vertical and rotate movement
    if (stage.playerOn == true && mC) {
        player.reSet ();
        player.a.speed = pS;
        player.b.speed = pS;

        if (auxPlayer.vMoving == true && pS <= 5) {
            pS+=auxPlayer.vA*6; // v acelerating
        }
        if (auxPlayer.aMoving == true && sS <= 0.05) {
            sS+=auxPlayer.sA*3; // a acelerating
        }
        player.verticalMove (direction);
        player.rotate (side,sS);
        player.horizontalReset ();

        // console.log (player.a.speed);
    }
    // generate buffers
    if (stage.time % 400 == 0 && stage.playerOn == true && mC) {
        newGrowBuff ();
    }
    // generate lifes
    if (stage.time % 600 == 0 && stage.playerOn == true && mC) { // generate lifes
        newLifeBuff (); 
        // console.log ('life buffer');
    }
    // control buffers
    if (buffers.length > 0 && mC) {
        for (let i = 0; i < buffers.length; i++) {
            if (inRad (mS.x, mS.y, buffers[i].x, buffers[i].y, 585)) {
                buffers[i].move (buffers[i].vec);
            } else {
                buffers[i].destroyDOM ();
            }
            
        }
    }
    // control life buffers
    if (lifeBuffers.length > 0 && mC) {
        for (let i = 0; i < lifeBuffers.length; i++) {
            if (inRad (mS.x, mS.y, lifeBuffers[i].x, lifeBuffers[i].y, 585)) {
                lifeBuffers[i].move (lifeBuffers[i].vec);
            } else {
                lifeBuffers[i].destroyDOM ();
            }
            
        }
    }
    // detect buffer collisions
    if (buffers.length > 0 && mC) {
        for (let i = 0; i < buffers.length; i++) {
            player.detectBuff (buffers[i]);
        }
    }
    if (lifeBuffers.length > 0 && mC) {
        for (let i = 0; i < lifeBuffers.length; i++) {
            player.detectLife (lifeBuffers[i]);
        }
    }
    // interface control
    if (stage.playerOn == true && stage.time % 40 == 0 && mC) {
        time.setTime (stage.time/40);
    } else if (stage.playerOn == true && mC) {
        time.setPosition (mS.x - 230, mS.y - 220);
        lifes.setPosition (mS.x + 230, mS.y - 220);
    }
    // game over
    if (stage.time > 0 && lines.length > 3) {
        if (lifes.num.length == 0 && mC) {
            stage.over = true;
            lost.style.display = 'flex';
        } else if (inRad (player.x, player.y, player.a.x, player.a.y, 200) == false) {
            stage.over = true;
            won.style.display = 'flex';
        }
    }

}, 25) // 40fps