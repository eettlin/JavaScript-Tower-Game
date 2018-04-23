class Enemy {

  constructor(game) {
    this.game = game;
    this.currentCell = this.game.grid[0][0];
    this.loc = this.currentCell.center.copy();
    this.randomPath = 0;   //boolean to randomize or not
    this.radius = 15.0;
    this.r = 3.0;
    this.vel = 3.0;
    this.isLocked = false;
    this.initialVel = 1.8;
    this.isTarget= false;
    this.deathSound = new Audio('resources/sounds/splat.mp3');
    this.lastTime = Date.now();
    this.coolDown = 1000;
    this.towerLoc =  vector2d(0, 0);
    this.velVec;
    this.increasedDamg = 20;
  //  this.health = 1000;
    this.slowVel= this.initialVel - .8;
      // velocity factor
      this.damages = 0;
    this.vel = 3.0;       // velocity factor
    this.targetCell = this.nextTarget();
    this.target =  this.targetCell.center;
    this.shape = "circle";
    var targetVec = this.target.copy().sub(this.loc);
    this.velVec = targetVec.copy().normalize().scale(this.vel);      // initial velocity vector
    this.kill = false;
    this.angle=this.velVec.angle()

     this.img = Enemy.image3;// image for enemy


  }

  run() {
    this.update();
    this.render();
  }

  // nextTarget()
  // Return the next cell in the path to the root target
  // The parent of the current cell is always the optimal path
  // If we want some randomness in the path, choose from among all
  // the neighbor cells with a lesser distance to the root.
  nextTarget() {
    if(!this.randomPath)
        return(this.currentCell.parent);    // the parent cell is always the shortest path
    else {  // else choose from cells with a lesser distance to the root
        let candidates = [];
        for(let i = 0; i < this.currentCell.neighbors.length; i++) {
            if(this.currentCell.neighbors[i].dist < this.currentCell.dist)
                candidates.push(this.currentCell.neighbors[i]);
            }
        // randomly pick one of the candidates
        return(candidates[Math.floor(Math.random() * candidates.length)]);
        }
    }

  // render()
  // Draw the enemy at its current location
  // Enemies with a randomized path are blue and
  // enemies with an optimal path are green
  render() {
    //this.imgs = imgss;
    //console.log(this.imgs);
    var ctx = this.game.context
    ctx.save();

    ctx.translate(this.loc.x, this.loc.y);
    ctx.rotate(this.angle + Math.PI/2);
  //  console.log(this.img);
  //  ctx.drawImage(bsImage, Cell.wallImage.x, Cell.wallImage.y, Cell.wallImage.w, Cell.wallImage.h, this.loc.x, this.loc.y, this.game.w, this.game.w);
    //ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);
    ctx.drawImage(ssImage,this.img.x, this.img.y, this.img.w, this.img.h, 0, 0, this.img.w, this.img.h);
    ctx.restore();
  }

    // update()
    // Calculate a new location for this enemy.
    // If has reached the root cell, kill it
    // If it has reached the current target along the path,
    // find a new target and rotate the velocity in the direaction
    // of the new target.
  update() {
    let millis = Date.now();
    for(let h = 0; h < towerGame.bullets.length; h++){
          //  console.log(towerGame.bullets[h].ability);
      if(this.checkCollide(this, towerGame.bullets[h])){
        if(towerGame.bullets[h].ability == "normal"){
          //this.health = this.health - 100;
          this.health = this.health - towerGame.dmgSliders[0].value; //dmgSliders
          //console.log(this.health)
          towerGame.bullets.splice(h, 1);
        } else if(towerGame.bullets[h].ability == "fast"){
          this.health = this.health - towerGame.dmgSliders[1].value; //450
        //  console.log(this.health)
          towerGame.bullets.splice(h, 1);
        }else if(towerGame.bullets[h].ability == "freeze"){
          this.health = this.health - towerGame.dmgSliders[2].value; //1200
          //console.log("asdfasdfa");
        //  this.vel = this.initialVel - .8;
        }else if(towerGame.bullets[h].ability == "explosive"){

            this.health = this.health - 50;
          //this.health = this.health - 10;
          if(this.health <= 0){
            this.kill = true;
          }
          this.locations = this.loc;
            console.log("idk");
          towerGame.explosiveBullets.push(new Explosives(towerGame.bullets[h].loc));
          console.log(towerGame.explosiveBullets.length);
          //towerGame.explosiveBullets.push(new Explosives(towerGame.bullets[h].loc));
          towerGame.bullets.splice(h, 1);
          //console.log("exp");
        }


    }
  }

  if(this.isLocked){
    this.damages = this.damages + towerGame.dmgSliders[4].value;//this.increasedDamg;
    this.health = this.health-this.damages;
  }



    for(let i = 0; i < towerGame.explosiveBullets.length; i++){
      if(this.loc.dist(towerGame.explosiveBullets[i].loc) < 70){
        this.health = this.health - towerGame.dmgSliders[3].value;
      }
      if(towerGame.explosiveBullets[i].kills == true ){
        towerGame.explosiveBullets.splice(i, 1);
      //  console.log("die");
      }
    }




//  console.log(this.health);
if(this.health <= 0){
  this.kill = true;

  this.deathSound.play();
  //console.log("play");
  var incValue = parseInt(towerGame.bankIncValue.value);

  towerGame.bankValue += incValue;
  //towerGame.bankValue += towerGame.bankIncValue.value;
  console.log("inc value " + towerGame.bankIncValue.value);

  //console.log("kills");
}

    if(this.loc.dist(this.target) <= this.vel) {    // if we have reached the current target
        this.currentCell = this.targetCell;
        if(this.currentCell == this.game.root) {   // we have reached the end of the path
            this.kill = true;
            towerGame.health = towerGame.health - 1;
            return;
            }
        this.targetCell = this.nextTarget();                  // set a new target
        if(!this.targetCell) {
            this.kill = true;   // can happen if user blocks cells while enemies are attacking
            return;
            }
         this.target = this.targetCell.center;      // always target the center of the cell
        }
    // calculate new vector from current location to the target.
    var targetVec = this.target.copy().sub(this.loc);    // the direction we want to go
    var angleBetween = this.velVec.angleBetween(targetVec);
    if(angleBetween) {  // if there is some angle between
        if(angleBetween > 0 && angleBetween > Math.PI)  // positive and > 180 degrees
            angleBetween = angleBetween - 2*Math.PI;   // make negative and < 180 degrees
        else if(angleBetween < 0 && angleBetween < -Math.PI)   // negative and < -180 degrees
            angleBetween = angleBetween = angleBetween + 2*Math.PI;  // make positive and < 180 degrees

        // now rotate the current velocity in the direction of the targetAngle
        // a little at a time
        this.velVec.rotate(angleBetween/2);
        this.angle=this.velVec.angle();
        }
    this.loc.add(this.velVec);          // apply velocity to location
    this.fun()
  }
  fun() {

  }
  checkCollide(shape1, shape2) {

     if(shape1.shape === "circle") {
       if(shape2.shape === "circle") {
         //circle-circle
         //console.log(this.dist(shape1.loc, shape2.loc) );
         if(shape1.r + shape2.r >= shape1.loc.copy().dist(shape2.loc)) return true;
         return false;
       } else if(shape2.shape === "square") {
         //circle-square
         let topLeft = shape2.loc;
         let topRight = new vector2d(shape2.loc.x + shape2.w, shape2.loc.y);
         let bottomRight = new vector2d(shape2.loc.x + shape2.w, shape2.loc.y + shape2.w);
         let bottomLeft = new vector2d(shape2.loc.x, shape2.loc.y +_shape2.w);
         let dist1 = this.dist(topLeft, shape1.loc);
         let dist2 = this.dist(topRight, shape1.loc);
         let dist3 = this.dist(bottomRight, shape1.loc);
         let dist4 = this.dist(bottomLeft, shape1.loc);
         if(dist1 <= shape1.r || dist2 <= shape1.r || dist3 <= shape1.r || dist4 <= shape1.r) return true;
         return false;
        } else if(shape2.shape === "point") {
          //circle-point
          if(shape1.r >= this.dist(shape1.loc, shape2.loc)) return true;
          return false;
        } else {
          throw "shape2 shape not acceptable.";
        }

      } else if(shape1.shape === "square") {
        if(shape2.shape === "circle") {
          //square-circle
          let topLeft = shape1.loc;
          let topRight = new vector2d(shape1.loc.x + shape1.w, shape1.loc.y);
          let bottomRight = new vector2d(shape1.loc.x + shape1.w, shape1.loc.y + shape1.w);
          let bottomLeft = new vector2d(shape1.loc.x, shape1.loc.y + shape1.w);
          let dist1 = this.dist(topLeft, shape2.loc);
          let dist2 = this.dist(topRight, shape2.loc);
          let dist3 = this.dist(bottomRight, shape2.loc);
          let dist4 = this.dist(bottomLeft, shape2.loc);
          if(dist1 <= shape2.r || dist2 <= shape2.r || dist3 <= shape2.r || dist4 <= shape2.r) return true;
          return false;
        } else if(shape2.shape === "square") {
          //square-square
          if (shape1.loc.x < shape2.loc.x + shape2.w &&
            shape1.loc.x + shape1.w > shape2.loc.x &&
            shape1.loc.y < shape2.loc.y + shape2.w &&
            shape1.w + shape1.loc.y > shape2.loc.y) {
              return true;
          }
          return false;
        } else if(shape2.shape === "point") {
          //square-point
        } else {
          throw "shape2 shape not acceptable.";
        }
      } else if(shape1.shape === "point") {
        if(shape2.shape === "circle") {
          //point-circle
          if(shape2.r >= vector2d.dist(shape2.loc, shape1.loc)) return true;
          return false;
        } else if(shape2.shape === "square") {
          //point-square
        } else if(shape2.shape === "point") {
          //point-point
          if(vector2d.dist(shape2.loc, shape1.loc) < 1) return true;
          return false;
        } else {
        throw "shape2 shape not acceptable.";
      }
    } else {
      throw "shape1 shape not acceptable.";
    }


  }

} // end class ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
class Enemy1 extends Enemy {
  constructor(game) {
    super(game)
    this.randomPath=1
    this.img = game.enDa[0];
    this.health = 1000;
  //  this.img=Enemy.image1
  }
}
class Enemy2 extends Enemy {
  constructor(game) {
    super(game)
  //  this.img=Enemy.image2
  this.img = game.enDa[1];
  this.health == 3000;
  }
  fun(){
    this.velVec = this.velVec.copy().normalize().scale(Math.random()*10)
  }
}
class Enemy3 extends Enemy {
  constructor(game) {
    super(game)
  //  this.img=Enemy.image3
    this.img = game.enDa[2];
    this.health=10000
  }
}
class Enemy4 extends Enemy {
  constructor(game) {
    super(game)
    this.img = game.enDa[3];
  //  this.img=Enemy.image4
    this.health=20000
  }
}
class Enemy5 extends Enemy {
  constructor(game) {
    super(game)
    this.img = game.enDa[4];
  //  this.img=Enemy.image5
    this.health=1000000000000000000
  }
}
