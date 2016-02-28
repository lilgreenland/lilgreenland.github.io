// array of objects for bullets
var b = [];
// adds a new bullet(s) object to array b  when player fires
function bullet (i) {
  for (var j = 0; j < p[i].B_number; j++) {
    b.push({
      x: p[i].x + (p[i].r + p[i].B_r * physics.zoom) * Math.cos(p[i].dir),
      y: p[i].y + (p[i].r + p[i].B_r * physics.zoom) * Math.sin(p[i].dir),
      r: p[i].B_r * physics.zoom,
      Vx: p[i].Vx + p[i].B_speed * physics.zoom * Math.cos((p[i].dir + p[i].B_spread * (Math.random() - 0.5))),
      Vy: p[i].Vy + p[i].B_speed * physics.zoom * Math.sin((p[i].dir + p[i].B_spread * (Math.random() - 0.5))),
      friction: p[i].B_friction,
      dmg: p[i].B_dmg,
      penetrate: p[i].B_penetrate,
      color: p[i].B_color,
      cycle: 0,
      totalCycles: p[i].B_totalCycles,
      alive: true,
    });
  }
}
// special bullets that spawn when a player dies
function debris(i) {
  var angle = Math.random() * 2 * Math.PI;
  b.push({
    x: p[i].x,
    y: p[i].y,
    r: 0.5 + Math.random() * 2 * physics.zoom,
    // velocity scales with how low player health is
    Vx: p[i].Vx + 15 * physics.zoom * Math.cos(angle) * Math.random(),
    Vy: p[i].Vy + 15 * physics.zoom * Math.sin(angle) * Math.random(),
    // Vx: p[i].Vx + 5 * (Math.random() - 0.5),
    // Vy: p[i].Vy + 5 * (Math.random() - 0.5),
    friction: 0.96, // 1 means no friction
    dmg: 0,
    penetrate: 0,
    hitKnockBack: 0.5,
    color: p[i].color,
    cycle: 0,
    totalCycles: 100,
    alive: true
  });
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
  p[i].B_color = 'white';
}

function beamGun(i) {
  p[i].fireDelay = 1;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0.016;
  p[i].B_speed = 10;
  p[i].B_totalCycles = 70;
  p[i].B_r = 1;
  p[i].B_spread = 0.052;
  p[i].B_number = 1;
  p[i].B_friction = 1;
  p[i].B_penetrate = 0;
  p[i].B_color = 'rgb(255, 255, 255)';
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
  p[i].B_color = "rgb(221, 221, 221)";
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
  p[i].B_color = "rgba(242, 0, 255, 0.6)";
}

function shotGun(i) {
  p[i].fireDelay = 80;
  p[i].fireKnockBack = 7;
  p[i].B_dmg = 0.04;
  p[i].B_speed = 18;
  p[i].B_totalCycles = 135;
  p[i].B_r = 2;
  p[i].B_spread = 0.6;
  p[i].B_number = 10;
  p[i].B_friction = 0.985;
  p[i].B_penetrate = 0;
  p[i].B_color = "#d9d9d9";
}

function waveGun(i) {
  p[i].fireDelay = 23;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0.02;
  p[i].B_speed = 8;
  p[i].B_totalCycles = 100;
  p[i].B_r = 1.2;
  p[i].B_spread = 0.17;
  p[i].B_number = 13;
  p[i].B_friction = 1;
  p[i].B_penetrate = 0;
  p[i].B_color = "rgba(89, 255, 0, 1)";
}

function rocketGun(i) {
  p[i].fireDelay = 0;
  p[i].fireKnockBack = 0.36;
  p[i].B_dmg = 0.03;
  p[i].B_speed = 10;
  p[i].B_totalCycles = 100;
  p[i].B_r = 1;
  p[i].B_spread = 0.2;
  p[i].B_number = 1;
  p[i].B_friction = 0.98;
  p[i].B_penetrate = 0;
  p[i].B_color = "white";
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
  p[i].B_color = "rgba(255, 255, 255, 0.76)";
}


function randomGun(i){
//picks a random gun for each player at the start of the game
  switch (Math.ceil(Math.random() * 7)) {
    case 1:
      beamGun(i);
      break;
    case 2:
      shotGun(i);
      break;
    case 3:
      sniperGun(i);
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
      whipGun(i);
      break;
  }
}



function bullets(){
  var i = b.length;
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
        b[i].Vx = -b[i].Vx * physics.wallBounce;
      }
      if (b[i].x < container.x + b[i].r) {
        b[i].x = container.x + b[i].r;
        b[i].Vx = -b[i].Vx * physics.wallBounce;
      }
      //edge bounce Y
      if (b[i].y > container.height - b[i].r) {
        b[i].y = container.height - b[i].r;
        b[i].Vy = -b[i].Vy * physics.wallBounce;
      }
      if (b[i].y < container.y + b[i].r) {
        b[i].y = container.y + b[i].r;
        b[i].Vy = -b[i].Vy * physics.wallBounce;
      }

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
            b[i].cycle = b[i].totalCycles;
          } else {
            if (map[arrayY][arrayX]) {
              b[i].Vy *= -1; //flip Y velocity if touching map
            }
          }
        }
      } else if (b[i].penetrate === -1) {}
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
              playerDead(j);
            }
            //switch bullet to explosion
            b[i].color = "rgba(255, 0, 0, 0.88)";
            //make radius proportional to damage done from speed*Radius + dmg
            b[i].r = Math.abs(damage * 100);
            b[i].cycle = b[i].totalCycles - 5; // end bullet in a few cycles
            b[i].x -= b[i].Vx; //back up bullet position for looks
            b[i].y -= b[i].Vy;
            b[i].alive = false;
            j++; //ends the loop so the bullet can't hit the second player sometimes
          }
        }
      }
    }
    //draw bullet
    ctx.fillStyle = b[i].color;
    ctx.beginPath();
    ctx.arc(b[i].x | 0, b[i].y | 0, b[i].r, 0, 2 * Math.PI);
    ctx.fill();
    //remove bullet after totalcycles
    b[i].cycle++;
    if (b[i].cycle > b[i].totalCycles) {
      //this splice must be the final check for the bulllet array
      //otherwise you reference an array location that doesn't exist
      b.splice(i, 1); //removes bullet from array
    }
  } //end bullet loop

}
