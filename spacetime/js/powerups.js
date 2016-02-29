/*TODO
scale with map
use custom SVG images
on spawn avoid map
randomly spawn new powers


*/

var powerUp = [];
//randomly add a new power up
function spawnPowerUp(type) {
var color;
//if type isn't passed a random type is choosen
if (!type){
  type = Math.ceil(Math.random()*2);
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
  //push to powerUp array
  powerUp.push({
    x: Math.random()*container.width,
    y: Math.random()*container.height,
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
            p[j].health = 0.2;
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
