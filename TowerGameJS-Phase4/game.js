'use strict'

// wait for the window to load and than call back setup()
window.addEventListener('load', loadImages, false);

var towerGame;   // the global game object
var FRAME_RATE=30;
var cellId = 0;

var bsImage;
var ssImage;
var load = document.getElementById('loader');
var wrap;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++slider
var sliderDiv = document.createElement('div');
sliderDiv.setAttribute('id', 'sliderDiv');
document.body.appendChild(sliderDiv);
/*
var slider1 = document.createElement('input');
slider1.setAttribute('type', 'range');
slider1.setAttribute('min', '0');
slider1.setAttribute('max', '1000');
slider1.setAttribute('id', 'slider1');

sliderDiv.appendChild(slider1); */
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 function loadImages(){
   bsImage = new Image();
   bsImage.src = "resources/images/spritesheets/buttons.png";
   ssImage = new Image();
   ssImage.src = "resources/images/spritesheets/sprites2.png";
   window.setTimeout(setup, 1500);
 }
function setup() {
  wrap = document.getElementById('wrapperDiv');
  load.style.display = 'none';
  wrap.style.display = 'block';

  towerGame = new Game();
  window.setTimeout(draw, 100);    // wait 100ms for resources to load then start draw loop

  //panelthings

}

function draw() {   // the animation loop
    towerGame.run();
    //console.clear();
    window.setTimeout(draw, 1000/FRAME_RATE);  // come back here every interval
}

// Game is the top level object and it contains the levels
class Game {
  //  This is a test
  constructor() { // from setup()
    this.isRunning = true;
    this.placingTower = false;
    this.currentTower = 0;
    this.towerType = 0;
    this.gameTime = 0;
    this.towers = [];
    this.enemies = [];
    this.bullets = [];
    this.fireSliders = [];
    this.fireSlidersText = [];
    this.dmgSliders = [];
    this.dmgSlidersText = [];
    this.costSliders = [];
    this.costSlidersText = [];
    this.explosiveBullets = [];
    this.explosiveBullets = [];
    this.bankIncValue;
    this.textBankInc;
    this.bankValue = 500;
    this.rays = [];
    this.towersBankValuesARR = [];
    this.checkOnce = true;
    this.enemyNum = 20;
    this.wallCost = 35;
    this.enDa = [];
    this.towImgData = [];
    this.bulletImgData = [];
    this.paused = false;

    this.loadEnemyImages();
    this.score = 0;
    this.wave = 0;
    this.health = 100;
    this.canvas = document.createElement("canvas");
    if(!this.canvas || !this.canvas.getContext)
        throw "No valid canvas found!";
    this.canvas.width = 900;
    this.canvas.height = 750;
    this.canvas.canDiv=document.getElementById('canDiv')
    this.canvas.canDiv.appendChild(this.canvas);
    this.createFireRateSilder();
    this.createDamageSliders();
    this.createTowerCostSliders();
    this.createEnemyDeathValueSlider();
    this.context = this.canvas.getContext("2d");
    if(!this.context)
        throw "No valid context found!";
    this.lastTime = Date.now();
    //select everything of type/class and set call backs
    this.tileDivs = this.createTileDivs();
    this.loadDOMCallBacks(this.tileDivs);
    // select canvas for callbacks
    this.canvas.addEventListener('mousemove',this.handleCNVMouseMoved,false);
    this.canvas.addEventListener('mouseover',this.handleCNVMouseOver, false);
    this.canvas.addEventListener('click', this.handleCNVMouseClicked, false);
    this.currentWaveNum=0
    this.wave=new Wave(this,AllWaves[this.currentWaveNum])

    this.mouseX = 0;
    this.mouseY = 0;
    this.w = 50;
    this.done = false;

    window.onkeydown = function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code === 38) { //up key
          //console.clear();
          //console.log("Basic Tower: " + slider1.value);
        }
    };

  //  this.enemyData = [];
      this.loadWallImage();
    this.level= new Level1(this)





    // containerarrays for cells
    this.grid = [];
    this.cols = Math.floor(this.canvas.width / this.w);
    this.rows = Math.floor(this.canvas.height / this.w);

    this.loadGrid();
    this.root = this.grid[this.cols - 1][this.rows -1];
    this.brushfire();


    var button = document.getElementById('pauseButton');
    button.addEventListener('click', this.pause, false);

    var fastForwardButton = document.getElementById('fastForward');
    fastForwardButton.addEventListener('click', function(){
      if (FRAME_RATE == 30){
        FRAME_RATE = 60;
        fastForwardButton.innerHTML = "Slow Down";
      } else {
        fastForwardButton.innerHTML = "Fast Forward";
        FRAME_RATE = 30;
      }
    },false);
  }
  //load wall stuff
  loadWallImage(){
    // grab the wall image from the buttons stprite sheet
   var propName =  "Block0000";
   var f = buttonsJSON.frames[propName].frame;
  // console.log(f.x);
   Cell.wallImage = f;

  }


  loadEnemyImages(){
    var enemyData = [];


    for (var i = 1; i <= 5; i++){
      var propName = "E" + i + "0000";
      var f = jsonx.frames[propName].frame;
    //  this.enemyData.push(f);
    //  console.log(f);
  //  enemyData.push(createImageBitmap(ssImage, f.x, f.y, f.w, f.h));
    //console.log(f);
    this.enDa.push(f);
  //  enDa.push(f);
    }


   }


  // The success callback when a tower canvas image
  // or bullet image has loaded.  Hide them from
  // displaying on the page.
  hideImgElement() { this.style.display = "none"; }

  run() { // called from draw()

    if (!this.paused){
    this.level.run()
    this.updateFireRateSliders();
    this.updateDamageSliders();
    this.updateTileDivs();
  }

  }


  pause(){
    var butt = document.getElementById('pauseButton');
  towerGame.paused = !towerGame.paused;
  if (towerGame.paused) butt.innerHTML = "Play";
  if (!towerGame.paused) butt.innerHTML = "Pause";
}



  render() { // draw game stuff
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);

  }

      // brushfire()
    // starting with the 'root' cell, which is the bottom right cell of the grid
    // assign a "distance" to all other cells where the distance is the
    // accumulated steps from that cell to the root cell.
    // An adjacent neighbor has a step of 10
    // and a diagonal neighbor has a step of 14.

  brushfire(undo) { //if brushfire fails to make a valid map undo will be called
    // Initialize each cell in the grid to have a distance that
    // is the greatest possible.  Initialize each cell to
    // have no parent and populate it's array of neighbors
    for(var i = 0; i < this.cols; i++){
      for(var j = 0; j < this.rows; j++){
        var cell = this.grid[i][j];
        cell.dist = this.cols * this.rows * 10;     // set distance to max
        cell.vec = null;    // clear parent vector
        cell.parent = 0;    // clear parent
        cell.addNeighbors(this,  this.grid); // fill the neighbors array
      }
    }
    // Initialize the fifo queue with the root cell
    this.root.dist = 0;
    this.root.occupied = false; // in case it was randomly set occupied
    var queue = [this.root];

    // loop as long as the queue is not empty, removing the first cell
    // in the queue and adding all its neighbors to the end of the
    // queue.  The neighbors will only be those that are not occupied
    // and not blocked diagonally.
    while(queue.length) {
        var current = queue.shift();   // remove the first cell from the queue
        // for all its neighbors...
        for(let j =0; j < current.neighbors.length; j++){
            let neighbor = current.neighbors[j];
            var dist = current.dist+10; // adjacent neighbors have a distance of 10
            if(current.loc.x != neighbor.loc.x && current.loc.y != neighbor.loc.y)
                dist = current.dist+14; // diagonal neighbors have a distance of 14
            // if this neighbor has not already been assigned a distance
            // or we now have a shorter distance, give it a distance
            // and a parent and push to the end of the queue.
            if(neighbor.dist > dist) {
                neighbor.parent = current;
                neighbor.dist = dist;
                queue.push(neighbor);
                }
          }     // for each neighbor
        }   // while(queue.length)
    if(!this.validMap()){
      if(undo){
          undo()
          this.brushfire()
      }else{
        // delete any enemy that is currently in a cell without a parent
        for(let i = 0; i < this.enemies.length;  i++) {
            let enemy = towerGame.enemies[i];
            if(!enemy.currentCell.parent)
                enemy.kill = true;    // kill the orphans
            }
            console.log("brushfire created an invalid map and no undo was inputed")

      }
    }


        // give each cell a vector that points to its parent
//       for(var i = 0; i < this.cols; i++){
//         for(var j = 0; j < this.rows; j++){
//           this.grid[i][j].vec = this.grid[i][j].getVector();
//         }
//       }

    }
    //check the map to see if there are cells without parents
    validMap() {
      if(this.grid[0][0].occupied || this.grid[0][0].hasTower){
        return false;
      }
      else{
        for(var i = 0; i < this.cols; i++){
          for(var j = 0; j < this.rows; j++){
            var cell = this.grid[i][j];
            if(!cell.parent && !(cell.occupied || cell.hasTower)&& cell!=this.root){
              return false;

            }
          }
        }
        return true;
      }
    }
    //undo an invalid map action
    undo(cell,tower) {
      if(tower){
        return function() {
          cell.hasTower=false;
          towerGame.towers.splice(towerGame.towers.indexOf(tower))
          alert("you cannot place a tower here")
        }
      }else{
        return function() {
          if (cell.occupied){
            cell.occupied = false;
            towerGame.bankValue += towerGame.wallCost;
          } else {
            cell.occupied = true;
            towerGame.bankValue -= towerGame.wallCost;
          }
          alert("performing that action would create an invalid grid")
        }
      }
    }
    // sendEnemies()
    // Send a random number of enemies, up to 5, each from a random location
    // in the top half of the grid.  About half of the enemies will take the
    // optimal path simply by following the parent chain and about half will
    // take a path of randomly choosing cells to be next on the path
    // from all those cells with a distance to the root that is
    // less than its current location.
    // A valid cell to start the enemy must have a parent because lack
    // of a parent means either it is occupied or it is blocked from any path.
    sendEnemies() {
        var numEnemies = Math.random() * 5;     // up to 5 enemies
        var row, col, startCell, i, j;
        for( i = 0; i < numEnemies; i++) {
            for(j = 0; j < 3; j++) { // try 3 times to find valid start cell
                startCell = this.grid[0][0];
                if(startCell && startCell.parent)   // must have a parent to have any path
                    break;
                }
            if(j < 3) { // if we found a valid cell to start the enemy
                let randomPath = Math.floor(Math.random() * 2);    // about half
                this.enemies.push(new Enemy(this, startCell, randomPath));
                }
            }
    }
    controlWaves() {
      if(this.wave.isWaveOver()){
        this.currentWaveNum+=1
        this.wave=new Wave(this,AllWaves[this.currentWaveNum])
      }else{
        this.wave.run()
      }
    }
    // Delete any enemies that have died
    removeEnemies() {
      for(let i = this.enemies.length-1; i >= 0; i--) {
        if(this.enemies[i].kill)
            this.enemies.splice(i,1);   // delete this dead enemy

        }
    }

  removeBullets(){
    if(this.bullets.length < 1) return;
    for(let i = this.bullets.length-1; i >= 0; i--){

       if( this.bullets[i].loc.x < 0 ||
           this.bullets[i].loc.x > this.canvas.width ||
           this.bullets[i].loc.y < 0 ||
           this.bullets[i].loc.y > this.canvas.height ){
             this.bullets.splice(i, 1);
           }

    }
  }
  updateInfoElements(time){
    let infoElements = document.getElementById('infoDiv').getElementsByClassName('infoTileDiv');
    for(let i = 0; i < infoElements.length-1; i++){
      let info = infoElements[i];
      // change the html content after condition--use indexOf
      if(info.innerHTML.indexOf('Bank') != -1){
        info.innerHTML = 'Bank <br/>';
        var value = document.createElement('p');
        value.style.fontSize = '10pt';
        value.innerHTML = this.bankValue;
        info.appendChild(value)
        if(this.bankValue < 0){
          this.bankValue == 0;
        }
      }else if(info.innerHTML.indexOf('Time') != -1){
        info.innerHTML = 'Time <br/>';
        var value = document.createElement('p');
        value.style.fontSize = '10pt';
        value.innerHTML = time;
        info.appendChild(value);
      }
      if(info.innerHTML.indexOf('Score') != -1){
        info.innerHTML = 'Score <br/>';
        var value = document.createElement('p');
        value.style.fontSize = '10pt';
        value.innerHTML = this.score;
        info.appendChild(value);
      }
      if(info.innerHTML.indexOf('Wave') != -1){
        info.innerHTML = 'Wave <br/>';
        var value = document.createElement('p');
        value.style.fontSize = '10pt';
        value.innerHTML = this.wave.waveJson.name;
        info.appendChild(value);
      }
      if(info.innerHTML.indexOf('Health') != -1){
        info.innerHTML = 'Health <br/>';
        var value = document.createElement('p');
        value.style.fontSize = '12pt';
        value.innerHTML = this.health;
        info.appendChild(value);
      }
    }
  }
  updateCostInfoElement(value) {
  let infoElements = document.getElementById('infoDiv').getElementsByClassName('infoTileDiv');
  let info = infoElements[infoElements.length-3];
  info.innerHTML = 'Cost <br/>' + value;
  }

  updateGameTime(){
    var millis = Date.now();
    if(millis - this.lastTime >= 1000 ) {
      this.gameTime++;
      this.lastTime = millis;
    }
    return this.gameTime;
  }

   // +++++++++++++++++++++++++++++++++++++++++++  load a 2D array with cells
  loadGrid(){
    for(var i = 0; i < this.cols; i++){     // columns of rows
      this.grid[i] = [];
      for(var j = 0; j < this.rows; j++){
        this.grid[i][j] = new Cell(this, vector2d((i*this.w), (j*this.w)), ++cellId);

      }
    }

  }  // ++++++++++++++++++++++++++++++++++++++++++++++  End LoadGrid

  createTowerBitmaps(ssImage, mtd, index){
      if (!ssImage || !bsImage.complete){
          alert("Images not loaded");
          // quit code
      }
      var propertyName = "T" + (index+1) + "0000";
      var frame = jsonx.frames[propertyName].frame;
      var bulletPropertyName = "p" + (index+1) + "0000";
      var bulletFrame = jsonx.frames[bulletPropertyName].frame;
      this.towImgData.push(frame);
      this.bulletImgData.push(bulletFrame);
     mtd.cnvTurImg = this.towImgData[index];
      mtd.cnvBulImg = this.bulletImgData[index];

    }
  printSliderData(){
    console.log("Tower1 Shoot Speed: " + slider1.value);
  }

  // Create the divs to hold the menu of towers with
  // the large images.  This divs also contain the
  // parameters for creating towers to be drawn on the
  // canvas.
  createFireRateSilder(){
    var towers = [];
    for(var i = 0; i < 4; i++){
      var sl = document.createElement('input');
      sl.setAttribute('type', 'range');
      sl.setAttribute('min', '50');
      sl.setAttribute('max', '3000');
      if(i == 0){
          sl.setAttribute('value', '700');
      } else if( i == 1) {
          sl.setAttribute('value', '200');
      } else if(i == 2){
        sl.setAttribute('value', '2500');
      } else if (i ==3) {
        sl.setAttribute('value', '700');

      }

      //sl.setAttribute('value', '1000');
      sl.setAttribute('id', 'slider1');

    var CoolDownSliderText = document.createElement('div');
    CoolDownSliderText.id = "cd";
	  CoolDownSliderText.innerHTML = 'Tower ' + (i+1) + ' Cool Down: ' + sl.value;
	  CoolDownSliderText.style.color = '#ffffff';
	  sliderDiv.appendChild(CoolDownSliderText);
    sliderDiv.appendChild(sl);
    this.fireSliders.push(sl);
    this.fireSlidersText.push(CoolDownSliderText);
  }
}

  createDamageSliders(){
    for(var i = 0; i < 5; i++){
      var dmgSlider = document.createElement("input");
      dmgSlider.setAttribute('type', 'range');
      dmgSlider.setAttribute('min', '5');

      dmgSlider.setAttribute('id', 'slider2');
      if(i == 0){
        dmgSlider.setAttribute('max', '1000');
        dmgSlider.setAttribute('value', '500');
      } else if( i == 1) {
        dmgSlider.setAttribute('max', '1000');
        dmgSlider.setAttribute('value', '400');
      } else if(i == 2){
        dmgSlider.setAttribute('max', '1750');
        dmgSlider.setAttribute('value', '1200');
      } else if (i ==3) {
        dmgSlider.setAttribute('max', '400');
        dmgSlider.setAttribute('value', '100');
      } else {
        dmgSlider.setAttribute('max', '80');
        dmgSlider.setAttribute('value', '20');
      }

      var dmgSliderText = document.createElement('div');
      dmgSliderText.id = "dmg";
      dmgSliderText.innerHTML = 'Tower ' + (i + 1) +' Damage: ' + dmgSlider.value;
      dmgSliderText.style.color = '#f44245';
      sliderDiv.appendChild(dmgSliderText);
      sliderDiv.appendChild(dmgSlider);
      this.dmgSliders.push(dmgSlider);
      this.dmgSlidersText.push(dmgSliderText);


    }
  }

  createTowerCostSliders(){
    for(var i = 0; i < 5; i++){
      var costSlider = document.createElement("input");
      costSlider.setAttribute('type', 'range');
      costSlider.setAttribute('min', '100');
      costSlider.setAttribute('max', '1500');
      costSlider.setAttribute('id', 'slider3');
      if(i == 0){
        costSlider.setAttribute('value', '200');
      } else if( i == 1) {
        costSlider.setAttribute('value', '500');
      } else if(i == 2){
        costSlider.setAttribute('value', '500');
      } else if (i ==3) {
        costSlider.setAttribute('value', '700');
      } else {
        costSlider.setAttribute('value', '1000');
      }
      if(i == 5) {
        costSlider.setAttribute('type', 'range');
        costSlider.setAttribute('min', '10');
        costSlider.setAttribute('max', '100');
        costSlider.setAttribute('value', '20');
      }
      var costSliderText = document.createElement('div');
      costSliderText.id = "cost";
      costSliderText.innerHTML = 'Tower ' + (i + 1) +' Cost: ' + costSlider.value;
      costSliderText.style.color = '#56f442';
      sliderDiv.appendChild(costSliderText);
      sliderDiv.appendChild(costSlider);
      this.costSliders.push(costSlider);
      this.costSlidersText.push(costSliderText);
    }
  }

  createEnemyDeathValueSlider(){
    var bankInc = document.createElement("input");
    bankInc.setAttribute('type', 'range');
    bankInc.setAttribute('min', '1');
    bankInc.setAttribute('max', '75');
    bankInc.setAttribute('id', 'slider4');
    var text = document.createElement('div');
    text.id = "inc";
    text.innerHTML = 'Money Given After Kill ' + bankInc.value;
    text.style.color = '#dbe82c';
    sliderDiv.appendChild(text);
    sliderDiv.appendChild(bankInc);
    this.bankIncValue = bankInc;
    this.textBankInc = text;
  }

  updateDamageSliders(){
    for(var i = 0; i < 5; i++){
      this.dmgSlidersText[i].innerHTML = 'Tower ' + (i+1) +' Damage: ' + this.dmgSliders[i].value;

    }
    for(var i = 0; i < 5; i++){
        this.costSlidersText[i].innerHTML = 'Tower ' + (i+1) + ' Cost: ' + this.costSliders[i].value;
    }
    this.textBankInc.innerHTML = 'Money After Kill ' + this.bankIncValue.value;
  }

  updateFireRateSliders(){
    for(var i = 0; i < 4; i++){
      this.fireSlidersText[i].innerHTML = 'Tower ' + (i+1) + ' Cool Down: ' + this.fireSliders[i].value;
    }
  }

  updateTileDivs(){
    for(var i = 0; i < 5; i++){
        this.towersBankValuesARR[i].cost = this.costSliders[i].value;
    }
  }

  createTileDivs(){
    var tiles = [];
    var buttons = ["B10000", "B20000", "B30000", "B40000", "B50000", "B60000"];
    //  loop through the towers and DO NOT include wall element
    for(var i = 0; i < 5; i++){
      var mtd = document.createElement("div"); // createDiv("");
      if(i == 0){
      mtd.ability = "normal";
      mtd.cost = this.costSliders[0].value;//200;

    } else if(i == 1){
      mtd.ability = "fast";
      mtd.cost = this.costSliders[1].value;

    } else if(i == 2){
      mtd.ability = "freeze";
      mtd.cost = this.costSliders[2].value;

    } else if(i == 3){
      mtd.ability = "explosive";
      mtd.cost = this.costSliders[3].value;

    } else {
      mtd.ability = "ray";
      mtd.cost = this.costSliders[4].value;
    }// createDiv("");

      var b = buttons[i];
      var button = buttonsJSON.frames[b].frame;

      var innerDiv = document.createElement("div");
      innerDiv.id = "innerDiv" + i;
      innerDiv.style.width = "90px";
      innerDiv.style.height = "90px";
      innerDiv.style.backgroundImage = "url(resources/images/spritesheets/buttons.png)";
      innerDiv.style.backgroundPosition = `${-button.x}px ${-button.y}px`;
      innerDiv.style.margin = "5px";
      mtd.appendChild(innerDiv);

      document.getElementById("menuDiv").appendChild(mtd);


  //    mtd.cost = 100*i +50;
      mtd.setAttribute('title', 'Cost = '+mtd.cost);
      mtd.id = 'towImgDiv' + i;
      tiles.push(mtd);
      this.towersBankValuesARR.push(mtd);
      this.createTowerBitmaps(ssImage, mtd,i)

    }
    return tiles;

  }

  getBankValue(){
    return this.bankValue;
  }
  //  Logic to add tower +++++++++++++++++++++++
  canAddTower(cell) {
    // add conditions before allowing user to place turret
    // Some money required but also cannot place tower on a cell
    // of the grid that is occupied or is the root cell
    if(towerGame.placingTower) {
        if(!cell.occupied && !cell.hasTower && cell != towerGame.root){
          return true;
        }
      return(false);
    }
  }

  createTower(mtd) { // menu turret div
    // create a new tower object and add to array list
    // the menu tower div contains the parameters for the tower
  //  console.log("Bankvalue = " + this.bankValue);
  //  console.log("Cost = " + mtd.cost);
    if(this.bankValue >= mtd.cost){
      var tower = new Tower( mtd.cost, mtd.cnvTurImg, mtd.cnvBulImg, mtd.ability);
    //  console.log(mtd.cnvTurImg);
      if(tower) {
        this.towers.push(tower); // add tower to the end of the array of towers
        return(true);
        }
      else {
        println('failed to make tower');
      }
    }
    else alert("Insufficient Funds!");
    return(false);
  }

  placeTower(cell) {
    //  place tower into play area at center of cell
    towerGame.towers[towerGame.towers.length-1].loc = cell.center.copy();
//    console.log(towerGame.towers[towerGame.towers.length-1].loc.toString());
    //  tower needs to know if it is placed
    towerGame.towers[towerGame.towers.length-1].placed = true;
    cell.hasTower = true;
    //  only one tower placed at a time
    towerGame.placingTower = false;
    // placing a tower makes the cell containing the tower
    // unavailable to enemies the same as if it were
    // occupied (blocked)
    towerGame.brushfire(towerGame.undo(cell,towerGame.towers[towerGame.towers.length-1]));   // all new distances and parents
  }

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ load callbacks
  loadDOMCallBacks(menuTiles) {
    //  load tile menu callbacks
    for (var i = 0; i < menuTiles.length; i++) {
        var mtd = menuTiles[i];
        mtd.addEventListener('mouseover',this.tileRollOver,false);
        mtd.addEventListener('mouseout', this.tileRollOut, false);
        mtd.addEventListener('mousedown', this.tilePressed, false);
        mtd.addEventListener('click', this.tileClicked, false);
    }

  }

  //+++++++++++++++++++++++++   tile menu callbacks
  tileRollOver() {
    this.style.backgroundColor = '#f7e22a';
    towerGame.updateCostInfoElement(this.cost);
  }

  tileRollOut() {
    this.style.backgroundColor = '#DDD';
    towerGame.updateCostInfoElement("");
  }

  tilePressed() {
    this.style.backgroundColor = '#900';
  }

  tileClicked() {
    //if user clicks tile and not placing tile change placing to true
    // can add Tower checks cost and other conditions
    if(towerGame.placingTower === true) return;
    if(towerGame.createTower(this))
        towerGame.placingTower = true;



  }
//  ++++++++++++++++++++++++++++++++++++++++++++++++++    mouse handlers
  handleCNVMouseOver() {
    if(towerGame.towers.length < 1) return;
    towerGame.towers[towerGame.towers.length-1].visible = true;
  }

  handleCNVMouseMoved(event) {
    // add some properties to the canvas to track the mouse.
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
    if(towerGame.towers.length < 1) return;
    if(!towerGame.towers[towerGame.towers.length-1].placed &&
      towerGame.placingTower === true ){
        //follow mouse
        towerGame.towers[towerGame.towers.length-1].loc.x = this.mouseX;
        towerGame.towers[towerGame.towers.length-1].loc.y = this.mouseY;
//        console.log(this.mouseX + ", " + this.mouseY + ", " + towerGame.towers[towerGame.towers.length-1].loc.toString());
      }
  }

  handleCNVMouseClicked(event) {
    var row = Math.floor(event.offsetY/towerGame.w);
    var col = Math.floor(event.offsetX/towerGame.w);
    var cell = towerGame.grid[col][row];

    if(towerGame.placingTower && towerGame.canAddTower(cell)){
      towerGame.placeTower(cell);
    }

    else if(!towerGame.placingTower && !cell.hasTower) {
        // toggle the occupied property of the clicked cell
        if (!cell.occupied && towerGame.bankValue >= towerGame.wallCost){
            towerGame.bankValue -= towerGame.wallCost;
            cell.occupied = true;
        } else if(!cell.occupied) {
            alert("Insufficient Funds!");
            }
        else {
            towerGame.bankValue += towerGame.wallCost;
            cell.occupied = false;
        }
        towerGame.brushfire(towerGame.undo(cell));   // all new distances and parents
        }
  }

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //collision detection utilities
  distance(c0, c1){
      this.x0 = c0.x;
      this.y0 = c0.y;
      this.x1 = c1.x;
      this.y1 = c1.y;

      var dx = this.x1 - this.x0;
      var dy = this.y1 - this.y0;

      return Math.sqrt(dx * dx + dy * dy);

    }

    distanceXY(x0, y0, x1, y1){
      var dx = x1 - x0;
      var dy = y1 - y0;

      return Math.sqrt(dx * dx + dy * dy);
    }

    inRange(value, min, max){
      return value >= Math.min(min, max) && Math.max(min, max) <= Math.max(min, max);
    }

  //parameters:
  //loc1 = location vector of first circle
  //loc2 = location vector of second circle
  //rad1 = radius of first circle
  //rad2 = radius of second circle
    circleCollision(loc1, loc2, rad1, rad2){
      if(this.distance(loc1, loc2) <= rad1 + rad2){
        return true;
      }
    }

    //parameters:
    //x, y = locations of point
    //circx, circy = locations of circle
    //radius = radius of circle
    circlePointCollision(x, y, circx, circy, radius){
      if(this.distanceXY(x, y, circx, circy) < radius){
        return true;
      }
    }

    //parameters:
    //x, y = locations of point
    //loc = location vector of rectangle
    //rect width, height = width and height of rectangle
    rectanglePointCollision(x, y, loc, rectWidth, rectHeight){
      if(this.inRange(x, loc.x, loc.x + rectWidth) && inRange(y, loc.y, loc.y + rectHeight)){
        return true;
      }
    }


    range(min0, max0, min1, max1){
      return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1);
    }


    //parameters:
    //loc1 = location vector of first rectangle
    //loc2 = location vector of second rectangle
    rectangleCollision(loc1, rectWidth1, rectHeight1, loc2, rectWidth2, rectHeight2){
      if(this.range(loc1.x, loc1.x + rectWidth1, loc2.x, loc2.x + rectWidth2) &&
      this.range(loc1.y, loc1.y + rectHeight1, loc2.y, loc2.y + rectHeight2)){
    return true;
  }
    }

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Other
} // end Game class +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

window.onkeydown = function(e) {
  var code = e.keyCode ? e.keyCode : e.which;

  if (code == 85) { // u key
    if (towerGame.bankValue >= 800){
      var upgrade = prompt("Type rate to increase fire rate (costs 1000)\nType range to increase range (Costs 800)").toLowerCase();

      if ((upgrade == "range" && towerGame.bankValue >= 800) || (upgrade == "rate" && towerGame.bankValue >= 1000)){
        for (var i = 0; i < towerGame.towers.length; i++){
          var tower = towerGame.towers[i];
          if (upgrade === "rate"){
            tower.coolDown -= 200;
            towerGame.bankValue -= 1000;
          } else if (upgrade === "range"){
            tower.range += 200;
            towerGame.bankValue -= 800;
          } else {
            alert("Other options are invalid!");
          }
        }
      }
    } else {
      alert("Insufficient Funds!");
    }
  }
}
