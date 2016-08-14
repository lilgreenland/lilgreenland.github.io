var particles = function() {
    // canvas setup
    var canvasID = "canvas0";
    var canvas = document.getElementById(canvasID);
    var ctx = canvas.getContext("2d");
    ctx.font = "15px Arial";

    var pause = false;

    var physics = { //settings for all masses
        gravX: 0,
        gravY: 0.01, //9.81 / 60,
        restitution: 1,
        airFriction: 1,
    }

    document.getElementById("energy").addEventListener("click", function() {
        if (physics.restitution === 1) {
            physics.restitution = 0.8;
            physics.airFriction = 0.9995;
            document.getElementById("energy").innerHTML = "friction: ON";
        } else {
            physics.restitution = 1;
            physics.airFriction = 1;
            document.getElementById("energy").innerHTML = "friction: OFF";
        }
    });

    document.getElementById("pause").addEventListener("click", function() {
        if (pause) {
            pause = false;
            render();
        } else {
            pause = true;
        }
    });


    function mass(x, y, Vx, Vy, r, fillColor) { //constructor function that determines how masses work
        this.x = x;
        this.y = y;
        this.Vx = Vx;
        this.Vy = Vy;
        this.r = r;
        this.mass = Math.PI * this.r * this.r * 0.01; //pi r squared * density
        this.energy = 0;
        this.ke = 0;
        this.pe = 0;
        this.fillColor = fillColor;
        this.draw = function() {
            ctx.fillStyle = this.fillColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        };
        this.move = function() {
            this.x += this.Vx;
            this.y += this.Vy;
            this.Vx *= physics.airFriction;
            this.Vy *= physics.airFriction;
        };
        this.edges = function() {
            if (this.x > canvas.width - this.r) {
                this.Vx *= -physics.restitution
                this.x = canvas.width - this.r;
            } else if (this.x < this.r) {
                this.Vx *= -physics.restitution
                this.x = this.r;
            };
            if (this.y > canvas.height - this.r) {
                this.Vy *= -physics.restitution
                this.y = canvas.height - this.r;
            } else if (this.y < this.r) {
                this.Vy *= -physics.restitution
                this.y = this.r;
            };
        };
        this.gravity = function() {
            this.Vx += physics.gravX;
            this.Vy += physics.gravY;
        };
        this.calcEnergy = function(){
            var speed2 = this.Vx * this.Vx + this.Vy * this.Vy;
            this.ke = 0.5 * this.mass * speed2;
            var height = canvas.height - this.r - this.y;
            this.pe = this.mass * physics.gravY * height;
        }
        this.info = function() {
            this.calcEnergy();
            //bars
            ctx.fillStyle = 'violet';
            ctx.fillRect(0, 0, canvas.width * (this.ke / (this.energy)), 20)
            ctx.fillStyle = 'cyan';
            ctx.fillRect(0, 20, canvas.width * (this.pe / (this.energy)), 20)
            //heat bar
            if (physics.restitution != 1){
                ctx.fillStyle = 'lightgrey';
                ctx.fillRect(canvas.width, 0, -canvas.width * (1-(this.pe + this.ke)/this.energy), 40)
            }
            //text
            ctx.fillStyle = '#000';
            ctx.fillText('KE = ½mv² = ' + (this.ke).toFixed(0) + 'J', 5, 15);
            ctx.fillText('PE = mgh = ' + (this.pe).toFixed(0) + 'J', 5, 35);
            //ctx.fillText('PE + KE = ' + (PE + KE).toFixed(0) + 'J', 5, 55);
            //ctx.fillText('Vx = ' + (this.Vx).toFixed(0) + 'm/s', 5, 30);
            //ctx.fillText('Vy = ' + this.Vy.toFixed(1) + 'm/s', 5, 75);
        };
    }



    var box;

    function spawn() {
        box = new mass(50, 50, 1, 0, 20, //mass(x, y, Vx, Vy ,r, fillColor)
            randomColor({
                luminosity: 'light',
            })
        );
        box.calcEnergy();
        box.energy = box.pe+box.ke;
    }
    spawn();
    document.getElementById(canvasID).addEventListener("mousedown", function() {
        spawn();
    });


    window.requestAnimationFrame(render);

    function render() { //repeating animation function
        if (!pause) {
            window.requestAnimationFrame(render);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            box.edges();
            box.gravity();
            box.move();
            box.draw();
            box.info();
        }
    }

}
