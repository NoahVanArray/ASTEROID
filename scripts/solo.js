
function preloadSolo() {
    ship1Img = loadImage('assets/graphics/spaceships/ship1.png');
    thrust1Img = loadImage('assets/graphics/spaceships/thrust1.png');
    lazerImg = loadImage('assets/graphics/bullets/laser1.png');
    ship1Invincibility = loadImage('assets/graphics/spaceships/shipInvincibility.png');
    shipNoLife = loadImage('assets/graphics/spaceships/ship1LoseLives.png');

  largeAsteroid = loadImage("assets/graphics/asteroids/large.png");
  mediumAsteroid = loadImage("assets/graphics/asteroids/medium.png");
  smallAsteroid = loadImage("assets/graphics/asteroids/small.png");
  specialPowerAsteroid1 = loadImage("assets/graphics/asteroids/specialPower 1.png");
  specialPowerAsteroid2 = loadImage("assets/graphics/asteroids/specialPower 2.png");
    largeAsteroid = loadImage("assets/graphics/asteroids/large.png");
    mediumAsteroid = loadImage("assets/graphics/asteroids/medium.png");
    smallAsteroid = loadImage("assets/graphics/asteroids/small.png");

    powerupAsteroidImg = loadImage("assets/graphics/asteroids/specialPower_2-NoBGpng.png");

    alienImg = loadImage("assets/graphics/spaceships/alien3.png"); 
    alienLaserImg = loadImage("assets/graphics/bullets/laser3.png");
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
        // ready
        displayAllSolo(); 
        drawOverlay("HOW TO PLAY", "Press ENTER to Begin", true);

    } 
    else if (paused) {
        // pause
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
          updateHighScore('solo', timer); 
          
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

    // random alien spawn
    if (started && !paused && !overState && random(1) < 0.005 && aliens.length < 1) {
        aliens.push(new Alien());
    }

    // update and display aliean
    for (let i = aliens.length - 1; i >= 0; i--) {
        aliens[i].update([ship]);
        aliens[i].display();

        // laser hit aliean
        for (let j = lasers.length - 1; j >= 0; j--) {
            if (dist(lasers[j].pos.x, lasers[j].pos.y, aliens[i].pos.x, aliens[i].pos.y) < aliens[i].r) {
                aliens.splice(i, 1);
                lasers.splice(j, 1);
                break;
            }
        }
    }

    // update alien laser
    for (let i = alienLasers.length - 1; i >= 0; i--) {
        alienLasers[i].update();
        alienLasers[i].display();

        // alen hits player
        if (!shipInvincible && dist(alienLasers[i].pos.x, alienLasers[i].pos.y, ship.pos.x, ship.pos.y) < ship.r) {
            ship.lives -= 1;
            alienLasers.splice(i, 1);
            continue;
        }

        if (alienLasers[i].offscreen()) {
            alienLasers.splice(i, 1);
        }
    }
}

function updateAllSolo() {
    // hhip
    ship.update();

    // lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].update();
        if (lasers[i].offScreen()) lasers.splice(i, 1);
    }

    // asteroids
    for (let asteroid of asteroids) {
        asteroid.update();
    }

    // powerups (finals addition)
    if (timer > 0 && timer % 30 === 0 && timer !== powerupSpawnTracker) {
        powerups.push(new PowerupAsteroid());
        powerupSpawnTracker = timer;
    }
    for (let p of powerups) {
        p.update();
    }

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
    // laser vs asteroid
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

    // laser vs powerup
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
      spawnAsteroids(60, 5);
      largeAsteroidTimer = 0;
    }
  } else {
    // reset timer if even ONE large asteroids exists
    largeAsteroidTimer = 0;
  }
}







function activatePowerup(p) {
  
  if (p.type === 0) {
    // skill 1: invincibility
    shipInvincible = true;
    shipInvincibleTime = millis();
    currentInvincDuration = 20000; 
  } 
  else if (p.type === 1) {
    // skill 2: +10 seconds pop-up
    addScorePowerUpSound.play();
    plusTenActive = true;
    plusTenTimer = POPUP_DURATION; 
  }
  else if (p.type === 2) {
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
  
  hsAnnounced = false; 
  hsPopupTimer = 0;
}

// controls for solo 
function handleSoloControls() {
    // start
    if (!started && keyCode === ENTER) {
        keyPressSound.play();
        if (!bgm.isPlaying()) {
            bgm.loop();
        }
        started = true;
        gameStartTime = millis();
        pausedTime = 0;
        return;
    }

    // pause
    if (started && !overState && (keyCode === 80 || key.toLowerCase() === 'p')) {
        paused = !paused;
        if (paused) {
            pauseStartTime = millis();
        } else {
            pausedTime += (millis() - pauseStartTime);
        }
        keyPressSound.play();
    }

    // shooting
    if (started && !paused && !overState && keyCode === 70) {
        if (multiShotActive && millis() < multiShotEndTime) {
            upgradedLaserSound.play();
            lasers.push(new Laser1(ship.pos, ship.angle));  // center
            lasers.push(new Laser1(ship.pos, ship.angle - 0.2));  // left
            lasers.push(new Laser1(ship.pos, ship.angle + 0.2));  // right
        } else {
            lasers.push(ship.fire());
            laserSound.play();
        }
    }
}