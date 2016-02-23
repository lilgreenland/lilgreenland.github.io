/*    TODO
grey out ship center circle to show fire CD?
  or some other method

player collision
  Add in four point collision detection for ships to avoid being half inside map

procedurally generated maps
  use cellular automata rule to generate?

use switching for custom fire routines?
is it possible to have custom loops for different bullets types liek clones in scratch?

option: area of effect damage on bullet explosion
option: bullet heat seeking
option: bullet thrust, like missiles.  player controlled, or heat seeking
option: lasers

power ups
  add them

set a constant size ratio
  zoom in svg and canvas to scale with window size.
  
damage and maybe other things? seem to scale with size, they shouldn't

make it so sliders can't show up?

use max speed function after taking damage to help prevent out of bounds for an array

map block take damage and can die
  set them to a value for life and they drop on player hit
  
switch to around the world edge collision

destroy bullet if it spawns inside the map

mouse controls for one player to help with ghosting?
  or to make it 3 players

*/

//set boundries to the browser window's size
//object for game physics
var physics = {
  cycle: 0,
  friction: 0.96,
  wallBounce: 0.6,
  playerKnockBack: 5, //set in resize function
  maxSpeed: 20,
  mapColor: "#60696a",
  zoom: 1, //set in resize function
  //scales player/bullet size and acceleration, used in resize function
  relativeSize: 0.03, //small 0.01  ->   0.06 big
  relativePlayerSize: 15,
  mapWidth: 30, //number of blocks in maps width
  mapHeight: 30, //mapWidth:mapHeight defines the aspect ratio of the window  might need to be equal
  blockSize: 1,
  mapDepth: 9  // 1 is a full maze each higher number is one less depth
}

var container = {
  x: 0,
  y: 0,
  width: physics.mapWidth * 100, //size of container in pixels
  height: physics.mapHeight * 100,
};

//setup canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//set canvas and container to 98% of the width or height of the window at a 4:3 ratio
function resize() {
  if (window.innerWidth / window.innerHeight > physics.mapWidth / physics.mapHeight) {
    container.width = window.innerHeight * physics.mapWidth / physics.mapHeight;
    container.height = container.width * physics.mapHeight / physics.mapWidth;
  } else {
    container.height = window.innerWidth * physics.mapHeight / physics.mapWidth;
    container.width = container.height * physics.mapWidth / physics.mapHeight;
  }
  //set min size
  if (container.width < 400) {
    container.width = 400;
    container.height = container.width * physics.mapHeight / physics.mapWidth;
  }
  ctx.canvas.width = container.width;
  ctx.canvas.height = container.height;
  //sets the relative size of the player
  physics.zoom = container.width / physics.mapWidth * physics.relativeSize;
  physics.blockSize = container.width / physics.mapWidth
  scalePlayer();
};

//run update canvas size and containter size on window resize
window.onresize = function(event) {
  resize();
};

//looks for key presses and logs them
var keys = [];
document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});

//map array for somereason needs to have all the arrays set up
/*var map = [
  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0],  [0]
];
//fill with zeros
function mapZeros() {
  for (var i = 0; i < physics.mapHeight; i++) {
    for (var j = 0; j < physics.mapWidth; j++) {
      map[i][j] = 0;
    }
  }
}
function chooseOrientation(width, height){
  if (width<height){
    return "horizontal"
  } else if (height<width){
    return "vertical"
  } else if (Math.random() > 0.5 ){
      return "vertical"
  } else {
    return "horizontal"
  }
}
function recursiveDivision() {
  for(var i = 0; i<physics.mapHeight;i++){
    map[i][Math.ceil(physics.mapWidth*0.5)] = 1;
  }
  var holeY = Math.ceil(Math.random()*physics.mapHeight)
  var holeX = Math.ceil(physics.mapWidth*0.5)
  for (var j = 0; j<5; j++){
    map[holeY+j][holeX] = 0  
  }
}
mapZeros()
//recursiveDivision()
//generate random map   
function randomMap() {
  for (var i = 0; i < physics.mapHeight+1; i++) {
    for (var j = 0; j < physics.mapWidth+1; j++) {
      map[i][j] = Math.floor(Math.random() + 0.05);
    }
  }
}
//randomMap()
*/

//build map with  Maze "Recursive Division" algorithm 
var grid;
function generate(dimensions, numDoors) {
  grid = new Array();
  for (var i = 0; i < dimensions; i++) {
    grid[i] = new Array();
    for (var j = 0; j < dimensions; j++) {
      grid[i][j] = 0;
    }
  }
  //addOuterWalls();
  addInnerWalls(true, 1, grid.length - 0, 1, grid.length - 2);
}
function addOuterWalls() {
  for (var i = 0; i < grid.length; i++) {
    if (i == 0 || i == (grid.length - 1)) {
      for (var j = 0; j < grid.length; j++) {
        grid[i][j] = 1;
      }
    } else {
      grid[i][0] = 1;
      grid[i][grid.length - 1] = 1;
    }
  }
}
function addInnerWalls(h, minX, maxX, minY, maxY) {
  if (h) {
    if (maxX - minX < 1) {
      return;
    }
    var y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
    addHWall(minX, maxX, y);
    addInnerWalls(!h, minX, maxX, minY, y - 1);
    addInnerWalls(!h, minX, maxX, y + 1, maxY);
  } else {
    if (maxY - minY < physics.mapDepth) {
      return;
    }
    var x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
    addVWall(minY, maxY, x);
    addInnerWalls(!h, minX, x - 1, minY, maxY);
    addInnerWalls(!h, x + 1, maxX, minY, maxY);
  }
}
function addHWall(minX, maxX, y) {
  var hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;
  for (var i = minX; i <= maxX; i++) {
    if (i == hole  || i == hole+1|| i == hole-1) grid[y][i] = 0;
    //if (i == hole) grid[y][i] = 0;
    else grid[y][i] = 1;
  }
}
function addVWall(minY, maxY, x) {
  var hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;
  for (var i = minY; i <= maxY; i++) {
    if (i == hole || i == hole+1|| i == hole-1) grid[i][x] = 0;
    //if (i == hole) grid[i][x] = 0;
    else grid[i][x] = 1;
  }
}
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
generate(physics.mapWidth, 0);

var map = grid;
function setupMap() {
  var array1 = []
  for (var i = 0; i < physics.mapWidth; i++) {
    array1.push(1);
  }
  //adding a top and bottom layer seems to help prevent out of bounds checks in other parts of the game
  map.splice(0, 0, array1);
  map.splice(map.length, 0, array1);
  
}
setupMap()

//drawMap is called in the draw loop
//currently disabled
function drawMap() {
  ctx.fillStyle = physics.mapColor;
  for (var i = 0; i < physics.mapHeight + 1; i++) {
    for (var j = 0; j < physics.mapWidth; j++) {
      if (map[i][j]) {
        ctx.fillRect(j / physics.mapWidth * container.width | 0, (i - 1) / physics.mapHeight * container.height | 0, (physics.blockSize + 1) | 0, (physics.blockSize + 1) | 0); //  | 0 converts float to int for faster draw speeds
      }
    }
  }
}

//array of objects for bullets
var b = [];
//adds a new bullet object to array b  when player fires
function bullet(i) {
  for (var j = 0; j < p[i].B_number; j++) {
    b.push({
      x: p[i].x + (p[i].r + p[i].B_r * physics.zoom) * Math.cos(p[i].dir * Math.PI / 180),
      y: p[i].y + (p[i].r + p[i].B_r * physics.zoom) * Math.sin(p[i].dir * Math.PI / 180),
      r: p[i].B_r * physics.zoom,
      Vx: p[i].Vx + p[i].B_speed * physics.zoom * Math.cos((p[i].dir + p[i].B_spread * (Math.random() - 0.5)) * Math.PI / 180),
      Vy: p[i].Vy + p[i].B_speed * physics.zoom * Math.sin((p[i].dir + p[i].B_spread * (Math.random() - 0.5)) * Math.PI / 180),
      friction: p[i].B_friction,
      dmg: p[i].B_dmg,
      penetrate: p[i].B_penetrate,
      color: "white",
      cycle: 0,
      totalCycles: p[i].B_totalCycles,
      alive: true,
    })
  }
};
//special bullets that spawn when a player dies
function debris(i) {
  var angle = Math.random() * 2 * Math.PI;
  b.push({
    x: p[i].x,
    y: p[i].y,
    r: 0.5 + Math.random() * 2 * physics.zoom,
    //velocity scales with how low player health is 
    Vx: p[i].Vx + 15 * physics.zoom * Math.cos(angle) * Math.random(),
    Vy: p[i].Vy + 15 * physics.zoom * Math.sin(angle) * Math.random(),
    //Vx: p[i].Vx + 5 * (Math.random() - 0.5),
    //Vy: p[i].Vy + 5 * (Math.random() - 0.5),
    friction: 0.96, // 1 means no friction
    dmg: 0,
    penetrate: 0,
    hitKnockBack: 0.5,
    color: p[i].color,
    cycle: 0,
    totalCycles: 100,
    alive: true,
  })
};

//object for player 0 and 1
var p = [];
//add player 0
p.push({
  health: 1, //1=100%  0.5 = 50%
  x: container.width * 0.1,
  y: container.height * 0.1,
  Vx: 0,
  Vy: 0,
  dir: 45, //direction of player
  r: 20, //needs to be the same as the player image radius
  accel: 0.3, //set in scale player function
  turnRate: 2,
  alive: true,
  lives: 10,
  keys: [65, 68, 87, 83, 49], //left, right, forward, back, fire
  color: "#ffcc99",
  lastFireCycle: 0, //used to keep track of last cycle you fired

  //gun attributes  all these vales are reset when player gets a guntype
  fireDelay: 4, //time between fire
  fireKnockBack: 0.2,
  B_dmg: 0.02,
  B_speed: 12,
  B_totalCycles: 200,
  B_r: 2,
  B_spread: 0,
  B_number: 1,
  B_friction: 1,
  B_penetrate: 0, //-1 explode, 0 bounce, 1 penetrate
});
//add player 1
p.push({
  health: 1, //1=100%  0.5 = 50%
  x: container.width * 0.9,
  y: container.height * 0.9,
  Vx: 0,
  Vy: 0,
  dir: 225, //direction of player
  r: 20, //needs to be the same as the player image radius
  accel: 0.3, //set in scale player function
  turnRate: 2,
  alive: true,
  lives: 10,
  keys: [37, 39, 38, 40, 80], //left, right, forward, back, fire
  color: "#ccffff",
  lastFireCycle: 0, //used to keep track of last cycle you fired

  //gun attributes  all these vales are reset when player gets a guntype
  fireDelay: 20, //time between bullets
  fireKnockBack: 0.2, //pushes the player back after each shot
  B_dmg: 0.2, //raw damage done per bullet, damage also comes from (radius-1)*speed*0.005
  B_speed: 8, //speed in pixels leaving the player, bullets also gain player's speed on fire
  B_totalCycles: 600, //time on map 60 = 1 second
  B_r: 5, //radius contributes to speed based damage, and bullet draw size
  B_spread: 0, //random spread in degrees
  B_number: 1, //bullets per fire
  B_friction: 1, //slows bullets each cycle 1=no friction .99 = 1% slow each cycle
  B_penetrate: 0, //-1 explode, 0 bounce, 1 penetrate
});
//scales player radius and acceleration  only called inside resize function
function scalePlayer() {
  for (var i = 0; i < 2; i++) {
    p[i].accel = 0.3 * physics.zoom //scale player accleration
    p[i].r = physics.relativePlayerSize * physics.zoom; //scale calculated radius
    //scales player size
    document.getElementById('playersize' + i).setAttribute('transform', "scale(" + p[i].r / 20 + ")");
    physics.playerKnockBack = physics.zoom * 5
  }
}

function regularGun(i) {
  p[i].fireDelay = 10;
  p[i].fireKnockBack = 0.1;
  p[i].B_dmg = 0.05;
  p[i].B_speed = 8;
  p[i].B_totalCycles = 300;
  p[i].B_r = 2.5;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 1;
  p[i].B_penetrate = 0;
}

function beamGun(i) {
  p[i].fireDelay = 1;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0.016;
  p[i].B_speed = 10;
  p[i].B_totalCycles = 70;
  p[i].B_r = 1;
  p[i].B_spread = 3;
  p[i].B_number = 1;
  p[i].B_friction = 1;
  p[i].B_penetrate = 0;
}

function sniperGun(i) {
  p[i].fireDelay = 60;
  p[i].fireKnockBack = 1.5;
  p[i].B_dmg = 0.3;
  p[i].B_speed = 27;
  p[i].B_totalCycles = 200;
  p[i].B_r = 4.5;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 0.99;
  p[i].B_penetrate = 0;
}

function spiritBombGun(i) {
  p[i].fireDelay = 140;
  p[i].fireKnockBack = 1;
  p[i].B_dmg = 0.5;
  p[i].B_speed = 2;
  p[i].B_totalCycles = 600;
  p[i].B_r = 20;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 1;
  p[i].B_penetrate = 1;
}

function shotGun(i) {
  p[i].fireDelay = 80;
  p[i].fireKnockBack = 7;
  p[i].B_dmg = 0.04;
  p[i].B_speed = 18;
  p[i].B_totalCycles = 135;
  p[i].B_r = 2;
  p[i].B_spread = 35;
  p[i].B_number = 10;
  p[i].B_friction = 0.985;
  p[i].B_penetrate = 0;
}

function waveGun(i) {
  p[i].fireDelay = 23;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0.02;
  p[i].B_speed = 8;
  p[i].B_totalCycles = 100;
  p[i].B_r = 1.2;
  p[i].B_spread = 10;
  p[i].B_number = 13;
  p[i].B_friction = 1;
  p[i].B_penetrate = 0;
}

function rocketGun(i) {
  p[i].fireDelay = 0;
  p[i].fireKnockBack = 0.36;
  p[i].B_dmg = 0.03;
  p[i].B_speed = 10;
  p[i].B_totalCycles = 100;
  p[i].B_r = 1;
  p[i].B_spread = 12;
  p[i].B_number = 1;
  p[i].B_friction = 0.98;
  p[i].B_penetrate = 0;
}

function whipGun(i) {
  p[i].fireDelay = 0;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0.02;
  p[i].B_speed = 7;
  p[i].B_totalCycles = 50;
  p[i].B_r = 1;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 0.99;
  p[i].B_penetrate = 1;
}

//picks a random gun for each player at the start of the game
for (var i = 0; i < 2; i++) {
  switch (Math.ceil(Math.random() * 8)) {
    case 1:
      beamGun(i);
      break;
    case 2:
      shotGun(i);
      break;
    case 3:
      sniperGun(i)
      break;
    case 4:
      spiritBombGun(i);
      break;
    case 5:
      regularGun(i);
      break;
    case 6:
      waveGun(i);
      break;
    case 7:
      rocketGun(i);
      break;
    case 8:
      whipGun(i);
      break;
  }
}
//whipGun(0);
//waveGun(1);
//beamGun(1);
//shotGun(0);
//sniperGun(0);
//spiritBombGun(0);
//regularGun(1)
//rocketGun(1);

//check for player collision with map
function playerCollisionMap(i) {
  //check in future X-dir
  if (p[i].Vx > 0) { //find out direction
    var pX = Math.floor((p[i].x + p[i].Vx + p[i].r) / container.width * physics.mapWidth);
  } else {
    var pX = Math.floor((p[i].x + p[i].Vx - p[i].r) / container.width * physics.mapWidth);
  }
  var pY = Math.floor(p[i].y / container.height * physics.mapHeight);
  if (map[pY + 1][pX]) {
    p[i].x -= p[i].Vx; //move back to last position
    p[i].Vx *= -1 * physics.wallBounce; //flip velocity
  }
  pX = Math.floor(p[i].x / container.width * physics.mapWidth);
  //check in future Y-dir
  if (p[i].Vy > 0) { //find out direction
    pY = Math.floor((p[i].y + p[i].Vy + p[i].r) / container.height * physics.mapHeight);
  } else {
    pY = Math.floor((p[i].y + p[i].Vy - p[i].r) / container.height * physics.mapHeight);
  }
  if (map[pY + 1][pX]) {
    p[i].y -= p[i].Vy; //move back to last position
    p[i].Vy *= -1 * physics.wallBounce; //flip velocity
  }
}
//when player life gets below zero
function playerDead(i) {
  for (var j = 0; j < 50; j++) {
    debris(i);
  }
  p[i].alive = false;
  p[i].x = 0;
  p[i].y = 0;
  document.getElementById('player' + i).setAttribute('visibility', "hidden");
  document.getElementById('tail' + i).setAttribute('visibility', "hidden");
  setTimeout(function() {
    playerAlive(i);
  }, 4000); //respawn after ____milliseconds
}
//respawn after time is up.
function playerAlive(i) {
  document.getElementById('player' + i).setAttribute('visibility', "visible");
  var j = 0
  do { //give player random x and y, but if player spawns inside map try again
    p[i].y = container.height * Math.random();
    p[i].x = container.width * Math.random();
    j++
  } while (j < 100 && map[1 + Math.floor(p[i].y / container.height * physics.mapHeight)][Math.floor((p[i].x + p[i].r) / container.width * physics.mapWidth)] || map[Math.floor((p[i].y) / container.height * physics.mapHeight) + 1][Math.floor((p[i].x - p[i].r) / container.width * physics.mapWidth)] || map[Math.floor((p[i].y + p[i].r) / container.height * physics.mapHeight) + 1][Math.floor((p[i].x) / container.width * physics.mapWidth)] || map[Math.floor((p[i].y - p[i].r) / container.height * physics.mapHeight) + 1][Math.floor((p[i].x) / container.width * physics.mapWidth)]);
  p[i].alive = true;
  p[i].Vx = 0;
  p[i].Vy = 0;
  p[i].health = 1;
  p[i].lives--
};

//moves players when keys are pressed
function playerKeys(i) {
  if (keys[p[i].keys[0]]) { //rotate left
    p[i].dir -= p[i].turnRate;
  } else {
    if (keys[p[i].keys[1]]) { //rotate right
      p[i].dir += p[i].turnRate;
    }
  };
  if (keys[p[i].keys[2]]) { //forward thrust
    p[i].Vx += p[i].accel * Math.cos(p[i].dir * Math.PI / 180);
    p[i].Vy += p[i].accel * Math.sin(p[i].dir * Math.PI / 180);
    document.getElementById('tail' + i).setAttribute('visibility', "visible");
  } else if (keys[p[i].keys[3]]) { //backward thrust
    p[i].Vx += -0.5 * p[i].accel * Math.cos(p[i].dir * Math.PI / 180);
    p[i].Vy += -0.5 * p[i].accel * Math.sin(p[i].dir * Math.PI / 180);
    document.getElementById('tail' + i).setAttribute('visibility', "hidden");
  } else {
    document.getElementById('tail' + i).setAttribute('visibility', "hidden");
  }
  if (keys[p[i].keys[4]]) { //fire bullet
    if (physics.cycle > p[i].lastFireCycle + p[i].fireDelay) {
      p[i].lastFireCycle = physics.cycle;
      p[i].Vx -= p[i].fireKnockBack * physics.zoom * Math.cos(p[i].dir * Math.PI / 180);
      p[i].Vy -= p[i].fireKnockBack * physics.zoom * Math.sin(p[i].dir * Math.PI / 180);
      bullet(i);
    }
  }

};

//main loop
function draw() {
  // keeps track of cycle
  physics.cycle++;
  //clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); //normal clear

  /*if (physics.cycle%5 === 0){  //fun delay wipe effect
  ctx.fillStyle = "#000000";
  ctx.globalAlpha = 0.2;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalAlpha = 1;
  }*/

  //draw map
  drawMap();

  //player life bars
  ctx.font = "20px Arial";
  ctx.globalAlpha = 0.9;
  //player 0 red
  ctx.fillStyle = p[1].color;
  ctx.fillRect((ctx.canvas.width - p[1].health * 200) | 0, 0, (p[1].health * 200) | 0, 20);
  ctx.textAlign = "end";
  ctx.fillText(p[1].lives, ctx.canvas.width - 2, 40);
  //player 1 blue
  ctx.fillStyle = p[0].color;
  ctx.fillRect(0, 0, (p[0].health * 200) | 0, 20);
  ctx.textAlign = "start";
  ctx.fillText(p[0].lives, 2, 40);
  ctx.globalAlpha = 1;
  //bullet loop
  i = b.length;
  while (i--) {
    //check if active or exploding
    if (b[i].alive) {
      //friction slows the bullet by a few percet each cycle
      b[i].Vx *= b[i].friction;
      b[i].Vy *= b[i].friction;
      //velocity moves the position every cycle
      b[i].x += b[i].Vx;
      b[i].y += b[i].Vy;
      //edge bounce X
      if (b[i].x > container.width - b[i].r) {
        b[i].x = container.width - b[i].r;
        b[i].Vx = -b[i].Vx * physics.wallBounce
      };
      if (b[i].x < container.x + b[i].r) {
        b[i].x = container.x + b[i].r;
        b[i].Vx = -b[i].Vx * physics.wallBounce;
      };
      //edge bounce Y 
      if (b[i].y > container.height - b[i].r) {
        b[i].y = container.height - b[i].r;
        b[i].Vy = -b[i].Vy * physics.wallBounce
      };
      if (b[i].y < container.y + b[i].r) {
        b[i].y = container.y + b[i].r;
        b[i].Vy = -b[i].Vy * physics.wallBounce;
      };

      //map collision detection (this needs to come after wall bounce to prevent out of array checks)
      if (b[i].penetrate === 0) {
        var arrayY = Math.floor(b[i].y / container.height * physics.mapHeight) + 1;
        var arrayX = Math.floor((b[i].x + b[i].Vx) / container.width * physics.mapWidth);
        if (map[arrayY][arrayX]) {
          b[i].Vx *= -1; //flip X velocity if touching map
        } else {
          arrayY = Math.floor((b[i].y + b[i].Vy) / container.height * physics.mapHeight) + 1;
          arrayX = Math.floor(b[i].x / container.width * physics.mapWidth);
          //check for out of bounds of array, oddly this seems to only matter for Y direction
          if (arrayY >= map.length || arrayY < 0) {
            b[i].cycle = b[i].totalCycles
          } else {
            if (map[arrayY][arrayX]) {
              b[i].Vy *= -1; //flip Y velocity if touching map
            }
          }
        }
      } else if (b[i].penetrate === -1) {};
      //check for player collision and explode
      for (var j = 0; j < 2; j++) {
        if (p[j].alive) {
          if ((b[i].x - p[j].x) * (b[i].x - p[j].x) + (b[i].y - p[j].y) * (b[i].y - p[j].y) < (p[j].r + b[i].r) * (p[j].r + b[i].r)) {
            //damamge from relative velocity times raidus + dmg
            var damage = b[i].dmg + Math.sqrt((b[i].Vx - p[j].Vx) * (b[i].Vx - p[j].Vx) + (b[i].Vy - p[j].Vy) * (b[i].Vy - p[j].Vy)) * (Math.abs(b[i].r - 1)) * 0.005 / physics.zoom;
            //velocity and raidus^2 based bullet knockback
            p[j].Vx += 0.01 * b[i].r * b[i].r * b[i].Vx;
            p[j].Vy += 0.01 * b[i].r * b[i].r * b[i].Vy;
            //explosion based bullet knockback
            //p[j].Vx -= 2 * b[i].dmg * Math.cos(Math.atan2(b[i].y - p[j].y, b[i].x - p[j].x));
            //p[j].Vy -= 2 * b[i].dmg * Math.sin(Math.atan2(b[i].y - p[j].y, b[i].x - p[j].x));
            //lower player health
            p[j].health -= damage;
            //check if player dead
            if (p[j].health < 0) {
              playerDead(j)
            };
            //switch bullet to explosion
            b[i].color = "red";
            //make radius proportional to damage done from speed*Radius + dmg
            b[i].r = Math.abs(damage * 100);
            b[i].cycle = b[i].totalCycles - 5; // end bullet in a few cycles
            b[i].x -= b[i].Vx; //back up bullet position for looks
            b[i].y -= b[i].Vy;
            b[i].alive = false;
            j++ //ends the loop so the bullet can't hit the second player sometimes
          };
        };
      };
    }
    //draw bullet
    ctx.fillStyle = b[i].color;
    ctx.beginPath()
    ctx.arc(b[i].x | 0, b[i].y | 0, b[i].r, 0, 2 * Math.PI);
    ctx.fill();
    //remove bullet after totalcycles
    b[i].cycle++;
    if (b[i].cycle > b[i].totalCycles) {
      //this splice must be the final check for the bulllet array
      //otherwise you reference an array location that doesn't exist
      b.splice(i, 1); //removes bullet from array
    }
  }; //end bullet loop

  //player to player collision
  if (p[0].alive && p[1].alive) {
    if ((p[0].x - p[1].x) * (p[0].x - p[1].x) + (p[0].y - p[1].y) * (p[0].y - p[1].y) < (p[0].r + p[1].r) * (p[0].r + p[1].r)) {
      p[0].Vx += physics.playerKnockBack * Math.cos(Math.atan2(p[0].y - p[1].y, p[0].x - p[1].x));
      p[0].Vy += physics.playerKnockBack * Math.sin(Math.atan2(p[0].y - p[1].y, p[0].x - p[1].x));
      p[1].Vx += physics.playerKnockBack * Math.cos(Math.atan2(p[1].y - p[0].y, p[1].x - p[0].x));
      p[1].Vy += physics.playerKnockBack * Math.sin(Math.atan2(p[1].y - p[0].y, p[1].x - p[0].x));
    };
  };
  //player 0,1 control loop
  for (var i = 0; i < 2; i++) {
    //only if each player is alive
    if (p[i].alive) {
      playerCollisionMap(i)
        //key checks
      playerKeys(i);
      //friction
      p[i].Vx *= physics.friction;
      p[i].Vy *= physics.friction;
      //move
      p[i].x += p[i].Vx;
      p[i].y += p[i].Vy;

      //wall bounce X
      if (p[i].x > container.width - p[i].r) {
        p[i].x = container.width - p[i].r;
        p[i].Vx = -p[i].Vx * physics.wallBounce;
      }
      if (p[i].x < container.x + p[i].r) {
        p[i].x = container.x + p[i].r;
        p[i].Vx = -p[i].Vx * physics.wallBounce;
      }
      //wallbounce Y 
      if (p[i].y > container.height - p[i].r) {
        p[i].y = container.height - p[i].r;
        p[i].Vy = -p[i].Vy * physics.wallBounce;
      }
      if (p[i].y < container.y + p[i].r) {
        p[i].y = container.y + p[i].r;
        p[i].Vy = -p[i].Vy * physics.wallBounce;
      }
      //set player svg rotation
      document.getElementById('playerdir' + i).setAttribute('transform', "rotate(" + p[i].dir + ")");
      //set player svg position
      document.getElementById('player' + i).setAttribute('transform', ' translate(' + p[i].x + ',' + p[i].y + ')');
    }
  } //end player loop
  //log info to console
  //console.log("p1.x = " + p[1].x.toFixed(5).substring(0, 5) + ", p1.y = " + p[1].y.toFixed(5).substring(0, 5) + "  |  p1.Vx = " + p[1].Vx.toFixed(5).substring(0, 5) + ", p1.Vy = " + p[1].Vy.toFixed(5).substring(0, 5) + " | p1.dir = " + p[1].dir.toFixed(5).substring(0, 5));
  //calls the loop recursively
  requestAnimationFrame(draw);
}
//pregame setup
//scale canvas
resize();
//spawn players
playerAlive(0);
playerAlive(1);
//move svg players off the screen
document.getElementById('player0').setAttribute('transform', ' translate(' + container.width * 0.2 + ',' + container.height * 0.7 + ')');
document.getElementById('player1').setAttribute('transform', ' translate(' + container.width * 0.8 + ',' + container.height * 0.7 + ')');

ctx.globalAlpha = 0.3;
//instructions
ctx.fillStyle = "#808080";
ctx.font = container.width * 0.03 + "px Arial Black";
ctx.textAlign = "center";
ctx.fillText("click to begin", container.width * 0.5, container.height * 0.1);

//player 0 blue
ctx.fillStyle = "#ccffff";
ctx.textAlign = "end";
ctx.fillText("P   &   ARROWS  ", container.width - 10, container.height * 0.9);

//player 1 orange
ctx.fillStyle = "#ffcc99";
ctx.textAlign = "start";
ctx.fillText("KEYS:   1   &   WASD", 10, container.height * 0.9);

ctx.globalAlpha = 1;
ctx.font = container.width * 0.15 + "px Arial Black";
ctx.textAlign = "center";
ctx.fillStyle = "#334d4d";
ctx.fillText("ENTROPY", container.width * 0.5, container.height * 0.4);
ctx.fillText("ENTROPY", container.width * 0.5 + 1, container.height * 0.4 + 1);
ctx.fillText("ENTROPY", container.width * 0.5 + 2, container.height * 0.4 + 2);
ctx.fillText("ENTROPY", container.width * 0.5 + 3, container.height * 0.4 + 3);
ctx.fillText("ENTROPY", container.width * 0.5 + 4, container.height * 0.4 + 4);
ctx.fillText("ENTROPY", container.width * 0.5 + 5, container.height * 0.4 + 5);
ctx.fillText("ENTROPY", container.width * 0.5 + 6, container.height * 0.4 + 6);
ctx.fillStyle = "#253636";
ctx.fillText("ENTROPY", container.width * 0.5 + 7, container.height * 0.4 + 7);

//stops the game from running several loops
var begin = false;

function beginLoop() {
  if (!begin) {
    begin = true
    document.getElementById("body").style.cursor = "none"; //hides mouse
    requestAnimationFrame(draw);
  };
};
//starts main loop
document.body.addEventListener('click', beginLoop, true);