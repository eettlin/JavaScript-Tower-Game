class Explosives{

  constructor(location){
    // issue#1 use preloaded bullet image instead of loadImage

    this.loc = location;
    this.start = 5.0;
    this.radius = this.start;
    this.kills = false;

  }

  run(){
    //console.log("running");
    this.render();
    this.update();
  }
  render(){
    var ctx = towerGame.context;
    ctx.fillStyle = 'orange';
   // console.log(this.loc);
    ctx.beginPath();
    if(this.radius <= 50){
     this.radius += 7;
     console.log("sss");

    }  else {

      this.kills = true;
    }

    ctx.ellipse(this.loc.x, this.loc.y, this.radius, this.radius, 0, 2*Math.PI, false);
    ctx.fill();

    ctx.restore();
  }

  update(){


  }
}//  end Bullet class
