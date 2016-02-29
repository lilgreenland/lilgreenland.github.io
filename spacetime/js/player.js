//object for player 0 and 1
var p = [];
//add player 0
p.push({
  health: 1, //1=100%  0.5 = 50%
  x: container.width * 0.1,
  y: container.height * 0.1,
  Vx: 0,
  Vy: 0,
  dir: 0, //direction of player
  r: 20, //needs to be the same as the player image radius
  accel: 0.3, //set in scale player function
  turnRate: 0.03,
  alive: true,
  lives: 5,
  keys: [65, 68, 87, 83, 49], //left, right, forward, back, fire
  color: "#ffcc99",
  lastFireCycle: 0, //used to keep track of last cycle you fired

  //gun attributes  all these vales are reset when player gets a guntype
  fireDelay: 4, //time between fire
  fireKnockBack: 0.2,
  B_type: 'none',
  B_dmg: 0.02,
  B_speed: 12,
  B_totalCycles: 200,
  B_r: 2,
  B_spread: 0,
  B_number: 1,
  B_friction: 1,
  B_penetrate: 0, //-1 explode, 0 bounce, 1 penetrate
  B_color: "white"
});
//add player 1
p.push({
  health: 1, //1=100%  0.5 = 50%
  x: container.width * 0.9,
  y: container.height * 0.9,
  Vx: 0,
  Vy: 0,
  dir: 0, //direction of player in radians
  r: 20, //needs to be the same as the player image radius
  accel: 0.3, //set in scale player function
  turnRate: 0.03,
  alive: true,
  lives: 1,
  keys: [37, 39, 38, 40, 80], //left, right, forward, back, fire
  color: "#ccffff",
  lastFireCycle: 0, //used to keep track of last cycle you fired

  //gun attributes  all these vales are reset when player gets a guntype
  fireDelay: 20, //time between bullets
  fireKnockBack: 0.2, //pushes the player back after each shot
  B_type: 'none',
  B_dmg: 0.2, //raw damage done per bullet, damage also comes from (radius-1)*speed*0.005
  B_speed: 8, //speed in pixels leaving the player, bullets also gain player's speed on fire
  B_totalCycles: 600, //time on map 60 = 1 second
  B_r: 5, //radius contributes to speed based damage, and bullet draw size
  B_spread: 0, //random spread in radians
  B_number: 1, //bullets per fire
  B_friction: 1, //slows bullets each cycle 1=no friction .99 = 1% slow each cycle
  B_penetrate: 0, //-1 explode, 0 bounce, 1 penetrate
  B_color: "white"
});
//scales player radius and acceleration  only called inside resize function
function scalePlayer() {
  for (var i = 0; i < 2; i++) {
    p[i].accel = 0.3 * physics.zoom; //scale player accleration
    p[i].r = physics.relativePlayerSize * physics.zoom; //scale calculated radius
    //scales player size
    document.getElementById('playersize' + i).setAttribute('transform', "scale(" + p[i].r / 20 + ")");
    physics.playerKnockBack = physics.zoom * 5;
  }
}

//check for player collision with map
function playerCollisionMap(i) {
  //check in future X-dir
  var pX;
  var pY;
  if (p[i].Vx > 0) { //find out direction
    pX = Math.floor((p[i].x + p[i].Vx + p[i].r) / container.width * physics.mapWidth);
  } else {
    pX = Math.floor((p[i].x + p[i].Vx - p[i].r) / container.width * physics.mapWidth);
  }
  pY = Math.floor(p[i].y / container.height * physics.mapHeight);
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
  if(p[i].lives < 1 && !physics.gameOver){
    physics.gameOver = true;
    ctx.font = container.width * 0.1 + "px Arial Black";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    if (i === 0){
      alert("BLUE player wins");
      console.log("player "+1+" wins");
    } else{
      alert("ORANGE player wins");
      console.log("player "+0+" wins");
    }
  }
  document.getElementById('player' + i).setAttribute('visibility', "hidden");
  document.getElementById('tail' + i).setAttribute('visibility', "hidden");
  setTimeout(function() {
    playerAlive(i);
  }, 4000); //respawn after ____milliseconds
}
//respawn after time is up.
function playerAlive(i) {
  if (physics.gameOver){
    location.reload();
  }
  document.getElementById('player' + i).setAttribute('visibility', "visible");
  p[i].alive = true;
  p[i].Vx = 0;
  p[i].Vy = 0;
  p[i].health = 1;
  p[i].lives--;
  //spawn player
  var j = 0;
  do { //give player random x and y, but if player spawns inside map try again
    p[i].y = container.height * Math.random();
    p[i].x = container.width * Math.random();
    j++;
  } while (j < 100 && map[1 + Math.floor(p[i].y / container.height * physics.mapHeight)][Math.floor((p[i].x + p[i].r) / container.width * physics.mapWidth)] || map[Math.floor((p[i].y) / container.height * physics.mapHeight) + 1][Math.floor((p[i].x - p[i].r) / container.width * physics.mapWidth)] || map[Math.floor((p[i].y + p[i].r) / container.height * physics.mapHeight) + 1][Math.floor((p[i].x) / container.width * physics.mapWidth)] || map[Math.floor((p[i].y - p[i].r) / container.height * physics.mapHeight) + 1][Math.floor((p[i].x) / container.width * physics.mapWidth)]);
}


//keeps track of mouse up or down
var mouseDown = 0;
document.addEventListener("mousedown", function() {
  mouseDown = true;
});
document.addEventListener("mouseup", function() {
  mouseDown = false;
});


function crossproduct(dir,xx,yy,dist){
  return (Math.cos(dir)*xx)-(Math.sin(dir)*yy)/dist;
}


function mouseControl(i) {
  //mouse fire
  if (mouseDown) {
    if (physics.cycle > p[i].lastFireCycle + p[i].fireDelay) {
      p[i].lastFireCycle = physics.cycle;
      p[i].Vx -= p[i].fireKnockBack * physics.zoom * Math.cos(p[i].dir);
      p[i].Vy -= p[i].fireKnockBack * physics.zoom * Math.sin(p[i].dir);
      bullet(i);
    }
  }
  var dif_Y = mousePos.y - p[i].y;
  var dif_X = mousePos.x - p[i].x;

  //point in mouse direction
  var crossProduct = crossproduct(p[i].dir,dif_X,dif_Y,Math.sqrt(dif_X*dif_X+dif_Y*dif_Y));

  var mouseAngle = Math.atan2(dif_Y, dif_X);
//    if (Math.abs(p[i].dir-mouseAngle) < p[i].turnRate*2){
    p[i].dir = mouseAngle;
//  } else{
//    if (crossProduct > 0){
//      p[i].dir -= p[i].turnRate;
//    } else {
//      p[i].dir += p[i].turnRate;
//    }
//  }

  //accelerate towards mouse
  if (dif_Y * dif_Y + dif_X * dif_X > physics.mouseControlRange * physics.mouseControlRange) {
    p[i].Vx += p[i].accel * Math.cos(p[i].dir);
    p[i].Vy += p[i].accel * Math.sin(p[i].dir);
    document.getElementById('tail' + i).setAttribute('visibility', "visible");
  } else {
    document.getElementById('tail' + i).setAttribute('visibility', "hidden");
  }
  //outlines mouse move range
  ctx.strokeStyle = "#222222";
  ctx.beginPath();
  ctx.arc(p[i].x, p[i].y, physics.mouseControlRange, 0, 2 * Math.PI);
  ctx.stroke();

}

//moves players when keys are pressed
function playerKeys(i) {
  if (keys[p[i].keys[0]]) { //rotate left
    p[i].dir -= p[i].turnRate;
  } else {
    if (keys[p[i].keys[1]]) { //rotate right
      p[i].dir += p[i].turnRate;
    }
  }
  if (keys[p[i].keys[2]]) { //forward thrust
    p[i].Vx += p[i].accel * Math.cos(p[i].dir);
    p[i].Vy += p[i].accel * Math.sin(p[i].dir);
    document.getElementById('tail' + i).setAttribute('visibility', "visible");
  } else if (keys[p[i].keys[3]]) { //backward thrust
    p[i].Vx += -0.5 * p[i].accel * Math.cos(p[i].dir);
    p[i].Vy += -0.5 * p[i].accel * Math.sin(p[i].dir);
    document.getElementById('tail' + i).setAttribute('visibility', "hidden");
  } else {
    document.getElementById('tail' + i).setAttribute('visibility', "hidden");
  }
  if (keys[p[i].keys[4]]) { //fire bullet
    if (physics.cycle > p[i].lastFireCycle + p[i].fireDelay) {
      p[i].lastFireCycle = physics.cycle;
      p[i].Vx -= p[i].fireKnockBack * physics.zoom * Math.cos(p[i].dir);
      p[i].Vy -= p[i].fireKnockBack * physics.zoom * Math.sin(p[i].dir);
      bullet(i);
    }
  }
}

function playerCollision(){
  if (p[0].alive && p[1].alive) {
    if ((p[0].x - p[1].x) * (p[0].x - p[1].x) + (p[0].y - p[1].y) * (p[0].y - p[1].y) < (p[0].r + p[1].r) * (p[0].r + p[1].r)) {
      p[0].Vx += physics.playerKnockBack * Math.cos(Math.atan2(p[0].y - p[1].y, p[0].x - p[1].x));
      p[0].Vy += physics.playerKnockBack * Math.sin(Math.atan2(p[0].y - p[1].y, p[0].x - p[1].x));
      p[1].Vx += physics.playerKnockBack * Math.cos(Math.atan2(p[1].y - p[0].y, p[1].x - p[0].x));
      p[1].Vy += physics.playerKnockBack * Math.sin(Math.atan2(p[1].y - p[0].y, p[1].x - p[0].x));
    }
  }
}


function playerLoop(i){
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
    document.getElementById('playerdir' + i).setAttribute('transform', "rotate(" + p[i].dir * 180/Math.PI + ")");
    //set player svg position
    document.getElementById('player' + i).setAttribute('transform', ' translate(' + p[i].x + ',' + p[i].y + ')');
}
