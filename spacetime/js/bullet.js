// array of objects for bullets
var b = [];
// adds a new bullet(s) object to array b  when player fires
function bullet (i) {
  for (var j = 0; j < p[i].B_number; j++) {
    b.push({
      player: i, // who owns the bullet (used in seeking)
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
      seeking: p[i].B_seeking,
    });
  }
}
// special bullets that spawn when a player dies
function debris(i) {
  var angle = Math.random() * 2 * Math.PI;
  b.push({
    player: -1,  // -1 means no owner
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
    alive: true,
    seeking: 0,
  });
}

function regularGun(i) {
  p[i].B_type = "regular";
  p[i].fireDelay = 10;
  p[i].fireKnockBack = 0.1;
  p[i].B_dmg = 0.05;
  p[i].B_speed = 8;
  p[i].B_totalCycles = 300;
  p[i].B_r = 3;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 1;
  p[i].B_penetrate = false;
  p[i].B_color = 'white';
  p[i].B_seeking = 0;
}

function beamGun(i) {
  p[i].B_type = "beam";
  p[i].fireDelay = 1;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0.016;
  p[i].B_speed = 10;
  p[i].B_totalCycles = 80;
  p[i].B_r = 1;
  p[i].B_spread = 0.052;
  p[i].B_number = 1;
  p[i].B_friction = 1;
  p[i].B_penetrate = false;
  p[i].B_color = 'rgb(255, 255, 255)';
  p[i].B_seeking = 0;
}

function sniperGun(i) {
  p[i].B_type = "sniper";
  p[i].fireDelay = 55;
  p[i].fireKnockBack = 1.5;
  p[i].B_dmg = 0.3;
  p[i].B_speed = 27;
  p[i].B_totalCycles = 200;
  p[i].B_r = 4.5;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 0.99;
  p[i].B_penetrate = false;
  p[i].B_color = "rgb(221, 221, 221)";
  p[i].B_seeking = 0;
}

function spiritBombGun(i) {
  p[i].B_type = "spiritBomb";
  p[i].fireDelay = 140;
  p[i].fireKnockBack = 1;
  p[i].B_dmg = 0.5;
  p[i].B_speed = 2;
  p[i].B_totalCycles = 600;
  p[i].B_r = 23;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 1;
  p[i].B_penetrate = true;
  p[i].B_color = "rgba(242, 0, 255, 0.6)";
  p[i].B_seeking = 0;
}

function shotGun(i) {
  p[i].B_type = "shot";
  p[i].fireDelay = 70;
  p[i].fireKnockBack = 7;
  p[i].B_dmg = 0.04;
  p[i].B_speed = 20;
  p[i].B_totalCycles = 135;
  p[i].B_r = 2;
  p[i].B_spread = 0.5;
  p[i].B_number = 12;
  p[i].B_friction = 0.985;
  p[i].B_penetrate = false;
  p[i].B_color = "#d9d9d9";
  p[i].B_seeking = 0;
}

function waveGun(i) {
  p[i].B_type = "wave";
  p[i].fireDelay = 23;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0.02;
  p[i].B_speed = 9;
  p[i].B_totalCycles = 110;
  p[i].B_r = 1.2;
  p[i].B_spread = 0.17;
  p[i].B_number = 13;
  p[i].B_friction = 1;
  p[i].B_penetrate = 0;
  p[i].B_color = "rgb(255, 255, 255)";
  p[i].B_seeking = 0;
}

function rocketGun(i) {
  p[i].B_type = "rocket";
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
  p[i].B_seeking = 0;
}

function whipGun(i) {
  p[i].B_type = "whip";
  p[i].fireDelay = 0;
  p[i].fireKnockBack = 0;
  p[i].B_dmg = 0.02;
  p[i].B_speed = 7;
  p[i].B_totalCycles = 40;
  p[i].B_r = 1;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 0.99;
  p[i].B_penetrate = true;
  p[i].B_color = "rgba(227, 0, 255, 1)";
  p[i].B_seeking = 0;
}

function seekingGun(i) {
  p[i].B_type = "seeking";
  p[i].fireDelay = 3;
  p[i].fireKnockBack = 0.15;
  p[i].B_dmg = 0.01;
  p[i].B_speed = 25;
  p[i].B_totalCycles = 400;
  p[i].B_r = 1;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 0.96;
  p[i].B_penetrate = false;
  p[i].B_color = 'rgb(252, 243, 0)';
  p[i].B_seeking = 0.15;
}

function missilesGun(i) {
  p[i].B_type = "missiles";
  p[i].fireDelay = 50;
  p[i].fireKnockBack = 0.3;
  p[i].B_dmg = 0;
  p[i].B_speed = 10;
  p[i].B_totalCycles = 500;
  p[i].B_r = 3;
  p[i].B_spread = 1;
  p[i].B_number = 5;
  p[i].B_friction = 0.995;
  p[i].B_penetrate = false;
  p[i].B_color = 'rgb(237, 255, 125)';
  p[i].B_seeking = 0.06;
}

function ghostGun(i) {
  p[i].B_type = "ghost";
  p[i].fireDelay = 70;
  p[i].fireKnockBack = 0.5;
  p[i].B_dmg = 0;
  p[i].B_speed = 5;
  p[i].B_totalCycles = 1300;
  p[i].B_r = 9;
  p[i].B_spread = 0;
  p[i].B_number = 1;
  p[i].B_friction = 0.986;
  p[i].B_penetrate = true;
  p[i].B_color = 'rgba(255, 245, 0, 0.35)';
  p[i].B_seeking = 0.023;
}

function randomGun(i){
//picks a random gun for each player at the start of the game
  switch (Math.ceil(Math.random() * 10)) {
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
    case 8:
      seekingGun(i);
      break;
    case 9:
      missilesGun(i);
      break;
    case 9:
      ghostGun(i);
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
      //if seeking move towards other player
      if (b[i].seeking!==0){
        var angle;
        if (b[i].player === 0){
          if (p[1].alive){
            angle = Math.atan2(b[i].y - p[1].y, b[i].x - p[1].x);
            b[i].Vx -= 0.2 * Math.cos(angle);
            b[i].Vy -= 0.2 * Math.sin(angle);
          }
        } else if (b[i].player === 1){
          if (p[0].alive){
            angle = Math.atan2(b[i].y - p[0].y, b[i].x - p[0].x);
            b[i].Vx -= b[i].seeking * Math.cos(angle);
            b[i].Vy -= b[i].seeking * Math.sin(angle);
          }
        }

      }
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
      if (!b[i].penetrate) {
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
      }
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
            playerDamage(j,damage);
            //switch bullet to explosion
            b[i].color = "rgba(255, 0, 0, 0.88)";
            //make radius proportional to damage done from speed*Radius + dmg
            b[i].r = Math.abs(damage * 300+5);
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
