//set boundries to the browser window's size
//stops the game from running several loops
var begin = false;
//object for game physics
var physics = {
  cycle: 0,
  friction: 0.96,
  wallBounce: 0.6,
  playerKnockBack: 5, //set in resize function
  maxSpeed: 20,
  mapColor: "#60696a",
  zoom: 1, //set in resize function
  //scales player/bullet size and acceleration, used in resize function
  relativeSize: 0.03, //small 0.01  ->   0.06 big
  relativePlayerSize: 20,
  mapWidth: 50, //number of blocks in maps width
  mapHeight: 35, //mapWidth:mapHeight defines the aspect ratio of the window  might need to be equal
  blockSize: 1,
  mapDepth: 9, // 1 is a full maze each higher number is one less depth
  mouseControlRange: 60,
  playerNumber: 3
};

var container = {
  x: 0,
  y: 0,
  width: physics.mapWidth * 100, //size of container in pixels
  height: physics.mapHeight * 100,
};

//setup canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//pythagorian theorm pure function
function distance(x1,y1,x2,y2){
  return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

console.log(distance(10,10,100,100));

//set canvas and container to 98% of the width or height of the window at a 4:3 ratio
function resize() {
  if (window.innerWidth / window.innerHeight > physics.mapWidth / physics.mapHeight) {
    container.width = window.innerHeight * physics.mapWidth / physics.mapHeight;
    container.height = container.width * physics.mapHeight / physics.mapWidth;
  } else {
    container.height = window.innerWidth * physics.mapHeight / physics.mapWidth;
    container.width = container.height * physics.mapWidth / physics.mapHeight;
  }
  //set min size
  if (container.width < 400) {
    container.width = 400;
    container.height = container.width * physics.mapHeight / physics.mapWidth;
  }
  ctx.canvas.width = container.width;
  ctx.canvas.height = container.height;
  //sets the relative size of the player
  physics.zoom = container.width / physics.mapWidth * physics.relativeSize;
  physics.blockSize = container.width / physics.mapWidth;
  scalePlayer();
  if (begin === false){
    splashPage();
  }
}

//run update canvas size and containter size on window resize
window.onresize = function(event) {
  resize();
};

//returns mousePos.x and mousePos.y
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
// waits for mousemove event
document.addEventListener('mousemove', function(evt) {
  mousePos = getMousePos(canvas, evt);
}, false);

//looks for key presses and logs them
var keys = [];
document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});

//map array for somereason needs to have all the arrays set up
var map = [
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0],
  [0]
];
//fill with zeros
function mapZeros() {
  for (var i = 0; i < physics.mapHeight; i++) {
    for (var j = 0; j < physics.mapWidth; j++) {
      map[i][j] = 0;
    }
  }
}

function chooseOrientation(width, height) {
  if (width < height) {
    return "horizontal";
  } else if (height < width) {
    return "vertical";
  } else if (Math.random() > 0.5) {
    return "vertical";
  } else {
    return "horizontal";
  }
}

function recursiveDivision() {
  for (var i = 0; i < physics.mapHeight; i++) {
    map[i][Math.ceil(physics.mapWidth * 0.5)] = 1;
  }
  var holeY = Math.ceil(Math.random() * physics.mapHeight);
  var holeX = Math.ceil(physics.mapWidth * 0.5);
  for (var j = 0; j < 5; j++) {
    map[holeY + j][holeX] = 0;
  }
}
//generate random map
function randomMap() {
  for (var i = 0; i < physics.mapHeight + 1; i++) {
    for (var j = 0; j < physics.mapWidth + 1; j++) {
      map[i][j] = Math.floor(Math.random() + 0.05);
    }
  }
}

function randomLinesMap() {
  for (var i = 0; i < physics.mapHeight + 1; i++) {
    for (var j = 0; j < physics.mapWidth + 1; j++) {
      if (Math.random() - 0.5 > 0) {
        //draw a horizontal line
        if (Math.random() > 0.99) {
          for (var k = -1; k < Math.floor(Math.random() * 60); k++) {
            map[i][j - k] = 1;
          }
        }
      } else {
        //draw a vertical line
        if (Math.random() > 0.99) {
          for (var l = 0; l < Math.floor(Math.random() * 60); l++) {
            map[i + l][j] = 1;
          }
        }
      }
    }
  }
}

mapZeros();
  //recursiveDivision()
  //randomMap()
randomLinesMap();

/*
//build map with  Maze "Recursive Division" algorithm
var grid;
function generate(dimensions, numDoors) {
  grid = new Array();
  for (var i = 0; i < dimensions; i++) {
    grid[i] = new Array();
    for (var j = 0; j < dimensions; j++) {
      grid[i][j] = 0;
    }
  }
  //addOuterWalls();
  addInnerWalls(true, 1, grid.length - 0, 1, grid.length - 2);
}
function addOuterWalls() {
  for (var i = 0; i < grid.length; i++) {
    if (i == 0 || i == (grid.length - 1)) {
      for (var j = 0; j < grid.length; j++) {
        grid[i][j] = 1;
      }
    } else {
      grid[i][0] = 1;
      grid[i][grid.length - 1] = 1;
    }
  }
}
function addInnerWalls(h, minX, maxX, minY, maxY) {
  if (h) {
    if (maxX - minX < 1) {
      return;
    }
    var y = Math.floor(randomNumber(minY, maxY) / 2) * 2;
    addHWall(minX, maxX, y);
    addInnerWalls(!h, minX, maxX, minY, y - 1);
    addInnerWalls(!h, minX, maxX, y + 1, maxY);
  } else {
    if (maxY - minY < physics.mapDepth) {
      return;
    }
    var x = Math.floor(randomNumber(minX, maxX) / 2) * 2;
    addVWall(minY, maxY, x);
    addInnerWalls(!h, minX, x - 1, minY, maxY);
    addInnerWalls(!h, x + 1, maxX, minY, maxY);
  }
}
function addHWall(minX, maxX, y) {
  var hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1;
  for (var i = minX; i <= maxX; i++) {
    if (i == hole  || i == hole+1|| i == hole-1) grid[y][i] = 0;
    //if (i == hole) grid[y][i] = 0;
    else grid[y][i] = 1;
  }
}
function addVWall(minY, maxY, x) {
  var hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1;
  for (var i = minY; i <= maxY; i++) {
    if (i == hole || i == hole+1|| i == hole-1) grid[i][x] = 0;
    //if (i == hole) grid[i][x] = 0;
    else grid[i][x] = 1;
  }
}
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
generate(physics.mapWidth, 0);

var map = grid;
function setupMap() {
  var array1 = []
  for (var i = 0; i < physics.mapWidth; i++) {
    array1.push(1);
  }
  //adding a top and bottom layer seems to help prevent out of bounds checks in other parts of the game
  map.splice(0, 0, array1);
  map.splice(map.length, 0, array1);

}
setupMap()
*/

//drawMap is called in the draw loop
function drawMap() {
  ctx.fillStyle = physics.mapColor;
  for (var i = 0; i < physics.mapHeight + 1; i++) {
    for (var j = 0; j < physics.mapWidth; j++) {
      if (map[i][j]) {
        ctx.fillRect(j / physics.mapWidth * container.width | 0, (i - 1) / physics.mapHeight * container.height | 0, (physics.blockSize + 1) | 0, (physics.blockSize + 1) | 0); //  | 0 converts float to int for faster draw speeds
      }
    }
  }
}




function lifeBars(){
  //player life bars
  ctx.font = "20px Arial";
  ctx.globalAlpha = 0.9;
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
  ctx.globalAlpha = 1;
}
