
function preloadDuo() {
  ship1Img = loadImage(ship1b64);
  ship2Img = loadImage(ship2b64);
  thrust1Img = loadImage(thrust1b64);
  thrust2Img = loadImage(thrust2b64);
  lazerImg = loadImage(laser2b64);
  lazer2Img = loadImage(lazer2b64);
  ship1Invincibility = loadImage(shipInvincibilityb64);
  shipNoLife = loadImage(ship1NoLifeb64);

  largeAsteroid = loadImage(lg_asteroidb64);
  mediumAsteroid = loadImage(md_asteroidb64);
  smallAsteroid = loadImage(sm_asteroidb64);
}

function setupDuo() {
  
  // ship default spawn
  ship1 = new Ship(width / 2 - 50, height / 2, {up: 87,left: 65,right: 68,fire: 16}, lazerImg1);
  ship2 = new Ship(width / 2 + 50, height / 2, {up: UP_ARROW,left: LEFT_ARROW,right: RIGHT_ARROW,fire: 32}, lazerImg2);
  
  // asteroid default spawn
  spawnAsteroids(60, 5);  // large
  spawnAsteroids(40, 8);  // medium
  spawnAsteroids(20, 10); // small
}


function drawDuo() {
    if (over === true) {
        displayAllDuo(); // Keep the graveyard visible
        // You can add your Game Over text here later
    } 
    else if (!started) {
        // --- READY SCREEN ---
        displayAllDuo(); // Show ship/asteroids frozen in place
        drawOverlay("HOW TO PLAY", "Press ENTER to Begin", true);
    } 
    else if (paused) {
        // --- PAUSE SCREEN ---
        displayAllDuo(); 
        drawOverlay("PAUSED", "Press P to Resume", false);
    } 
    else {
        // --- ACTIVE GAMEPLAY ---
        
        // 1. Timer Calculation (Subtracting time spent paused)
        let currentSessionTime = millis() - gameStartTime - pausedTime;
        timer = floor(currentSessionTime / 1000);

        // 2. Difficulty Scaling (Your logic)
        if (timer > 0 && timer % 30 === 0 && timer !== lastDifficultyIncreaseTime) {
            spawnAsteroids(20, 10);
            spawnAsteroids(60, 2); 
            spawnAsteroids(40, 3); 
            lastDifficultyIncreaseTime = timer; 
        }

        // 3. Update & Display Everything
        updateAllDUo();
        displayAllDuo();

        // 4. Draw the Timer UI (Your specific style)
        textSize(displayWidth / 110);
        textAlign(LEFT, TOP);
        noStroke();
        strokeWeight(3);
        fill('#000000');
        text("Score: " + timer, 33, 33);
        fill('#39FF14');
        textFont(headers);
        text("Score: " + timer, 30, 30);
    }

}

function updateAllDuo() {
    // Ship
    ship1.update();
    ship2.update();

    // Lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].update();
        if (lasers[i].offScreen()) lasers.splice(i, 1);
    }

    // Asteroids
    for (let asteroid of asteroids) {
        asteroid.update();
    }

    // Powerups (Finals addition)
    if (timer > 0 && timer % 30 === 0 && timer !== powerupSpawnTracker) {
        powerups.push(new PowerupAsteroid());
        powerupSpawnTracker = timer;
    }
    for (let p of powerups) {
        p.update();
    }

    // --- ALL COLLISION LOGIC ---
    handleCollisions(); 

    checkLargeAsteroidRespawn();
    checkShipAsteroidCollision();
}

function displayAllDuo() {
    ship1.display();
    ship2.display();
    for (let l of lasers) l.display();
    for (let a of asteroids) a.display();
    for (let p of powerups) p.display();
}

function handleCollisions() {
    // Laser vs Asteroid
    for (let i = lasers.length - 1; i >= 0; i--) {
        for (let j = asteroids.length - 1; j >= 0; j--) {
            let d = dist(lasers[i].pos.x, lasers[i].pos.y, asteroids[j].pos.x, asteroids[j].pos.y);
            if (d < asteroids[j].r) {
                splitAsteroid(asteroids[j]);
                asteroids.splice(j, 1);
                lasers.splice(i, 1);
                break; 
            }
        }
    }

    // Laser vs Powerup
    for (let i = lasers.length - 1; i >= 0; i--) {
        for (let j = powerups.length - 1; j >= 0; j--) {
            let d = dist(lasers[i].pos.x, lasers[i].pos.y, powerups[j].pos.x, powerups[j].pos.y);
            if (d < powerups[j].r) {
                activatePowerup(); 
                powerups.splice(j, 1);
                lasers.splice(i, 1);
                break;
            }
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
	updateHighScore('duo', timer);

  	if (shipInvincible) {
    	if (millis() - shipInvincibleTime > currentInvincDuration) {
      	shipInvincible = false;
        currentInvincDuration = 3000;
    	}
    	return;
  	}

    let players = [ship1, ship2]; 
    for (let s of players) {
        for (let asteroid of asteroids) {
            let d = dist(s.pos.x, s.pos.y, asteroid.pos.x, asteroid.pos.y);
            if (d < asteroid.r + s.size / 2) {
                over = true;
                return;
            }
        }
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
  constructor(x, y, controls, laserImg) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.angle = 0;
    this.drag = 0.99;
    this.size = 40;
    this.isThrusting = false;
    this.controls = controls;
    this.laserImg = laserImg; 
  }

  update() {
    if (over === false) {
      if (keyIsDown(this.controls.left)) this.angle -= 0.08;
      if (keyIsDown(this.controls.right)) this.angle += 0.08;
      
      this.isThrusting = keyIsDown(this.controls.up);
      if (this.isThrusting) {
        let force = p5.Vector.fromAngle(this.angle);
        force.mult(0.2);
        this.vel.add(force);
      }
    }

    this.vel.mult(this.drag);
    this.pos.add(this.vel);

    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }
  
  fire() {
    return new Laser(this.pos, this.angle, this.laserImg);
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

  respawn() {
    this.pos = createVector(random(width), random(height));
    this.vel.set(0, 0);
    this.angle = 0;

    shipInvincible = true;
    shipInvincibleTime = millis();
  }
}



class Laser {
  constructor(shipPos, shipAngle, img) {
    this.pos = createVector(shipPos.x, shipPos.y);
    this.vel = p5.Vector.fromAngle(shipAngle);
    this.vel.mult(10);
    this.angle = shipAngle;
    this.img = img;
  }
   update() {
    this.pos.add(this.vel);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle + HALF_PI);
    imageMode(CENTER);
    image(this.img, 0, 0, 10, 30);
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

class PowerupAsteroid {
  constructor() {
    this.pos = createVector(random(width), -30);
    this.r = 25;
    this.vel = p5.Vector.random2D().mult(2);
  }
  update() {
    this.pos.add(this.vel);
    if (this.pos.x > width + this.r) this.pos.x = -this.r;
    if (this.pos.x < -this.r) this.pos.x = width + this.r;
    if (this.pos.y > height + this.r) this.pos.y = -this.r;
    if (this.pos.y < -this.r) this.pos.y = height + this.r;
  }

  // random shape muna kasi ala pa aq asset nagagawa
  display() {
    push();
    fill(255, 215, 0);
    noStroke();
    circle(this.pos.x, this.pos.y, this.r * 2);
    pop();
  }
}

function activatePowerup() {
  let roll = floor(random(3));
  
  if (roll === 0) {
    // skill 1: invincibility 20 sec
    shipInvincible = true;
    shipInvincibleTime = millis();
    currentInvincDuration = 20000; 
  } else if (roll === 1) {
    // skill 2L timer jump for 10sec
    gameStartTime -= 10000; 
  } else if (roll === 2) {
    // skill 3: burst laser
    multiShotActive = true;
    multiShotEndTime = millis() + 15000;
  }
}

// for the gameOver
function resetDuo() {

  started = false;
  paused = false;

  over = false;
  
  asteroids = [];
  lasers = [];

  powerups = [];
  multiShotActive = false;
  multiShotEndTime = 0;
  powerupSpawnTracker = 0;
  currentInvincDuration = 3000;

  ship1 = new Ship(width / 2 - 50, height / 2, {up: 87, left: 65, right: 68, fire: 16}, lazerImg1);
  ship2 = new Ship(width / 2 + 50, height / 2, {up: UP_ARROW, left: LEFT_ARROW, right: RIGHT_ARROW, fire: 32}, lazerImg2);
  ship.pos = createVector(width / 2, height / 2);
  ship.vel.set(0, 0);

  // reset timer
  timer = 0;
  pausedTime = 0;
  spawnAsteroids(60, 5);  // large
  spawnAsteroids(40, 8);  // medium
  spawnAsteroids(20, 10); // small
  
  lastDifficultyIncreaseTime = 0;
  
}

// controls for solo 
function handleDuoControls() {
    // --- 1. START TRIGGER (Enter) ---
    if (!started && keyCode === ENTER) {
        started = true;
        gameStartTime = millis();
        pausedTime = 0;
        return; // Exit so we don't accidentally shoot on the same frame
    }

    // --- 2. PAUSE TRIGGER (P) ---
    if (started && !over && (keyCode === 80 || key.toLowerCase() === 'p')) {
        paused = !paused;
        if (paused) {
            pauseStartTime = millis();
        } else {
            pausedTime += (millis() - pauseStartTime);
        }
    }

    // --- 3. SHOOTING & POWERUPS (Shift) ---
    // We only shoot if the game is started, NOT paused, and NOT over
    if (started && !paused && !over) {
        // Player 1 Shooting
        if (keyCode === ship1.controls.fire) {
            if (multiShotActive && millis() < multiShotEndTime) {
                lasers.push(new Laser(ship1.pos, ship1.angle, ship1.laserImg));
                lasers.push(new Laser(ship1.pos, ship1.angle - 0.2, ship1.laserImg));
                lasers.push(new Laser(ship1.pos, ship1.angle + 0.2, ship1.laserImg));
            } else {
                lasers.push(ship1.fire());
            }
        }
        // Player 2 Shooting
        if (keyCode === ship2.controls.fire) {
            if (multiShotActive && millis() < multiShotEndTime) {
                lasers.push(new Laser(ship2.pos, ship2.angle, ship2.laserImg));
                lasers.push(new Laser(ship2.pos, ship2.angle - 0.2, ship2.laserImg));
                lasers.push(new Laser(ship2.pos, ship2.angle + 0.2, ship2.laserImg));
            } else {
                lasers.push(ship2.fire());
            }
        }
    }
}