/*    TODO

player spawning
  Fix spawing inside map (it seems like it doesn't work)
    add in a check for each point of the object
  
player collision
  Add in four point collision detection for ships to avoid being half inside map

bullet map collision
  add velocity dependant radius addition like player collision

guns
  use switching for custom fire routines?
  option: no bounce
  option: area of effect damage on bullet explosion
  option: bullet heat seeking
  option: bullet thrust, like missiles.  player controlled, or heat seeking
  option: lasers
  option: map penetration
  option: speed based damage
  option: fiction/bounce based on bullet not map

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
    maxSpeed: 3,
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
  ctx.fillStyle = "lightgrey";
  for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map.length; j++) {
      if (map[i][j]) {
        ctx.fillRect(j * 0.05 * container.width, (i - 1) * 0.05 * container.height, 0.05 * container.width + 1, 0.05 * container.height + 1);
      }
    }
  };
}

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
      color: "white",
      cycle: 0,
      totalCycles: p[i].B_totalCycles,
      alive: true,
    })
  }
};

//special bullets the spawn when a player dies
function debris(i) {
  b.push({
    x: p[i].x,
    y: p[i].y,
    r: 1+Math.random() * 2,
    Vx: p[i].Vx + 20 * (Math.random() - 0.5),
    Vy: p[i].Vx + 20 * (Math.random() - 0.5),
    friction: 0.95, // 1 means no friction
    dmg: 0.01,
    hitKnockBack: 0.5,
    color: "grey",
    cycle: 0,
    totalCycles: 25,
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
  Vx: 5,
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
});
//add player 1
p.push({
  health: 1, //1=100%  0.5 = 50%
  x: container.width * 0.9,
  y: container.height * 0.9,
  Vx: 5,
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
  fireKnockBack: 0.2,
  B_dmg: 0.2,
  B_speed: 8,
  B_totalCycles: 600,
  B_r: 5,
  B_spread: 0,
  B_number: 1,
  B_friction: 1,
});

function autoGun(i) {
  p[i].fireDelay = 2;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0.03;
  p[i].B_speed = 22;
  p[i].B_totalCycles = 32;
  p[i].B_r = 1;
  p[i].B_spread = 10;
  p[i].B_number = 1;
  p[i].B_friction = 0.98;
}
p

function sniperGun(i) {
  p[i].fireDelay = 60;
  p[i].fireKnockBack = 1.5;
  p[i].B_dmg = 0;
  p[i].B_speed = 25;
  p[i].B_totalCycles = 200;
  p[i].B_r = 4;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 1;
}

function spiritBombGun(i) {
  p[i].fireDelay = 100;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 1.5
  p[i].B_speed = 3;
  p[i].B_totalCycles = 600;
  p[i].B_r = 20;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 1;
}

function shotGun(i) {
  p[i].fireDelay = 90;
  p[i].fireKnockBack = 2;
  p[i].B_dmg = 0.02;
  p[i].B_speed = 22;
  p[i].B_totalCycles = 135;
  p[i].B_r = 2;
  p[i].B_spread = 50;
  p[i].B_number = 7;
  p[i].B_friction = 0.975;
}

function accelGun(i) {
  p[i].fireDelay = 10;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0.15;
  p[i].B_speed = 3.6;
  p[i].B_totalCycles = 120;
  p[i].B_r = 3;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 1.02;
}

autoGun(1);
shotGun(0);
//sniperGun(0);
//spiritBombGun(0);
//accelGun(1)

function bulletCollisionMap(i) {
  //check in future X-dir
  var bX = Math.floor((b[i].x + b[i].Vx) / container.width * 20);
  var bY = Math.floor(b[i].y / container.height * 20);
  if (map[bY + 1][bX]) {
    //b[i].x -= b[i].Vx;  //stops bullet from creeping into wall  probably not needed
    b[i].Vx *= -1 * physics.wallBounce;
  }
  bX = Math.floor(b[i].x / container.width * 20);
  bY = Math.floor((b[i].y + b[i].Vy) / container.height * 20);
  if (map[bY + 1][bX]) {
    //b[i].y -= b[i].Vy;  //stops bullet from creeping into wall  probably not needed
    b[i].Vy *= -1 * physics.wallBounce;
  }
}

//when life gets below zero
function playerDead(i) {
  for (var j = 0; j < 20; j++) {
    debris(i);
  }
  p[i].alive = false;
  document.getElementById('player' + i).setAttribute('visibility', "hidden");
  document.getElementById('tail' + i).setAttribute('visibility', "hidden");
  setTimeout(function() {
    playerAlive(i);
  }, 4000); //respawn after ____milliseconds
}
//respawn after time is up.
function playerAlive(i) {
  document.getElementById('player' + i).setAttribute('visibility', "visible");
  p[i].alive = true;
  p[i].y = container.height * Math.random();
  p[i].x = container.width * Math.random();
  do { //give player random x and , but if player spawns inside map try again
    p[i].y = container.height * Math.random();
    p[i].x = container.width * Math.random();
  } while (map[Math.floor((p[i].y) / container.width * 20)][Math.floor((p[i].x) / container.width * 20)]);
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
  ctx.fillStyle = "#ffcc99";
  ctx.fillRect(ctx.canvas.width - p[0].health * 200, 0, p[0].health * 200, 20);
  ctx.textAlign = "end";
  ctx.fillText(p[0].lives, ctx.canvas.width - 2, 40);
  //player 1 blue
  ctx.fillStyle = "#ccffff";
  ctx.fillRect(0, 0, p[1].health * 200, 20);
  ctx.textAlign = "start";
  ctx.fillText(p[1].lives, 2, 40);

  //bullet loop
  i = b.length;
  while (i--) {
    //check if active or exploding
    if (b[i].alive) {
      //change position of each bullet
      bulletCollisionMap(i);
      b[i].Vx *= b[i].friction;
      b[i].Vy *= b[i].friction;
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
      //check for player collision and explode
      for (var j = 0; j < 2; j++) {
        if (p[j].alive) {
          if ((b[i].x - p[j].x) * (b[i].x - p[j].x) + (b[i].y - p[j].y) * (b[i].y - p[j].y) < p[j].r * p[j].r + b[i].r * b[i].r) {
            //explosive damage
            var damage = b[i].dmg + Math.sqrt((b[i].Vx * b[i].Vx + b[i].Vy * b[i].Vy)) * (b[i].r - 1) * 0.01
            p[j].health -= damage; //lower player health
            //speed and radius based damage
            p[j].health -= Math.sqrt((b[i].Vx * b[i].Vx + b[i].Vy * b[i].Vy)) * (b[i].r - 1) * 0.01
              //check if player dead
            if (p[j].health < 0) {
              playerDead(j)
            };
            //velocity based bullet knockback
            p[j].Vx += 0.01 * b[i].r * b[i].Vx
            p[j].Vy += 0.01 * b[i].r * b[i].Vy
            //explosion based bullet knockback
            p[j].Vx -= 2 * b[i].dmg * Math.cos(Math.atan2(b[i].y - p[j].y, b[i].x - p[j].x));
            p[j].Vy -= 2 * b[i].dmg * Math.sin(Math.atan2(b[i].y - p[j].y, b[i].x - p[j].x));
            //switch bullet to explosion
            b[i].color = "red";
            //make radius proportional to damage done from speed*Radius + dmg
            b[i].r = Math.abs(damage * 100);
            b[i].cycle = b[i].totalCycles - 5;
            b[i].x -= b[i].Vx; //back up bullet position
            b[i].y -= b[i].Vy;
            b[i].alive = false;
            j++ //ends the for loop
          };
        };
      };
    }
    //draw bullet
    ctx.fillStyle = b[i].color;
    ctx.beginPath()
    ctx.arc(b[i].x, b[i].y, b[i].r, 0, 2 * Math.PI);
    ctx.fill();
    //remove bullet if they are around for too long
    b[i].cycle++;
    if (b[i].cycle > b[i].totalCycles) {
      //this splice must be the final check for the bulllet array
      //otherwise you reference an array location that doesn't exist
      b.splice(i, 1);
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
requestAnimationFrame(draw);