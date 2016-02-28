/*    TODO
change ship center circle to show fire CD?
  or some other method

player collision
  Add in four point collision detection for ships to avoid being half inside map

procedurally generated maps

use switching for custom fire routines?
is it possible to have custom loops for different bullets types like clones in scratch?
  I think not without threads look into useing multiple cores

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

*/

//main loop
function draw() {
  // keeps track of cycle
  physics.cycle++;
  //clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); //normal clear
  //draw map
  drawMap();
  //show player health
  lifeBars();
    //bullet loop
  bullets();
  //power ups loop
  powerUpsLoop();
  //player to player collision
  playerCollision();
  //player 0,1 control loop
  //mouse for player 1 and keyboard for player 0
  if (p[0].alive) {
    playerKeys(0);
    playerCollisionMap(0);
    playerLoop(0);
  }
  if (p[1].alive) {
    mouseControl(1);
    playerCollisionMap(1);
    playerLoop(1);
  }
  //calls the loop recursively
  requestAnimationFrame(draw);
}
