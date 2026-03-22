
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
  
  // ship default spawn
  ship = new Ship();
  
  // asteroid default spawn
  spawnAsteroids(60, 5);  // large
  spawnAsteroids(40, 8);  // medium
  spawnAsteroids(20, 10); // small
}


function drawSolo() {
    if (over === true) {
        displayAllSolo(); 
    } 
    else if (!started) {
        // --- READY SCREEN ---
        displayAllSolo(); // Show ship/asteroids frozen in place
        drawOverlay("HOW TO PLAY", "Press ENTER to Begin", true);
    } 
    else if (paused) {
        // --- PAUSE SCREEN ---
        displayAllSolo(); 
        drawOverlay("PAUSED", "Press P to Resume", true);
    } 
    else {
        let currentSessionTime = millis() - gameStartTime - pausedTime;
        timer = floor(currentSessionTime / 1000);

        if (timer > 0 && timer % 30 === 0 && timer !== lastDifficultyIncreaseTime) {
          spawnAsteroids(20, 10);
          spawnAsteroids(60, 2); 
          spawnAsteroids(40, 3); 
          lastDifficultyIncreaseTime = timer; 
        }

        if (timer > highScores.solo && !hsAnnounced && timer > 0) {
          // 1. Save it to local storage permanently!
          updateHighScore('solo', timer); 
          
          // 2. Trigger the visuals
          hsAnnounced = true;
          hsPopupTimer = 180;
          newHighScoreSound.play();
        }

        updateAllSolo();
        displayAllSolo();

        textSize(displayWidth / 110);
        textAlign(LEFT, TOP);
        noStroke();
        strokeWeight(3);
        fill('#000000');
        text("Score: " + timer, 33, 33);
        fill('#39FF14');
        textFont(headers);
        text("Score: " + timer, 30, 30);

        textSize(displayWidth / 110); // Keeping your same scale
        textAlign(RIGHT, TOP);
        noStroke();

        // 1. Shadow/Offset for readability (Black)
        fill(0);
        text("Best: " + highScores.solo, width - 33, 33);

        // 2. Main Text (Neon Gold/Yellow looks great for a record)
        textFont(headers);
        fill(255, 200, 0); 
        text("Best: " + highScores.solo, width - 30, 30);

        if (hsPopupTimer > 0) {
          push();
          // 1. Make it blink using the timer
          // If the timer is even, show it; if odd, hide it (rapid blink)
          if (floor(hsPopupTimer / 10) % 2 === 0) { 
              
            // 2. Add that Neon Glow
            drawingContext.shadowColor = color(57, 255, 20); // Neon Green
            drawingContext.shadowBlur = 20;
            
            fill(57, 255, 20);
            textSize(32);
            textAlign(CENTER);
            textFont(headers);
            
            // Position it just above the player or at the top center
            text("NEW HIGH SCORE!", width / 2, 100);
            
            // 3. Update the high score in real-time on the UI
            // This ensures the "High Score" number at the top matches your current score immediately
            highScores.solo = timer; 
          }
          
          hsPopupTimer--; // Count down until it disappears
          pop();
        }

        if (plusTenTimer > 0) {
            textSize(displayWidth / 110);
            textFont(headers);
            fill(255, 200, 0, plusTenTimer * 8); // Multiplier depends on how fast you want it to fade
            text('+10!', 200, 30);
            
            plusTenTimer--;
            
        }

    }

}

function updateAllSolo() {
    // Ship
    ship.update();

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

function displayAllSolo() {
    ship.display();
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
                asteroidSound.play();
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
                powerUpSound.play();
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
	updateHighScore('solo', timer);

  if (shipInvincible) {
  	if (millis() - shipInvincibleTime > currentInvincDuration) {
    	shipInvincible = false;
      currentInvincDuration = 3000;
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
      gameOverSound.play();
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
  } 

  else if (roll === 1) {
    // skill 2: timer jump for 10sec
    addScorePowerUpSound.play();
    gameStartTime -= 10000; 
    
    // --- TRIGGER THE DISPLAY ---
    plusTenTimer = 90; // Show for 1.5 seconds (at 60fps)
  }

  else if (roll === 2) {
    // skill 3: burst laser
    multiShotActive = true;
    multiShotEndTime = millis() + 15000;
  }
}

// for the gameOver
function resetSolo() {

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

  ship = new Ship();
  ship.pos = createVector(width / 2, height / 2);
  ship.vel.set(0, 0);

  // reset timer
  timer = 0;
  pausedTime = 0;
  spawnAsteroids(60, 5);  // large
  spawnAsteroids(40, 8);  // medium
  spawnAsteroids(20, 10); // small
  
  lastDifficultyIncreaseTime = 0;
  
  hsAnnounced = false; 
  hsPopupTimer = 0;
}

// controls for solo 
function handleSoloControls() {
    // --- 1. START TRIGGER (Enter) ---
    if (!started && keyCode === ENTER) {
        keyPressSound.play();
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
        keyPressSound.play();
    }

    // --- 3. SHOOTING & POWERUPS (Shift) ---
    // We only shoot if the game is started, NOT paused, and NOT over
    if (started && !paused && !over && keyCode === SHIFT) {
        // Checking for the Skill 3 (Burst Fire) Powerup
        if (multiShotActive && millis() < multiShotEndTime) {
            upgradedLaserSound.play();
            lasers.push(new Laser(ship.pos, ship.angle));        // Center
            lasers.push(new Laser(ship.pos, ship.angle - 0.2));  // Left
            lasers.push(new Laser(ship.pos, ship.angle + 0.2));  // Right
        } else {
            lasers.push(ship.fire()); // Normal single laser
            laserSound.play();
        }
    }
}