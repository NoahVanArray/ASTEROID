function preloadSolo() {
    ship1Img = loadImage('assets/graphics/spaceships/ship1.png');
    thrust1Img = loadImage('assets/graphics/spaceships/thrust1.png');
    lazerImg = loadImage('assets/graphics/bullets/laser1.png');
    ship1Invincibility = loadImage('assets/graphics/spaceships/shipInvincibility.png');
    shipNoLife = loadImage('assets/graphics/spaceships/ship1LoseLives.png');

    largeAsteroid = loadImage("assets/graphics/asteroids/large.png");
    mediumAsteroid = loadImage("assets/graphics/asteroids/medium.png");
    smallAsteroid = loadImage("assets/graphics/asteroids/small.png");

    powerupAsteroidImg = loadImage("assets/graphics/asteroids/specialPower_2-NoBGpng.png");

    alienImg = loadImage("assets/graphics/spaceships/alien3.png"); 
    alienLaserImg = loadImage("assets/graphics/bullets/laser3.png");
    lastAlienSpawnTime = millis();
}

function setupSolo() {
  
  // ship default spawn
  ship = new Ship1(width/2, height/2, { up: 87, left: 65, right: 68 });
  aliens = []; 
  alienLasers = [];
  
  // asteroid default spawn
  spawnAsteroids(60, 5);  // large
  spawnAsteroids(40, 8);  // medium
  spawnAsteroids(20, 10); // small
}


function drawSolo() {
    if (overState === true) {
        displayAllSolo(); 
    } 
    else if (!started) {
        displayAllSolo(); 
        drawOverlay("HOW TO PLAY", "Press ENTER to Begin", true);
    } 
    else if (paused) {
        displayAllSolo(); 
        drawOverlay("PAUSED", "Press P to Resume", true);
    } 
    else {
        // --- GAME IS RUNNING ---
        let currentSessionTime = millis() - gameStartTime - pausedTime;
        timer = floor(currentSessionTime / 1000);

        if (timer > 0 && timer % 30 === 0 && timer !== lastDifficultyIncreaseTime) {
          spawnAsteroids(20, 10);
          spawnAsteroids(60, 2); 
          spawnAsteroids(40, 3); 
          lastDifficultyIncreaseTime = timer; 
        }

        if (timer > highScores.solo && !hsAnnounced && timer > 0) {
          updateHighScore('solo', timer); 
          hsAnnounced = true;
          hsPopupTimer = 180;
          if (typeof newHighScoreSound !== 'undefined') newHighScoreSound.play();
        }

        updateAllSolo();
        displayAllSolo();

        // ===== FIX #1: Only spawn if no aliens exist, and reset timer after death =====
        if (aliens.length === 0 && millis() - lastAlienSpawnTime > ALIEN_SPAWN_INTERVAL) {
            aliens.push(new Alien());
            lastAlienSpawnTime = millis(); // Reset the timer after spawn
        }

        // 2. Update and Draw Aliens
        for (let i = aliens.length - 1; i >= 0; i--) {
            // Remove alien after 2 second flash
            if (aliens[i].hitTime !== null && millis() - aliens[i].hitTime > 800) {
                aliens.splice(i, 1);
                continue;
            }

            aliens[i].update([ship]); 
            aliens[i].display();

            if (aliens[i].hitTime === null) { // Only check laser hits if not already hit
                for (let j = lasers.length - 1; j >= 0; j--) {
                    if (dist(lasers[j].pos.x, lasers[j].pos.y, aliens[i].pos.x, aliens[i].pos.y) < aliens[i].r) {
                        aliens[i].hitTime = millis();
                        lasers.splice(j, 1);
                        if (typeof asteroidSound !== 'undefined') asteroidSound.play();
                        break;
                    }
                }
            }
        }
        // 3. Update Alien Lasers & Check Player Hit
        for (let i = alienLasers.length - 1; i >= 0; i--) {
            alienLasers[i].update();
            alienLasers[i].display();

            // FIXED: Used ship.size / 2 for the hitbox
            if (!shipInvincible && dist(alienLasers[i].pos.x, alienLasers[i].pos.y, ship.pos.x, ship.pos.y) < (ship.size / 2) + alienLasers[i].r) {
                if (typeof gameOverSound !== 'undefined') gameOverSound.play();
                overState = true; 
                alienLasers.splice(i, 1);
                continue;
            }

            if (alienLasers[i].offscreen()) {
                alienLasers.splice(i, 1);
            }
        }

        // UI Drawing
        textSize(displayWidth / 110);
        textAlign(LEFT, TOP);
        noStroke();
        strokeWeight(3);
        push();
        drawingContext.shadowColor = color('#000000'); 
        drawingContext.shadowBlur = 20;
        fill('#000000');
        text("TIME " + timer, 33, 33);
        pop();
        
        push();
        drawingContext.shadowColor = color('#39FF14'); 
        drawingContext.shadowBlur = 20;
        fill('#39FF14');
        textFont(headers);
        text("TIME: " + timer, 30, 30);
        pop();
        
        textSize(displayWidth / 110); 
        textAlign(RIGHT, TOP);
        noStroke();

        push();
        drawingContext.shadowColor = color('#000000'); 
        drawingContext.shadowBlur = 20;
        fill(0);
        text("BEST: " + highScores.solo, width - 33, 33);
        pop();
        
        textFont(headers);
        fill(255, 200, 0); 
        text("BEST: " + highScores.solo, width - 30, 30);

        if (hsPopupTimer > 0) {
          push();
          if (floor(hsPopupTimer / 10) % 2 === 0) { 
            drawingContext.shadowColor = color(57, 255, 20);
            drawingContext.shadowBlur = 20;
            fill(57, 255, 20);
            textSize(32);
            textAlign(CENTER);
            textFont(headers);
            text("NEW HIGH SCORE!", width / 2, 100);
            highScores.solo = timer; 
          }
          hsPopupTimer--;
          pop();
        }

        if (plusTenTimer > 0) {
            textSize(displayWidth / 110);
            textFont(headers);
            fill(255, 200, 0, plusTenTimer * 8); 
            text('+10!', 180, 50);
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
    for (let al of aliens) al.display();
    for (let al of alienLasers) al.display();
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
      bgm.stop();
      gameOverSound.play();
      overState = true;
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

  overState = false;
  
  asteroids = [];
  lasers = [];
  aliens = []; // ===== FIX: Clear aliens array =====
  alienLasers = []; // ===== FIX: Clear alien lasers array =====

  powerups = [];
  multiShotActive = false;
  multiShotEndTime = 0;
  powerupSpawnTracker = 0;
  currentInvincDuration = 3000;

  ship = new Ship1(width / 2, height / 2, { 
    up: 87, 
    left: 65, 
    right: 68, 
    shoot: 16 
  });
  ship.pos = createVector(width / 2, height / 2);
  ship.vel.set(0, 0);

  // reset timer
  timer = 0;
  pausedTime = 0;
  spawnAsteroids(60, 5);  // large
  spawnAsteroids(40, 8);  // medium
  spawnAsteroids(20, 10); // small
  
  lastDifficultyIncreaseTime = 0;
  lastAlienSpawnTime = millis(); // ===== FIX: Reset alien spawn timer =====
  
  hsAnnounced = false; 
  hsPopupTimer = 0;
}

// controls for solo 
function handleSoloControls() {
    // --- 1. START TRIGGER (Enter) ---
    if (!started && keyCode === ENTER) {
        keyPressSound.play();
        bgm.loop(); // <-- ADDED: Start music on Enter
        started = true;
        gameStartTime = millis();
        pausedTime = 0;
        return; 
    }

    // --- 2. PAUSE TRIGGER (P) ---
    if (started && !overState && (keyCode === 80 || key.toLowerCase() === 'p')) {
        paused = !paused;
        if (paused) {
            pauseStartTime = millis();
            bgm.pause(); // <-- ADDED: Pause music
        } else {
            pausedTime += (millis() - pauseStartTime);
            bgm.loop(); // <-- ADDED: Resume music
        }
        keyPressSound.play();
    }

    // USE F TO SHOOT 
    // --- 3. SHOOTING & POWERUPS (Shift) ---
    // We only shoot if the game is started, NOT paused, and NOT over
    if (started && !paused && !overState && keyCode === 70) {
        // Checking for the Skill 3 (Burst Fire) Powerup
        if (multiShotActive && millis() < multiShotEndTime) {
            upgradedLaserSound.play();
            lasers.push(new Laser1(ship.pos, ship.angle));        // Center
            lasers.push(new Laser1(ship.pos, ship.angle - 0.2));  // Left
            lasers.push(new Laser1(ship.pos, ship.angle + 0.2));  // Right
        } else {
            lasers.push(ship.fire()); // Normal single laser
            laserSound.play();
        }
    }
}