
// duo.js
let ship1, ship2;

function preloadDuo() {
  ship1Img = loadImage('assets/graphics/spaceships/ship1.png');
  thrust1Img = loadImage('assets/graphics/spaceships/thrust1.png');
  lazerImg = loadImage('assets/graphics/bullets/laser1.png');
  ship1Invincibility = loadImage('assets/graphics/spaceships/shipInvincibility.png');

  ship2Img = loadImage('assets/graphics/spaceships/ship2.png');
  thrust2Img = loadImage('assets/graphics/spaceships/thrust2.png');
  lazer2Img = loadImage('assets/graphics/bullets/laser2.png');
  ship2Invincibility = loadImage('assets/graphics/spaceships/shipInvincibility.png');

  largeAsteroid = loadImage("assets/graphics/asteroids/large.png");
  mediumAsteroid = loadImage("assets/graphics/asteroids/medium.png");
  smallAsteroid = loadImage("assets/graphics/asteroids/small.png");
}

function setupDuo() {
    ship1 = new Ship1(width/2 - 100, height/2, { up: 87, left: 65, right: 68 });
    ship2 = new Ship2(width/2 + 100, height/2, { up: 38, left: 37, right: 39 });
    
    // Reset universal flags and arrays
    overState = false;
    started = false; 
    paused = false;
    
    asteroids = [];
    lasers = [];
    powerups = [];
    
    multiShotActive = false;
    multiShotEndTime = 0;
    powerupSpawnTracker = 0;
    currentInvincDuration = 3000;

    timer = 0;
    pausedTime = 0;
    lastDifficultyIncreaseTime = 0;
    
    hsAnnounced = false; 
    hsPopupTimer = 0;

    // Use your Solo spawn function!
    spawnAsteroids(60, 5);  // large
    spawnAsteroids(40, 8);  // medium
    spawnAsteroids(20, 10); // small
}

function drawDuo() {
    if (overState === true) {
        displayAllDuo(); 
    } 
    else if (!started) {
        displayAllDuo(); 
        drawOverlay("DUO MODE", "Press ENTER to Begin", true);
    } 
    else if (paused) {
        displayAllDuo();
        drawOverlay("PAUSED", "Press P to Resume", true);
    } 
    else {
        // --- 1. TIMER & SCALING (Copied from Solo) ---
        let currentSessionTime = millis() - gameStartTime - pausedTime;
        timer = floor(currentSessionTime / 1000);

        if (timer > 0 && timer % 30 === 0 && timer !== lastDifficultyIncreaseTime) {
          spawnAsteroids(20, 10);
          spawnAsteroids(60, 2); 
          spawnAsteroids(40, 3); 
          lastDifficultyIncreaseTime = timer; 
        }

        // --- 2. HIGH SCORE CHECK ---
        if (timer > highScores.duo && !hsAnnounced && timer > 0) {
            updateHighScore('duo', timer); 
            hsAnnounced = true;
            hsPopupTimer = 180;
            if (typeof newHighScoreSound !== 'undefined') newHighScoreSound.play();
        }

        // --- 3. GAME UPDATES ---
        updateAllDuo();
        displayAllDuo();

        // --- 4. HUD STYLING (Copied from Solo) ---
        textSize(displayWidth / 110);
        textAlign(LEFT, TOP);
        noStroke();
        strokeWeight(3);
        fill('#000000');
        text("Score: " + timer, 33, 33);
        fill('#39FF14');
        textFont(headers);
        text("Score: " + timer, 30, 30);

        textSize(displayWidth / 110); 
        textAlign(RIGHT, TOP);
        noStroke();
        fill(0);
        text("Best: " + highScores.duo, width - 33, 33);
        textFont(headers);
        fill(255, 200, 0); 
        text("Best: " + highScores.duo, width - 30, 30);

        // --- 5. HIGH SCORE POPUP (Copied from Solo) ---
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
            highScores.duo = timer; 
          }
          hsPopupTimer--; 
          pop();
        }

        // --- 6. +10 SECONDS POPUP ---
        if (plusTenTimer > 0) {
            textSize(displayWidth / 110);
            textFont(headers);
            fill(255, 200, 0, plusTenTimer * 8); 
            text('+10!', 180, 50);
            plusTenTimer--;
        }
    }
}

function updateAllDuo() {
    ship1.update();
    ship2.update();
    for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].update();
        if (lasers[i].offScreen()) lasers.splice(i, 1);
    }

    // Asteroids
    for (let asteroid of asteroids) {
        asteroid.update();
    }

    // Powerup Spawning
    if (timer > 0 && timer % 30 === 0 && timer !== powerupSpawnTracker) {
        powerups.push(new PowerupAsteroid());
        powerupSpawnTracker = timer;
    }
    for (let p of powerups) {
        p.update();
    }

    handleDuoCollisions(); 
    checkLargeAsteroidRespawn(); // Borrows from solo.js naturally
}

function displayAllDuo() {
    ship1.display();
    ship2.display();
    for (let l of lasers) l.display();
    for (let a of asteroids) a.display();
    for (let p of powerups) p.display();
}

function handleDuoCollisions() {
    // Laser vs Asteroid (With sound)
    for (let i = lasers.length - 1; i >= 0; i--) {
        for (let j = asteroids.length - 1; j >= 0; j--) {
            let d = dist(lasers[i].pos.x, lasers[i].pos.y, asteroids[j].pos.x, asteroids[j].pos.y);
            if (d < asteroids[j].r) {
                splitAsteroid(asteroids[j]);
                asteroids.splice(j, 1);
                lasers.splice(i, 1);
                if (typeof asteroidSound !== 'undefined') asteroidSound.play();
                break; 
            }
        }
    }

    // Laser vs Powerup
    for (let i = lasers.length - 1; i >= 0; i--) {
        for (let j = powerups.length - 1; j >= 0; j--) {
            let d = dist(lasers[i].pos.x, lasers[i].pos.y, powerups[j].pos.x, powerups[j].pos.y);
            if (d < powerups[j].r) {
                activatePowerup(); // Borrows from solo.js naturally
                powerups.splice(j, 1);
                lasers.splice(i, 1);
                if (typeof powerUpSound !== 'undefined') powerUpSound.play();
                break;
            }
        }
    }

    // Ship vs Asteroid (With Invincibility Check)
    if (shipInvincible) {
        if (millis() - shipInvincibleTime > currentInvincDuration) {
            shipInvincible = false;
            currentInvincDuration = 3000;
        }
    } else {
        for (let asteroid of asteroids) {
            // Check Ship 1
            if (!ship1.isDead && ship1.hits(asteroid)) {
                ship1.isDead = true;
                ship1.vel.mult(1.5);
            }
            // Check Ship 2
            if (!ship2.isDead && ship2.hits(asteroid)) {
                ship2.isDead = true;
                ship2.vel.mult(1.5);
            }
        }
    }

    // Game Over Only If BOTH Are Dead
    if (ship1.isDead && ship2.isDead) {
        if (!overState) {
            bgm.stop();
            if (typeof gameOverSound !== 'undefined') gameOverSound.play();
            overState = true;
            updateHighScore('duo', timer); 
        }
    }
}

function resetDuo() {
    setupDuo(); 
    gameStartTime = millis();
    pausedTime = 0;
}