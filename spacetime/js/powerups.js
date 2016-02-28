/*TODO
scale with map
use custom SVG images
collision detection
switch statement for different power ups
on spawn avoid map
switch statement on spawn for different types?   or just use random numbers for types

*/

var powerUps = [];

function spawnPowerUp() {
  powerUps.push({
    x: Math.random()*container.width,
    y: Math.random()*container.height,
    name: 'H',
    color: 'rgb(125, 255, 119)'
  });
}

function powerUpsLoop() {
  ctx.font = "29px Arial";
  var i = powerUps.length;
  while (i--) {
    //draw power up
    ctx.fillStyle = powerUps[i].color;
    ctx.strokeStyle = powerUps[i].color;
    ctx.strokeRect(powerUps[i].x,powerUps[i].y,physics.blockSize,physics.blockSize);
    ctx.fillText(powerUps[i].name,powerUps[i].x+1,powerUps[i].y+physics.blockSize-1);
    //collision check
}
}
