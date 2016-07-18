MotionSimulation();
function MotionSimulation(){
//set up canvas
var canvasID = "myCanvas"
var canvas = document.getElementById(canvasID);
var ctx = canvas.getContext("2d");
var id = document.getElementById(canvasID).parentNode.id;
ctx.canvas.width = document.getElementById(id).clientWidth;
ctx.canvas.height = 300; //window.innerHeight;
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

window.onresize = function(event) {
  var id = document.getElementById(canvasID).parentNode.id;
  ctx.canvas.width = document.getElementById(id).clientWidth;
  ctx.canvas.height = 300;
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
var scale = 100;
//adjust gravity to fit simulation
engine.world.gravity.scale = 0.000001 * scale;;
engine.world.gravity.y = 9.8;


var mass = [];

document.getElementById(canvasID).addEventListener("mousedown", function(){
  World.clear(engine.world, true); //clear matter engine, leave static
  mass = []; //clear mass array
spawnMass(0, 1.5, 2, 0, 0.1);
});

spawnMass(0, 1.5, 2, 0, 0.1);
function spawnMass(xIn, yIn, VxIn, VyIn, radius) {
  //spawn mass
    var i = mass.length
    mass.push();
    mass[i] = Bodies.circle(xIn * scale, canvas.height - (yIn - radius)*scale, radius * scale, {
      friction: 0.002,
      frictionStatic: 0.1,
      frictionAir: 0.001,
      restitution: 0.5,
    });

    Matter.Body.setVelocity(mass[i], {
      x: VxIn / 60 * scale,
      y: -VyIn / 60 * scale
    });
    //Matter.Body.setAngularVelocity(mass[i], 0.3);
    Matter.Body.setAngularVelocity(mass[i], 0.4);
    World.add(engine.world, mass[i]);
  }

var table = Bodies.rectangle(0, canvas.height-1.5*scale+15, 300, 20, {
  isStatic: true,
  friction: 0,
  frictionStatic: 0,
});
var leg = Bodies.rectangle(120, canvas.height-25, 10, 200, {
  isStatic: true,
  friction: 0,
  frictionStatic: 0,
});
World.add(engine.world, [table,leg]);

//add walls flush with the edges of the canvas
var offset = 25;
World.add(engine.world, [
  /* Bodies.rectangle(canvas.width*0.5, -offset-1, canvas.width * 2 + 2 * offset, 50, { //top
    isStatic: true,
    friction: 1,
    frictionStatic: 1,
  }), */
  Bodies.rectangle(canvas.width * 0.5, canvas.height + offset + 1, canvas.width * 2 + 2 * offset, 50, { //bottom
    isStatic: true,
    friction: 1,
    frictionStatic: 1,
  }),
  Bodies.rectangle(canvas.width + offset + 1, canvas.height * 0.5, 50, canvas.height * 2 + 2 * offset, { //right
    isStatic: true,
    friction: 1,
    frictionStatic: 1,
  }),
  /* Bodies.rectangle(-offset-1, canvas.height*0.5, 50, canvas.height * 2 + 2 * offset, {  //left
    isStatic: true,
    friction: 1,
    frictionStatic: 1,
  }) */
]);

// run the engine
Engine.run(engine);

//render
// (function render() {
//   var bodies = Composite.allBodies(engine.world);
//   window.requestAnimationFrame(render);
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.beginPath();
//   for (var i = 0; i < bodies.length; i += 1) {
//     ctx.moveTo(bodies[i].position.x, bodies[i].position.y);
//     var vertices = bodies[i].vertices;
//     ctx.lineTo(vertices[0].x, vertices[0].y);
//     for (var j = 1; j < vertices.length; j += 1) {
//       ctx.lineTo(vertices[j].x, vertices[j].y);
//     }
//     ctx.lineTo(vertices[0].x, vertices[0].y);
//   }
//   ctx.lineWidth = 1;
//   ctx.strokeStyle = '#000000';
//   ctx.fillStyle = '#dff';
//   ctx.fill();
//   ctx.stroke();
// })();

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
  ctx.fillStyle = '#dff';
  ctx.fill();
  ctx.stroke();
  //draw lines
  ctx.beginPath();
  for (var k = 0, length = mass.length; k<length; k++){
    ctx.moveTo(mass[k].position.x,mass[k].position.y);
    ctx.lineTo(mass[k].vertices[0].x, mass[k].vertices[0].y);
  }
  ctx.stroke();

})();

}

//***************************************
//***************************************
//***************************************
//***************************************
//***************************************
//***************************************
//***************************************
//***************************************

MotionSimulationTwo();
function MotionSimulationTwo(){
//set up canvas
var canvasID = "myCanvas2"
var canvas = document.getElementById(canvasID);
var ctx = canvas.getContext("2d");
var id = document.getElementById(canvasID).parentNode.id;
ctx.canvas.width = document.getElementById(id).clientWidth;
ctx.canvas.height = 300; //window.innerHeight;
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

window.onresize = function(event) {
  var id = document.getElementById(canvasID).parentNode.id;
  ctx.canvas.width = document.getElementById(id).clientWidth;
  ctx.canvas.height = 300;
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
var scale = 60;
//adjust gravity to fit simulation
engine.world.gravity.scale = 0.000001 * scale;;
engine.world.gravity.y = 9.8;


var mass = [];

document.getElementById(canvasID).addEventListener("mousedown", function(){
  World.clear(engine.world, true); //clear matter engine, leave static
  mass = []; //clear mass array
spawnMass(0, 2, 5, 8.66, 0.2);
});

spawnMass(0, 2, 5, 8.66, 0.2);
function spawnMass(xIn, yIn, VxIn, VyIn, radius) {
  //spawn mass
    var i = mass.length
    mass.push();
    mass[i] = Bodies.circle(xIn * scale, canvas.height - (yIn - radius)*scale, radius * scale, {
      friction: 0.6,
      frictionStatic: 0.1,
      frictionAir: 0,
      restitution: 0.5,
    });

    Matter.Body.setVelocity(mass[i], {
      x: VxIn / 60 * scale,
      y: -VyIn / 60 * scale
    });
    //Matter.Body.setAngularVelocity(mass[i], 0.3);
    Matter.Body.setAngularVelocity(mass[i], -0.1);
    World.add(engine.world, mass[i]);
  }

//add walls flush with the edges of the canvas
var offset = 25;
World.add(engine.world, [
  /* Bodies.rectangle(canvas.width*0.5, -offset-1, canvas.width * 2 + 2 * offset, 50, { //top
    isStatic: true,
    friction: 1,
    frictionStatic: 1,
  }), */
  Bodies.rectangle(canvas.width * 0.5, canvas.height + offset + 1, canvas.width * 2 + 2 * offset, 50, { //bottom
    isStatic: true,
    friction: 1,
    frictionStatic: 1,
  }),
  Bodies.rectangle(canvas.width + offset + 1, canvas.height * 0.5, 50, canvas.height * 2 + 2 * offset, { //right
    isStatic: true,
    friction: 1,
    frictionStatic: 1,
  }),
  /* Bodies.rectangle(-offset-1, canvas.height*0.5, 50, canvas.height * 2 + 2 * offset, {  //left
    isStatic: true,
    friction: 1,
    frictionStatic: 1,
  }) */
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
    ctx.moveTo(bodies[i].position.x, bodies[i].position.y);
    var vertices = bodies[i].vertices;
    ctx.lineTo(vertices[0].x, vertices[0].y);
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

//***************************************
//***************************************
//***************************************
//***************************************
//***************************************
//***************************************
//***************************************
//***************************************

challenge();
function challenge(){
//set up canvas
var canvasID = "myCanvas3"
var canvas = document.getElementById(canvasID);
var ctx = canvas.getContext("2d");
var id = document.getElementById(canvasID).parentNode.id;
ctx.canvas.width = document.getElementById(id).clientWidth;
//ctx.canvas.height = 700; //window.innerHeight;
//canvas.width = window.innerWidth;
//canvas.height = window.innerHeight;

window.onresize = function(event) {
  var id = document.getElementById(canvasID).parentNode.id;
  ctx.canvas.width = document.getElementById(id).clientWidth;
  //ctx.canvas.height = 700;
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
var scale = 1;
//adjust gravity to fit simulation
engine.world.gravity.scale = 0.000001 * scale;;
engine.world.gravity.y = 9.8;


//setup dat gui
var settings = {
  Vx: 0,
  Vy: 0,
}

//GUI setup
var gui = new dat.GUI();
//gui.close();
gui.add(settings, 'Vx', 0, 0.01).step(0.0001);
gui.add(settings, 'Vy');


var mass = [];
document.getElementById(canvasID).addEventListener("mousedown", function(){
  World.clear(engine.world, true); //clear matter engine, leave static
  mass = []; //clear mass array
spawnMass(0, 30, 10, 100, 15);
});

spawnMass(0, 30, 35, 90, 15);
function spawnMass(xIn, yIn, VxIn, VyIn, radius) {
  //spawn mass
    var i = mass.length
    mass.push();
    mass[i] = Bodies.circle(xIn * scale, canvas.height - (yIn - radius)*scale, radius * scale, {
      friction: 0.6,
      frictionStatic: 0.1,
      frictionAir: 0,
      restitution: 0.5,
    });

    Matter.Body.setVelocity(mass[i], {
      x: VxIn / 60 * scale,
      y: -VyIn / 60 * scale
    });
    //Matter.Body.setAngularVelocity(mass[i], 0.3);
    World.add(engine.world, mass[i]);
  }

//add walls flush with the edges of the canvas
var offset = 25;
World.add(engine.world, [
  Bodies.rectangle(canvas.width*0.5, -offset-1, canvas.width * 2 + 2 * offset, 50, { //top
    isStatic: true,
    friction: 1,
    frictionStatic: 1,
  }),
  Bodies.rectangle(canvas.width * 0.5, canvas.height + offset + 1, canvas.width * 2 + 2 * offset, 50, { //bottom
    isStatic: true,
    friction: 1,
    frictionStatic: 1,
  }),
  Bodies.rectangle(canvas.width + offset + 1, canvas.height * 0.5, 50, canvas.height * 2 + 2 * offset, { //right
    isStatic: true,
    friction: 1,
    frictionStatic: 1,
  }),
  //  Bodies.rectangle(-offset-1, canvas.height*0.5, 50, canvas.height * 2 + 2 * offset, {  //left
  //   isStatic: true,
  //   friction: 1,
  //   frictionStatic: 1,
  // })
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
    ctx.moveTo(bodies[i].position.x, bodies[i].position.y);
    var vertices = bodies[i].vertices;
    ctx.lineTo(vertices[0].x, vertices[0].y);
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
