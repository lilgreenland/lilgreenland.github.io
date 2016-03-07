/*TODO
scale with map
use custom SVG images
on spawn avoid map


*/

var powerUp = [];

//spawn a random power up every 15seconds if total powers on screen is less then 5
function spawnNewPowerUpCheck(){
  if (physics.cycle % 700 === 0 && powerUp.length<5){
    spawnPowerUp();
  }
}


//randomly add a new power up
function spawnPowerUp(type) {
var color;
var totalTypes=3;
//if type isn't passed a random type is choosen
if (!type){
  type = Math.ceil(Math.random()*totalTypes);
}

  switch(type) {
    case 1:
      type = 'heal';
      color = 'lightgreen';
      break;
    case 2:
      type = 'gun_random';
      color = 'rgb(75, 58, 179)';
      break;
    case 3:
      type = 'damage';
      color = 'red';
      break;
    default:
      type = 'heal';
      color = 'lightgreen';
  }
  //find a place to spawn not touching the map
  var x;
  var y;
  var r;
  var j = 0;
    do { //give player random x and y, but if player spawns inside map try again
      x = container.width * Math.random();
      y = container.height * Math.random();
      r = physics.blockSize;
      j++;
    } while (j < 10 &&
     map[1 + Math.floor(y / container.height * physics.mapHeight)][Math.floor((x + r) / container.width * physics.mapWidth)] ||
     map[Math.floor((y) / container.height * physics.mapHeight) + 1][Math.floor((x - r) / container.width * physics.mapWidth)] ||
     map[Math.floor((y + r) / container.height * physics.mapHeight) + 1][Math.floor((x) / container.width * physics.mapWidth)] ||
     map[Math.floor((y - r) / container.height * physics.mapHeight) + 1][Math.floor((x) / container.width * physics.mapWidth)] ||
     (((Math.abs(x-p[0].x)) < p[0].r * p[0].r) && ((Math.abs(y-p[0].y)) < p[0].r * p[0].r)) ||
     (((Math.abs(x-p[1].x)) < p[1].r * p[1].r) && ((Math.abs(y-p[1].y)) < p[1].r * p[1].r))
    );


  //push to powerUp array
  powerUp.push({
    x: x,
    y: y,
    r: physics.blockSize*0.6,
    type: type,
    color: color,
  });
}

function powerUpsLoop() {
  ctx.font = "29px Arial";
  ctx.textAlign="center";
  var i = powerUp.length;
  while (i--) {
    //draw power up
    ctx.fillStyle = powerUp[i].color;
    //ctx.strokeStyle = powerUp[i].color;
    ctx.fillRect(powerUp[i].x,powerUp[i].y,powerUp[i].r,powerUp[i].r);
    //collision check
    for(var j=0;j<2;j++){  //j is player number
      if (distance(powerUp[i].x,powerUp[i].y,p[j].x,p[j].y)< powerUp[i].r + p[j].r) {
        //switch statement for various power up effects
        switch(powerUp[i].type) {
          case 'heal':   //heal
            p[j].health = 1;
            break;
          case 'damage':   //damage
            playerDamage(j,0.2);
            break;
          case 'gun_random':   //random gun
            var currentType = p[j].B_type;
            do{
            randomGun(j);
            } while(currentType==p[j].B_type);
            break;
        default:  //heal
            p[j].health = 1;
        }
        //removes from array
        j++; //makes sure to exit player for loop
        powerUp.splice(i, 1);
      }
    }
  }
}
