var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
var addStar = 0;
var container = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height
};
var stars = [];
var totalStars = 0; // spawns stars at start
var mousePos = {
  x: container.width * 0.5,
  y: container.height * 0.5
};
var friction = 0.996

window.onresize = function(event) {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  container.height = window.innerHeight;
  container.width = window.innerWidth;
};

//adds a new star objects to array stars
function pushStar() {
  stars.push({
    x: mousePos.x + 20 * (Math.random() - 0.5),
    y: mousePos.y + 20 * (Math.random() - 0.5),
    Vx: 0,
    Vy: 0,
    r: 35 * Math.random() + 3,
    color: '#' + Math.floor(Math.random() * 16777216).toString(16)
  });
}
//spawns stars
for (var i = 0; i < totalStars; i++) {
  pushStar();
}
//push away if mouse down
document.addEventListener("mousedown", function() {
  addStar = 1;
  for (var i = 0; i < stars.length; i++) {
    stars[i].Vx += 3 * Math.cos(Math.atan2(stars[i].y - mousePos.y, stars[i].x - mousePos.x));
    stars[i].Vy += 3 * Math.sin(Math.atan2(stars[i].y - mousePos.y, stars[i].x - mousePos.x));
  }
});

//gets mouse position
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
// waits for mouse move and then updates position
document.addEventListener('mousemove', function(evt) {
  mousePos = getMousePos(canvas, evt);
}, false);

//recursive draw function
function draw() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = "#ffffff"; //background color
  ctx.fillRect(container.x, container.y, container.width, container.height);
  for (var i = 0; i < stars.length; i++) {
    //draw a circle
    ctx.globalCompositeOperation = 'darker';
    ctx.beginPath();
    ctx.arc(stars[i].x, stars[i].y, stars[i].r, 0, 2 * Math.PI, true);
    ctx.fillStyle = stars[i].color;
    ctx.fill();
    //bounce off walls
    if (stars[i].x > container.width - stars[i].r) {
      stars[i].Vx *= -friction;
      stars[i].x = container.width - stars[i].r;
    } else if (stars[i].x < stars[i].r) {
      stars[i].Vx *= -friction;
      stars[i].x = stars[i].r;
    }
    if (stars[i].y > container.height - stars[i].r) {
      stars[i].Vy *= -friction;
      stars[i].y = container.height - stars[i].r;
    } else if (stars[i].y < stars[i].r) {
      stars[i].Vy *= -friction;
      stars[i].y = stars[i].r;
    }
    // attraction to the mouse
    stars[i].Vx += -0.03 * Math.cos(Math.atan2(stars[i].y - mousePos.y, stars[i].x - mousePos.x));
    stars[i].Vy += -0.03 * Math.sin(Math.atan2(stars[i].y - mousePos.y, stars[i].x - mousePos.x));

    //change position, velocity, size of object elements for each location in array
    stars[i].x += stars[i].Vx;
    stars[i].y += stars[i].Vy;

    //friction slows velocity
    stars[i].Vx *= friction;
    stars[i].Vy *= friction;

  }
  if (addStar == 1) {
    pushStar();
    addStar = 0;
  }else if (addStar == -1){
    stars = [];
  }
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);