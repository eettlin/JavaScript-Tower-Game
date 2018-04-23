'use strict'

class Tower {
  // issue#1 use preloaded images
  constructor( cost, tImg, bImg, ability) {
    this.loc = vector2d(0, 0);
    this.ability = ability;
    this.placed = false;
    this.visible = false;
    this.enX= 0;
    this.enY =0;
    this.cost = cost;
    this.bulletImg = bImg;
    this.towImg = tImg;
    this.towAngle = 0;
    this.lastTime = Date.now();
    this.coolDown = 500;
    towerGame.bankValue = towerGame.bankValue- this.cost;
    this.enemies=towerGame.enemies
    this.range=200;


  this.ability = ability;
    this.target=null
    this.enemy=null
  }

  run() {
    this.render();
    this.update();
  }

  render() {
    if(this.ability == "freeze"){
       this.coolDown = towerGame.fireSliders[2].value;
       console.log(towerGame.fireSliders[2].value); //2500
       this.range = 500;
     }
     else if(this.ability == "normal"){
       this.coolDown = towerGame.fireSliders[0].value; //700
     }else if(this.ability == "fast"){
       this.coolDown = towerGame.fireSliders[1].value; //200
     } else if(this.ability == "explosive"){
       this.coolDown = towerGame.fireSliders[3].value;
     }else{
     this.coolDown = 100; //100
   }
    var ctx = towerGame.context;
    ctx.save();
      ctx.translate(this.loc.x, this.loc.y);
      ctx.rotate(this.towAngle + Math.PI/2);
      if(!this.placed && this.loc.x !== 0) {
        ctx.beginPath();
        ctx.arc(0, 0, this.range, 0, 2*Math.PI, false);
         ctx.fillStyle = 'rgba(192, 192, 192, 0.5)';
         ctx.fill();
         ctx.lineWidth = 5;
         ctx.strokeStyle = '#003300';
         ctx.stroke();
      }
      if (this.visible) { //  not visible when first created

    //  ctx.drawImage(this.towImg, -this.towImg.width/2,-this.towImg.height/2);
        ctx.drawImage(ssImage,this.towImg.x, this.towImg.y, this.towImg.w, this.towImg.h, -this.towImg.w/2, -this.towImg.h/2, this.towImg.w, this.towImg.h);
        }

    ctx.restore();
  }

  update() {


	//  console.log(slider1.value);

    //  Rotate turret to follow mouse
    this.enemy=this.findEnemy()
    if(this.enemy) {
      this.target=this.enemy.loc
    }else{
      this.target=vector2d(towerGame.canvas.mouseX,towerGame.canvas.mouseY)
    }
    let dx = this.loc.x - this.target.x;
    let dy = this.loc.y - this.target.y;
    this.towAngle = Math.atan2(dy, dx) - Math.PI;
    this.checkEnemies();
  }

  checkEnemies(){
    let dx = this.loc.x - this.target.x;
    let dy = this.loc.y - this.target.y;
    let dist = vector2d(dx,dy).length();
    let millis = Date.now();
     if(this.placed &&
      dist < this.range &&
      (millis-this.lastTime > this.coolDown ) && towerGame.enemies.length != 0 && this.target.x != towerGame.canvas.mouseX){
          // reset lastTime to current time
          this.lastTime = millis;
          let bulletLocation = vector2d(this.loc.x, this.loc.y);
          //console.log(this.ability);
          let b = new Bullet(bulletLocation , this.bulletImg, this.towAngle, this.ability);
        //  towerGame.bullets.push(b);
          if( this.ability != "ray" && this.ability!= "freeze"){
            //console.log("shoot");

            towerGame.bullets.push(b);
      }
        if(this.ability == "freeze"){
          let sb = new Bullet(bulletLocation , this.bulletImg, this.towAngle, this.ability)
          towerGame.bullets.push(sb);
        }
    }
    if(this.ability == "ray" && towerGame.enemies.length != 0){
      var a3 = this.loc.x - this.target.x;
      var b3 = this.loc.y - this.target.y;
      var k = Math.sqrt(a3*a3 + b3*b3);
      if( k < 300 && towerGame.enemies.length != 0 && this.target.x != towerGame.canvas.mouseX){
      var rys = new LockOn(this.loc, this.target);
      rys.run();
      if(this.findEnemyIndex() < towerGame.enemies.length)

        towerGame.enemies[this.findEnemyIndex()].isLocked = true;//health -=  10;
      } else {
        towerGame.rays = [];
      }
    }
  }
  findEnemyIndex(){
    for(let i=0;i<this.enemies.length;i++){
      if(this.enemies[i].loc.dist(this.loc)<this.range){
        return i;
      }
    }
  }
  findEnemy(){
    for(let i=0;i<this.enemies.length;i++){
      if(this.enemies[i].loc.dist(this.loc)<this.range){
        return this.enemies[i]
      }
    }
  }

}//  end Tower class +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
