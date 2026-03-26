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

    alienImg = loadImage("assets/graphics/spaceships/alien3.png"); 
    alienLaserImg = loadImage("assets/graphics/bullets/laser3.png");
    lastAlienSpawnTime = millis();
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
    aliens = []; // ===== FIX: Clear aliens array =====
    alienLasers = []; // ===== FIX: Clear alien lasers array =====
    
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
        drawOverlay("HOW TO PLAY", "Press ENTER to Begin", true);
    } 
    else if (paused) {
        displayAllDuo();
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

        if (timer > highScores.duo && !hsAnnounced && timer > 0) {
            updateHighScore('duo', timer); 
            hsAnnounced = true;
            hsPopupTimer = 180;
            if (typeof newHighScoreSound !== 'undefined') newHighScoreSound.play();
        }

        updateAllDuo();
        displayAllDuo();

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

            aliens[i].update([ship1, ship2]); 
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

            // Check hit on Ship 1 (Using ship1.size / 2)
            if (!shipInvincible && !ship1.isDead && dist(alienLasers[i].pos.x, alienLasers[i].pos.y, ship1.pos.x, ship1.pos.y) < (ship1.size / 2) + alienLasers[i].r) {
                ship1.isDead = true; 
                ship1.vel.mult(1.5); 
                alienLasers.splice(i, 1);
                if (typeof asteroidSound !== 'undefined') asteroidSound.play(); // Crunch sound on hit
                continue; 
            }

            // Check hit on Ship 2 (Using ship2.size / 2)
            if (!shipInvincible && !ship2.isDead && dist(alienLasers[i].pos.x, alienLasers[i].pos.y, ship2.pos.x, ship2.pos.y) < (ship2.size / 2) + alienLasers[i].r) {
                ship2.isDead = true;
                ship2.vel.mult(1.5);
                alienLasers.splice(i, 1);
                if (typeof asteroidSound !== 'undefined') asteroidSound.play(); // Crunch sound on hit
                continue;
            }

            if (alienLasers[i].offscreen()) {
                alienLasers.splice(i, 1);
            }
        }

        // HUD STYLING
        textSize(displayWidth / 110);
        textAlign(LEFT, TOP);
        noStroke();
        strokeWeight(3);
        
        push();
        drawingContext.shadowColor = color('#000000'); 
        drawingContext.shadowBlur = 20;
        fill('#000000');
        text("TIME: " + timer, 33, 33);
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
        drawingContext.shadowColor = color(0); 
        drawingContext.shadowBlur = 20;
        fill(0);
        text("BEST: " + highScores.duo, width - 33, 33);
        textFont(headers);
        pop();

        push();
        drawingContext.shadowColor = color(255, 200, 0); 
        drawingContext.shadowBlur = 20;
        textFont(headers);
        fill(255, 200, 0); 
        text("BEST: " + highScores.duo, width - 30, 30);
        pop();

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
    for (let al of aliens) al.display();
    for (let al of alienLasers) al.display();
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
    lastAlienSpawnTime = millis(); // ===== FIX: Reset alien spawn timer =====
}