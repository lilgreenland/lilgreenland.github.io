/*    TODO
grey out ship center circle to show fire CD?
  or some other method

player collision
  Add in four point collision detection for ships to avoid being half inside map

procedurally generated maps
  use cellular automata rule to generate?

pop up damage numbers?

guns
  use switching for custom fire routines?
  option: area of effect damage on bullet explosion
  option: bullet heat seeking
  option: bullet thrust, like missiles.  player controlled, or heat seeking
  option: lasers
111
power ups
  add them
 
*/

//set boundries to the browser window's size

var container = {
  x: 0,
  y: 0,
  width: window.innerWidth,
  height: window.innerHeight
};
//set size of container to the window and reset canvas size to window
window.onresize = function(event) {
  container.height = window.innerHeight;
  container.width = window.innerWidth;
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
};
//setup canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
//set canvas to full window
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
//looks for key presses and logs them
var keys = [];
document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});
//object for game physics
var physics = {
    cycle: 0,
    friction: 0.96,
    wallBounce: 0.6,
    playerKnockBack: 5,
    maxSpeed: 20,
  }
  //limits a value to below maxspeed
function maxSpeed(speed) {
  if (speed > physics.maxSpeed) {
    return physics.maxSpeed;
  } else {
    return speed;
  }
}

//map array x,y  10x10 plus a top and bottom layer so 10x12
var map = [
  //top window is the off screen bounds
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  //bottom window boundry
];

//drawMap is called in the draw loop
//currently disabled
function drawMap() {
  ctx.fillStyle = "#a6a6a6";
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map.length; j++) {
      if (map[i][j]) {
        ctx.fillRect(j * 0.05 * container.width | 0, (i - 1) * 0.05 * container.height | 0, (0.05 * container.width + 1) | 0, (0.05 * container.height + 1) | 0); //  | 0 converts float to int for faster draw speeds
      }
    }
  };
}

//array of objects for bullets
var b = [];
//adds a new bullet object to array b  when player fires
function bullet(i) {
  for (var j = 0; j < p[i].B_number; j++) {
    b.push({
      x: p[i].x + (p[i].r + p[i].B_r) * Math.cos(p[i].dir * Math.PI / 180),
      y: p[i].y + (p[i].r + p[i].B_r) * Math.sin(p[i].dir * Math.PI / 180),
      r: p[i].B_r,
      Vx: p[i].Vx + p[i].B_speed * Math.cos((p[i].dir + p[i].B_spread * (Math.random() - 0.5)) * Math.PI / 180),
      Vy: p[i].Vy + p[i].B_speed * Math.sin((p[i].dir + p[i].B_spread * (Math.random() - 0.5)) * Math.PI / 180),
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
    r: 0.5 + Math.random() * 1.5,
    //velocity scales with how low player health is 
    Vx: p[i].Vx + 8 * Math.cos(angle) * Math.random(),
    Vy: p[i].Vy + 8 * Math.sin(angle) * Math.random(),
    //Vx: p[i].Vx + 5 * (Math.random() - 0.5),
    //Vy: p[i].Vy + 5 * (Math.random() - 0.5),
    friction: 0.97, // 1 means no friction
    dmg: 0,
    penetrate: 0,
    hitKnockBack: 0.5,
    color: p[i].color,
    cycle: 0,
    totalCycles: 70,
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
  accel: 0.3,
  turnRate: 2,
  alive: true,
  lives: 10,
  keys: [65, 68, 87, 83, 49], //left, right, forward, back, fire
  color: "#ffcc99",
  lastFireCycle: 0, //used to keep track of last cycle you fired
  //gun attributes
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
  accel: 0.3,
  turnRate: 2,
  alive: true,
  lives: 10,
  keys: [37, 39, 38, 40, 80], //left, right, forward, back, fire
  color: "#ccffff",
  lastFireCycle: 0, //used to keep track of last cycle you fired
  //gun attributes
  fireDelay: 20, //time between bullets
  fireKnockBack: 0.2,  //pushes the player back after each shot
  B_dmg: 0.2,   //raw damage done per bullet, damage also comes from (radius-1)^2*speed
  B_speed: 8,  //speed in pixels leaving the player, bullets also gain player's speed
  B_totalCycles: 600,  //time on map 60 = 1 second
  B_r: 5,  //radius-1 contributes to speed based damage, and bullet draw size
  B_spread: 0,  //random spread in degrees
  B_number: 1,  //bullets per fire
  B_friction: 1,  //slows bullets each cycle 1=no friction .99 = 1% slow each cycle
  B_penetrate: 0, //-1 explode, 0 bounce, 1 penetrate
});

function regularGun(i) {
  p[i].fireDelay = 10;
  p[i].fireKnockBack = 0.1;
  p[i].B_dmg = 0;
  p[i].B_speed = 8;
  p[i].B_totalCycles = 300;
  p[i].B_r = 2.5;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 1;
  p[i].B_penetrate = 0;
}

function autoGun(i) {
  p[i].fireDelay = 2;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0.03;
  p[i].B_speed = 30;
  p[i].B_totalCycles = 35;
  p[i].B_r = 1;
  p[i].B_spread = 5;
  p[i].B_number = 1;
  p[i].B_friction = 0.98;
  p[i].B_penetrate = 0;
}

function sniperGun(i) {
  p[i].fireDelay = 60;
  p[i].fireKnockBack = 1.5;
  p[i].B_dmg = 0;
  p[i].B_speed = 24;
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
  p[i].B_dmg = 0;
  p[i].B_speed = 2;
  p[i].B_totalCycles = 600;
  p[i].B_r = 20;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 1;
  p[i].B_penetrate = 1;
}

function shotGun(i) {
  p[i].fireDelay = 100;
  p[i].fireKnockBack = 7;
  p[i].B_dmg = 0;
  p[i].B_speed = 18;
  p[i].B_totalCycles = 120;
  p[i].B_r = 2;
  p[i].B_spread = 50;
  p[i].B_number = 10;
  p[i].B_friction = 0.98;
  p[i].B_penetrate = 0;
}

function waveGun(i) {
  p[i].fireDelay = 20;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0;
  p[i].B_speed = 7;
  p[i].B_totalCycles = 60;
  p[i].B_r = 1.2;
  p[i].B_spread = 13;
  p[i].B_number = 7;
  p[i].B_friction = 1.02;
  p[i].B_penetrate = 0;
}

//picks a random gun for each player at the start of the game
for (var i = 0; i < 2; i++) {
  switch (Math.ceil(Math.random() * 6)) {
    case 1:
      autoGun(i);
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
  }
}
//waveGun(1);
//autoGun(1);
//shotGun(0);
//sniperGun(0);
//spiritBombGun(0);
//regularGun(1)

//check for player collision with map
function playerCollisionMap(i) {
  //check in future X-dir
  if (p[i].Vx > 0) { //find out direction
    var pX = Math.floor((p[i].x + p[i].Vx + p[i].r) / container.width * 20);
  } else {
    var pX = Math.floor((p[i].x + p[i].Vx - p[i].r) / container.width * 20);
  }
  var pY = Math.floor(p[i].y / container.height * 20);
  if (map[pY + 1][pX]) {
    p[i].x -= p[i].Vx; //move back to last position
    p[i].Vx *= -1 * physics.wallBounce; //flip velocity
  }
  pX = Math.floor(p[i].x / container.width * 20);
  //check in future Y-dir
  if (p[i].Vy > 0) { //find out direction
    pY = Math.floor((p[i].y + p[i].Vy + p[i].r) / container.height * 20);
  } else {
    pY = Math.floor((p[i].y + p[i].Vy - p[i].r) / container.height * 20);
  }
  if (map[pY + 1][pX]) {
    p[i].y -= p[i].Vy; //move back to last position
    p[i].Vy *= -1 * physics.wallBounce; //flip velocity
  }
}
//when player life gets below zero
function playerDead(i) {
  for (var j = 0; j < 20; j++) {
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
  } while (j < 100 && map[1 + Math.floor(p[i].y / container.height * 20)][Math.floor((p[i].x + p[i].r) / container.width * 20)] || map[Math.floor((p[i].y) / container.height * 20) + 1][Math.floor((p[i].x - p[i].r) / container.width * 20)] || map[Math.floor((p[i].y + p[i].r) / container.height * 20) + 1][Math.floor((p[i].x) / container.width * 20)] || map[Math.floor((p[i].y - p[i].r) / container.height * 20) + 1][Math.floor((p[i].x) / container.width * 20)]);
  p[i].alive = true;
  p[i].Vx = 0;
  p[i].Vy = 0;
  p[i].health = 1;
  p[i].lives--
};

playerAlive(0); //this keeps players out of the map on spawn
playerAlive(1);

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
      p[i].Vx -= p[i].fireKnockBack * Math.cos(p[i].dir * Math.PI / 180);
      p[i].Vy -= p[i].fireKnockBack * Math.sin(p[i].dir * Math.PI / 180);
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
      //wall bounce X
      if (b[i].x > container.width - b[i].r) {
        b[i].x = container.width - b[i].r;
        b[i].Vx = -b[i].Vx * physics.wallBounce
      };
      if (b[i].x < container.x + b[i].r) {
        b[i].x = container.x + b[i].r;
        b[i].Vx = -b[i].Vx * physics.wallBounce;
      };
      //wallbounce Y 
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
        var arrayY = Math.floor(b[i].y / container.height * 20) + 1;
        var arrayX = Math.floor((b[i].x + b[i].Vx) / container.width * 20);
        if (map[arrayY][arrayX]) {
          b[i].Vx *= -1; //flip X velocity if touching map
        }
        arrayY = Math.floor((b[i].y + b[i].Vy) / container.height * 20) + 1;
        arrayX = Math.floor(b[i].x / container.width * 20);
        //check for out of bounds of array, oddly this seems to only matter for Y direction
        if (arrayY >= map.length || arrayY < 0) {
          b[i].cycle = b[i].totalCycles
        } else {
          if (map[arrayY][arrayX]) {
            b[i].Vy *= -1; //flip Y velocity if touching map
          }
        }
      } else if (b[i].penetrate === -1) {};
      //check for player collision and explode
      for (var j = 0; j < 2; j++) {
        if (p[j].alive) {
          if ((b[i].x - p[j].x) * (b[i].x - p[j].x) + (b[i].y - p[j].y) * (b[i].y - p[j].y) < (p[j].r + b[i].r)*(p[j].r + b[i].r)) {
            //damamge from relative velocity times raidus + dmg
            var damage = b[i].dmg + Math.sqrt((b[i].Vx - p[j].Vx) * (b[i].Vx - p[j].Vx) + (b[i].Vy - p[j].Vy) * (b[i].Vy - p[j].Vy)) * (b[i].r - 1) * 0.01;
            //velocity and raidus^2 based bullet knockback
            p[j].Vx += 0.01 * b[i].r * b[i].r * b[i].Vx;
            p[j].Vy += 0.01 * b[i].r * b[i].r * b[i].Vy;
            //explosion based bullet knockback
            p[j].Vx -= 2 * b[i].dmg * Math.cos(Math.atan2(b[i].y - p[j].y, b[i].x - p[j].x));
            p[j].Vy -= 2 * b[i].dmg * Math.sin(Math.atan2(b[i].y - p[j].y, b[i].x - p[j].x));
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
//move svg players off the screen
document.getElementById('player0').setAttribute('transform', ' translate(' + container.width * 0.2 + ',' + container.height * 0.7 + ')');
document.getElementById('player1').setAttribute('transform', ' translate(' + container.width * 0.8 + ',' + container.height * 0.7 + ')');

//instructions
ctx.fillStyle = "white";
ctx.font = container.width * 0.04 + "px Arial";
ctx.textAlign = "center";
ctx.fillText("click to begin", container.width * 0.5, container.height * 0.1);

//player 0 blue
ctx.fillStyle = "#ccffff";
ctx.textAlign = "end";
ctx.fillText("P = fire    arrows = move", container.width - 10, container.height * 0.9);

//player 1 orange
ctx.fillStyle = "#ffcc99";
ctx.textAlign = "start";
ctx.fillText("1 = fire    WASD = move", 10, container.height * 0.9);

ctx.fillStyle = "#ccffff";
ctx.font = container.width * 0.1 + "px Arial Black";
ctx.textAlign = "end";
ctx.fillText("SPACE", container.width * 0.5, container.height * 0.4);
ctx.textAlign = "start";
ctx.fillStyle = "#ffcc99";
ctx.fillText("  TIME", container.width * 0.5, container.height * 0.4);

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