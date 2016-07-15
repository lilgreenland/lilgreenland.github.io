function MotionSimulation(){
//set up canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var id = document.getElementById("myCanvas").parentNode.id;
ctx.canvas.width = document.getElementById(id).clientWidth;
ctx.canvas.height = 400; //window.innerHeight;
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

window.onresize = function(event) {
  var id = document.getElementById("myCanvas").parentNode.id;
  ctx.canvas.width = document.getElementById(id).clientWidth;
  ctx.canvas.height = 400;
  //ctx.canvas.width = window.innerWidth;
  //ctx.canvas.height = window.innerHeight;
};

// module aliases
var Engine = Matter.Engine,
  World = Matter.World,
  Composites = Matter.Composites,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();
engine.world.gravity.y = 2;

document.getElementById("myCanvas").addEventListener("mousedown", spawnBodies);
spawnBodies();
var ball
function spawnBodies(){
  World.clear(engine.world, true);
  ball = Bodies.circle(15, canvas.height-215, 15,{
      friction: 0.002,
      frictionStatic: 0,
      frictionAir: 0,
      restitution: 0.3,
  });

  Matter.Body.setVelocity(ball, {
    x: 10,
    y: 0
  });
  //Matter.Body.setAngularVelocity(ball, 0.1);
  World.add(engine.world, ball);
}

var table = Bodies.rectangle(0, canvas.height-200, 300, 20, {
  isStatic: true
});
World.add(engine.world, table);

//add the walls
var offset = 25;
World.add(engine.world, [
  Bodies.rectangle(400, -offset, canvas.width * 2 + 2 * offset, 50, {
    isStatic: true,
    render: {
      restitution: 1,
    }
  }),
  Bodies.rectangle(400, canvas.height + offset, canvas.width * 2 + 2 * offset, 50, {
    isStatic: true,
    render: {
      restitution: 1,
    }
  }),
  Bodies.rectangle(canvas.width + offset, 300, 50, canvas.height * 2 + 2 * offset, {
    isStatic: true,
    render: {
      restitution: 1,
    }
  }),
  Bodies.rectangle(-offset, 300, 50, canvas.height * 2 + 2 * offset, {
    isStatic: true,
    render: {
      restitution: 1,
    }
  })
]);

// run the engine
Engine.run(engine);

//render
(function render() {
  var bodies = Composite.allBodies(engine.world);
  window.requestAnimationFrame(render);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  for (var i = 0; i < bodies.length; i += 1) {
    var vertices = bodies[i].vertices;
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (var j = 1; j < vertices.length; j += 1) {
      ctx.lineTo(vertices[j].x, vertices[j].y);
    }
    ctx.lineTo(vertices[0].x, vertices[0].y);
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#fdd';
  ctx.fill();
  ctx.stroke();
})();
}
