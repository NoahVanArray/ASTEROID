
function preloadSolo() {
  ship1Img = loadImage(ship1b64);
  thrust1Img = loadImage(thrust1b64);
  lazerImg = loadImage(laser2b64);
  ship1Invincibility = loadImage(shipInvincibilityb64);
  shipNoLife = loadImage(ship1NoLifeb64);

  largeAsteroid = loadImage(lg_asteroidb64);
  mediumAsteroid = loadImage(md_asteroidb64);
  smallAsteroid = loadImage(sm_asteroidb64);
}

function setupSolo() {
  createCanvas(windowWidth, windowHeight);
  
  // ship default spawn
  ship = new Ship();
  
  // asteroid default spawn
  spawnAsteroids(60, 5);  // large
  spawnAsteroids(40, 8);  // medium
  spawnAsteroids(20, 10); // small
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function drawSolo() {

	if (over === true){


	}
	else{
		let currentSessionTime = millis() - gameStartTime;
	    timer = floor(currentSessionTime / 1000);
		textSize(windowWidth/16);
		textAlign(CENTER);
	  	noFill();
	  	stroke(250);
	  	strokeWeight(3);
	  	textFont(headers);
	  	text(timer, width / 2, height / 2);
	}

  // ship location logic
  ship.update();
  ship.display();

  // lazer logic
  for (let i = lasers.length - 1; i >= 0; i--) {
    lasers[i].update();
    lasers[i].display();
    
    if (lasers[i].offScreen()) {
      lasers.splice(i, 1);
    }
  }

  // asteroid logic
  for (let asteroid of asteroids) {
    asteroid.update();
    asteroid.display();
  }

  // laser–asteroid collision
  for (let i = lasers.length - 1; i >= 0; i--) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
      let d = dist(
        lasers[i].pos.x,
        lasers[i].pos.y,
        asteroids[j].pos.x,
        asteroids[j].pos.y
      );

      if (d < asteroids[j].r) {
        // split asteroid
        splitAsteroid(asteroids[j]);

        // remove hit asteroid & laser
        asteroids.splice(j, 1);
        lasers.splice(i, 1);
        break;
      }
    }
  }

  checkLargeAsteroidRespawn();
  checkShipAsteroidCollision();
}

function keyPressedSolo() {
  if (keyCode === SHIFT) {
  	if (!over){
  	    lasers.push(ship.fire());
  	}
  }
}

function spawnAsteroids(size, count) {
  for (let i = 0; i < count; i++) {
    asteroids.push(new Asteroid(null, size));
  }
}

function splitAsteroid(asteroid) {
  let pieces = 3;
  let newSize;

  if (asteroid.r === 60) {
    newSize = 40; // large to medium
  } else if (asteroid.r === 40) {
    newSize = 20; // medium to small
  } else {
    return; // small asteroid: no split
  }

  for (let i = 0; i < pieces; i++) {
    let newPos = asteroid.pos.copy();
    let newAsteroid = new Asteroid(newPos, newSize);

    asteroids.push(newAsteroid);
  }
}

function checkShipAsteroidCollision() {
	updateHighScore('solo', timer);

  	if (shipInvincible) {
    	if (millis() - shipInvincibleTime > INVINCIBILITY_DURATION) {
      	shipInvincible = false;
    	}
    	return;
  	}

  for (let asteroid of asteroids) {
    let d = dist(
      ship.pos.x,
      ship.pos.y,
      asteroid.pos.x,
      asteroid.pos.y
    );

    if (d < asteroid.r + ship.size / 2) {
      
      over = true;
      timer = timer;
      // ship.respawn();
      break;
    }
  }
}

function checkLargeAsteroidRespawn() {
  let largeCount = asteroids.filter(a => a.r === 60).length;

  if (largeCount === 0) {
    if (largeAsteroidTimer === 0) {
      largeAsteroidTimer = millis();
    }

    if (millis() - largeAsteroidTimer > LARGE_RESPAWN_DELAY) {
      spawnAsteroids(60, 5); // respawn 5 large
      largeAsteroidTimer = 0;
    }
  } else {
    // reset timer if even ONE large asteroids exists
    largeAsteroidTimer = 0;
  }
}



class Ship {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.vel = createVector(0, 0);
    this.angle = 0;
    this.drag = 0.99;
    this.size = 40;
    this.isThrusting = false;
  }

  update() {
    // rotate
    if (over === false){
        if (keyIsDown(65)) this.angle -= 0.08; // A
        if (keyIsDown(68)) this.angle += 0.08; // D
	    // thrust
	    this.isThrusting = keyIsDown(87); // W
	    if (this.isThrusting) {
	      let force = p5.Vector.fromAngle(this.angle);
	      force.mult(0.2);
	      this.vel.add(force);
	    }
    }

    // physics (anueraw????? eme HAHAHAHHA)
    this.vel.mult(this.drag);
    this.pos.add(this.vel);

    // screeen size
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  display() {
    if (shipInvincible) {
    if (floor(millis() % 200) < 100) {
      return; 
    }
  }

  let currentImg = this.isThrusting ? (over ? ship1Img : thrust1Img): ship1Img;
  push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle + HALF_PI);
    imageMode(CENTER);
    image(currentImg, 0, 0, this.size, this.size);
  pop();
}

  fire() {
    return new Laser(this.pos, this.angle);
  }

  respawn() {
    this.pos = createVector(random(width), random(height));
    this.vel.set(0, 0);
    this.angle = 0;

    shipInvincible = true;
    shipInvincibleTime = millis();
  }
}



class Laser {
  constructor(shipPos, shipAngle) {
    this.pos = createVector(shipPos.x, shipPos.y);
    this.vel = p5.Vector.fromAngle(shipAngle);
    this.vel.mult(10); // lazerspeed
    this.angle = shipAngle;
  }
   update() {
    this.pos.add(this.vel);
  }

  display() {
    push();
      translate(this.pos.x, this.pos.y);
      rotate(this.angle + HALF_PI);
      imageMode(CENTER);
      image(lazerImg, 0, 0, 10, 30);
    pop();
  }

  offScreen() {
    return (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0);
  }
}



class Asteroid {
  constructor(p, r) {
    if (p) {
      this.pos = p.copy();
    } else {
      let side = floor(random(4));
      
      if (side === 0) { // top
        this.pos = createVector(random(width), -r || -60);
      } else if (side === 1) { // bot
        this.pos = createVector(random(width), height + (r || 60));
      } else if (side === 2) { // left
        this.pos = createVector(-r || -60, random(height));
      } else { // right
        this.pos = createVector(width + (r || 60), random(height));
      }
    }
    
    this.r = r || 60;
    this.vel = p5.Vector.random2D().mult(random(0.30, 1));
    this.rotation = random(TWO_PI);
    this.rotSpeed = random(-0.02, 0.02);
  }

  update() {
    this.pos.add(this.vel);
    this.rotation += this.rotSpeed;
    if (this.pos.x > width + this.r) this.pos.x = -this.r;
    if (this.pos.x < -this.r) this.pos.x = width + this.r;
    if (this.pos.y > height + this.r) this.pos.y = -this.r;
    if (this.pos.y < -this.r) this.pos.y = height + this.r;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    imageMode(CENTER);
    let img = smallAsteroid;
    if (this.r === 60) img = largeAsteroid;
    if (this.r === 40) img = mediumAsteroid;
    image(img, 0, 0, this.r * 2, this.r * 2);
    pop();
  }
}

// for the gameOver
function resetSolo() {

    asteroids = [];
    lasers = [];

    ship = new Ship();
    ship.pos = createVector(width / 2, height / 2);
    ship.vel.set(0, 0);

    // reset timer
    gameStartTime = millis();
    timer = 0;

    spawnAsteroids(60, 5);  // large
    spawnAsteroids(40, 8);  // medium
    spawnAsteroids(20, 10); // small
    
    over = false;
}