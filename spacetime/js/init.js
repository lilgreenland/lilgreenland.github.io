//pregame setup


function splashPage() {
  //move svg players off the screen
  document.getElementById('player0').setAttribute('transform', ' translate(' + container.width * 0.3 + ',' + container.height * 0.7 + ')');
  document.getElementById('player1').setAttribute('transform', ' translate(' + container.width * 0.7 + ',' + container.height * 0.7 + ')');

  //ctx.globalAlpha = 0.3;
  //instructions
  ctx.fillStyle = "#808080";
  ctx.font = container.width * 0.03 + "px Arial Black";
  ctx.textAlign = "center";
  ctx.fillText("click to begin", container.width * 0.5, container.height * 0.1);

  //player 0 blue
  ctx.fillStyle = "#ccffff";
  ctx.textAlign = "center";
  ctx.fillText("MOUSE", container.width * 0.7, container.height * 0.9);

  //player 1 orange
  ctx.fillStyle = "#ffcc99";
  ctx.textAlign = "center";
  ctx.fillText("    1   &   WASD", container.width * 0.3, container.height * 0.9);

  ctx.globalAlpha = 1;
  ctx.font = container.width * 0.12 + "px Arial Black";

  ctx.textAlign = "end";
  ctx.fillStyle = "#ccffff";
  for (var i = 0; i < 7; i++) {
    ctx.fillText("SPACE", container.width * 0.5 + i, container.height * 0.4 + i);
  }
  ctx.textAlign = "start";
  ctx.fillStyle = "#ffcc99";
  for (var k = 0; k < 7; k++) {
    ctx.fillText("TIME?", container.width * 0.5 + k, container.height * 0.4 + k);
  }
  ctx.fillStyle = "#000000";
  ctx.fillText("TIME?", container.width * 0.5 + 7, container.height * 0.4 + 7);
  ctx.textAlign = "end";
  ctx.fillText("SPACE", container.width * 0.5 + 7, container.height * 0.4 + 7);
}




function beginLoop() {
  if (!begin) {
    begin = true;
    document.getElementById("body").style.cursor = "crosshair"; //hides mouse
    requestAnimationFrame(draw);
  }
}
//on click run main loop
document.body.addEventListener('click', beginLoop, true);


//scale canvas
resize();
//draw splash page
splashPage();
//set players attributes
playerAlive(0);
playerAlive(1);
//pick a gun for each player
randomGun(0);
randomGun(1);
//whipGun(0);
//waveGun(1);
//beamGun(1);
//shotGun(0);
//sniperGun(0);
//spiritBombGun(0);
//regularGun(1)
//rocketGun(1);

for(var i=0;i<4;i++){
  spawnPowerUp(2);
}
