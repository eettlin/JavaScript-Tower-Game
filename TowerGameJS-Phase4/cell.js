
class Cell{
  constructor( game, loc, id){
    this.game = game;       // the global instance
    this.loc = loc;     // top left pixel location
    this.center = vector2d(loc.x+(game.w)/2, loc.y+(game.w)/2);
    this.color = 'pink';
    this.id = id;
    this.neighbors = [];
    this.occupied = false;
    this.parent = 0;  //  this is the parent cell
    this.dist = -1;
    this.vec = null;
    this.hasTower = false;
    //this.image =
  //  this.wallImage;
  }

    // render() --
    // draw cells that are occupied and the root cell
  render(){
    let ctx = this.game.context;
    ctx.strokeStyle = 'white';
 //   ctx.strokeRect(this.loc.x, this.loc.y, this.game.w, this.game.w);
    if(this.occupied) {
        ctx.drawImage(bsImage, Cell.wallImage.x, Cell.wallImage.y, Cell.wallImage.w, Cell.wallImage.h, this.loc.x, this.loc.y, this.game.w, this.game.w);
        }
    else if(this == this.game.root) {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.ellipse(this.center.x, this.center.y, this.game.w/2, this.game.w/2, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        }


    // draw vector
    // if(this.vec && !this.occupied){
    //   this.game.context.beginPath();
    //   this.game.context.moveTo(this.center.x, this.center.y);
    //   this.game.context.lineTo(this.center.x + this.vec.x, this.center.y + this.vec.y);
    //   this.game.context.stroke();
    //
    // }

  //  this.getText();
  }

    // addNeighbors()
    // Find all the neighbors of this cell that exist and are not occupied
    // and do not have a tower.
    // Diagonal neighbors must not be blocked diagonally.
    // For example, a southeast neighbor might not be occupied
    // but if east and south are both occupied then southeast is blocked
    // and not considered to be a neighbor.

  addNeighbors(game, grid){
    this.neighbors = [];    // start with empty neighbors
    let col = this.loc.x/game.w;
    let row = this.loc.y/game.w;
    let n,ne,e,se,s,sw,w,nw = null; // all eight neighbors

    if(row > 0 ){
          n = grid[col][row-1];
          if(!n.occupied && !n.hasTower)
            this.neighbors.push(n);    //N
        }
    if( col < game.cols-1){
        e = grid[col+1][row];
        if(!e.occupied && !e.hasTower)
        this.neighbors.push(e);    //E
    }
    if(row < game.rows-1){
        s = grid[col][row+1];
        if(!s.occupied && !s.hasTower)
            this.neighbors.push(s);    //S
    }
     if(col > 0){
        w = grid[col-1][row];
        if(!w.occupied && !w.hasTower)
            this.neighbors.push(w);    //W
    }
    if( col < game.cols-1 &&  row > 0){           //  NE
        ne = grid[col+1][row-1];
        if(!ne.occupied && !ne.hasTower && !(n && (n.occupied || n.hasTower) && e && (e.occupied || e.hasTower))){
            this.neighbors.push(ne);
            }
    }
     if(col < game.cols-1 &&  row < game.rows-1){      //  SE
        se = grid[col+1][row+1];
        if(!se.occupied && !se.hasTower && !(e && (e.occupied || e.hasTower) && s && (s.occupied || s.hasTower))){
            this.neighbors.push(se);
            }
    }
    if(col > 0 &&  row < game.rows-1 ){             //  SW
        sw = grid[col-1][row+1];
        if(!sw.occupied && !sw.hasTower && !(s && (s.occupied || s.hasTower) && w && (w.occupied || w.hasTower))){
            this.neighbors.push(sw);
            }
    }
    if(col > 0 && row > 0){                     //  NW
        nw = grid[col-1][row-1];
        if(!nw.occupied && !nw.hasTower && !(w && (w.occupied || w.hasTower) && n && (n.occupied || n.hasTower))){
            this.neighbors.push(nw);
            }
        }
  }

    // Return a vector from this cell to its parent
  getVector(){
    if(this.parent) {
        let dx = this.parent.loc.x - this.loc.x;
        let dy = this.parent.loc.y - this.loc.y;
        let v = new vector2d(dx, dy);
        return v;
        }
    else return(vector2d(0,0));
  }

  getText(){

    var context = this.game.context;
    context.save();
    context.fillStyle = "white";
    context.font = "14px sans-serif";
    context.fillText(""+this.dist, this.loc.x+.2*this.game.w/2, this.loc.y+this.game.w/2 - 5);
    context.fillStyle = "black";
    context.fillText(""+this.id, this.loc.x+.2*this.game.w/2, this.loc.y+this.game.w/2 +15);
    //if(this.vec) context.fillText(""+this.vec.toString(), this.loc.x+.2*this.game.w/2, this.loc.y+this.game.w/2 +15);

    context.restore();
  }



}
