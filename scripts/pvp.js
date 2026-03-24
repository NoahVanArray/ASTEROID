// pvp.js
let p1Wins = 0;
let p2Wins = 0;
let winnerName = "";

function preloadPvp() {
    // Re-using assets from solo/duo for consistency
    ship1Img = loadImage('assets/graphics/spaceships/ship1.png');
    thrust1Img = loadImage('assets/graphics/spaceships/thrust1.png');
    lazerImg = loadImage('assets/graphics/bullets/laser1.png');
    ship1Invincibility = loadImage('assets/graphics/spaceships/shipInvincibility.png');

    ship2Img = loadImage('assets/graphics/spaceships/ship2.png');
    thrust2Img = loadImage('assets/graphics/spaceships/thrust2.png');
    lazer2Img = loadImage('assets/graphics/bullets/laser2.png');
    ship2Invincibility = loadImage('assets/graphics/spaceships/shipInvincibility.png');

    // Lost life image
    shipNoLife = loadImage('assets/graphics/spaceships/ship1LoseLives.png');

    largeAsteroid = loadImage("assets/graphics/asteroids/large.png");
    mediumAsteroid = loadImage("assets/graphics/asteroids/medium.png");
    smallAsteroid = loadImage("assets/graphics/asteroids/small.png");
}

function setupPvp() {
    // Initialize Ships with 3 lives
    ship1 = new Ship1(100, height / 2, { up: 87, left: 65, right: 68 });
    ship2 = new Ship2(width - 100, height / 2, { up: 38, left: 37, right: 39 });
    
    ship1.lives = 3;
    ship2.lives = 3;

    asteroids = [];
    lasers = [];
    
    // Flat difficulty: only 3 large asteroids to keep the focus on combat
    spawnAsteroids(60, 3);

    overState = false;
    paused = false;
    started = false;
}

function drawPvp() {
    if (overState) {
        displayAllPvp();
        drawPvpVictory();
    } else if (!started) {
        displayAllPvp();
        drawOverlay("PVP MODE", "Press ENTER to Duel");
    } else if (paused) {
        displayAllPvp();
        drawOverlay("PAUSED", "Press P to Resume");
    } else {
        // --- GAMEPLAY LOOP ---
        ship1.update();
        ship1.display();
        ship2.update();
        ship2.display();

        // --- 1. SHIP-TO-SHIP BUMPING (FIXED PHYSICS) ---
        if (ship1.lives > 0 && ship2.lives > 0) {
            let d = dist(ship1.pos.x, ship1.pos.y, ship2.pos.x, ship2.pos.y);
            if (d < ship1.r + ship2.r) {
                // Calculate direction
                let force = p5.Vector.sub(ship1.pos, ship2.pos).normalize();
                
                // Use .copy() to apply forces safely without breaking the original vector
                ship1.vel.add(force.copy().mult(3));
                ship2.vel.add(force.copy().mult(-3)); 
            }
        }

        // --- 2. HANDLE LASERS ---
        for (let i = lasers.length - 1; i >= 0; i--) {
            lasers[i].update();
            lasers[i].display();

            // FIXED: Capital 'S'
            if (lasers[i].offScreen()) {
                lasers.splice(i, 1);
                continue;
            }

            // Laser vs Ship 2 (Player 1 shoots Player 2)
            if (lasers[i].owner === "p1" && ship2.lives > 0 && ship2.hits(lasers[i])) {
                if (!ship2.invincible) {
                    ship2.lives--;
                    triggerInvincibility(ship2);
                }
                lasers.splice(i, 1);
                continue;
            }

            // Laser vs Ship 1 (Player 2 shoots Player 1)
            if (lasers[i].owner === "p2" && ship1.lives > 0 && ship1.hits(lasers[i])) {
                if (!ship1.invincible) {
                    ship1.lives--;
                    triggerInvincibility(ship1);
                }
                lasers.splice(i, 1);
                continue;
            }

            // Laser vs Asteroids
            for (let j = asteroids.length - 1; j >= 0; j--) {
                if (lasers[i] && lasers[i].hits(asteroids[j])) {
                    splitAsteroid(asteroids[j]);
                    asteroids.splice(j, 1);
                    lasers.splice(i, 1);
                    break;
                }
            }
        }

        // --- 3. HANDLE ASTEROIDS vs SHIPS ---
        for (let i = asteroids.length - 1; i >= 0; i--) {
            asteroids[i].update();
            asteroids[i].display();

            // Find this section in pvp.js and update it:
            if (ship1.invincible && millis() - ship1.invincibleTimer > 2000) {
                ship1.invincible = false;
            }
            if (ship2.invincible && millis() - ship2.invincibleTimer > 2000) {
                ship2.invincible = false;
            }
        }

        // Check for Win Condition
        if (ship1.lives <= 0) {
            p2Wins++;
            winnerName = "PLAYER 2";
            overState = true;
        } else if (ship2.lives <= 0) {
            p1Wins++;
            winnerName = "PLAYER 1";
            overState = true;
        }

        drawPvpUI();

        
    }
}

function drawPvpUI() {
    // Win Counter (Center Top)
    textAlign(CENTER);
    textFont(texts);
    textSize(20);
    fill(255);
    text(p1Wins + "  -  WINS  -  " + p2Wins, width / 2, 40);

    // Life Icons for P1 (Left)
    for (let i = 0; i < 3; i++) {
        let img = (ship1.lives > i) ? ship1Img : shipNoLife;
        image(img, 40 + (i * 45), 45, 30, 30);
    }

    // Life Icons for P2 (Right)
    for (let i = 0; i < 3; i++) {
        let img = (ship2.lives > i) ? ship2Img : shipNoLife;
        // Draw from right to left
        image(img, width - 40 - (i * 45), 45, 30, 30);
    }
}

function drawPvpVictory() {
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(64);
    fill(255, 215, 0); // Gold
    textFont(headers);
    text(winnerName + " WINS!", width / 2, height / 3);

    textSize(24);
    fill(255);
    textFont(texts);
    text('Total Victories', width / 2, height / 2);
    text('P1: ' + p1Wins + ' | P2: ' + p2Wins, width / 2, height / 2 + 40);

    textSize(20);
    fill(0, 255, 0);
    text('Press R to Rematch', width / 2, height / 2 + 100);
}

function displayAllPvp() {
    ship1.display();
    ship2.display();
    for (let a of asteroids) a.display();
    for (let l of lasers) l.display();
    drawPvpUI();
}

function triggerInvincibility(targetShip) {
    targetShip.invincible = true;
    targetShip.invincibleTimer = millis();
    // Bounce the ship away from the hit for visual feedback
    targetShip.vel.mult(-1.5);
}

function updatePvp() {
    // --- 1. Ship to Ship Collision ---
    let d = dist(ship1.pos.x, ship1.pos.y, ship2.pos.x, ship2.pos.y);
    if (d < ship1.r + ship2.r) {
        // Simple Physics: Swap velocities to "bounce"
        let tempVel = ship1.vel.copy();
        ship1.vel = ship2.vel.copy();
        ship2.vel = tempVel;

        // SEPARATION: Push them apart so they don't get stuck and bounce forever
        let overlap = (ship1.r + ship2.r) - d;
        let edgePush = p5.Vector.sub(ship1.pos, ship2.pos).setMag(overlap / 2);
        ship1.pos.add(edgePush);
        ship2.pos.sub(edgePush);
        
        if (typeof edgePushSound !== 'undefined') edgePushSound.play();
    }

    // --- 2. Laser vs Ships ---
    for (let i = lasers.length - 1; i >= 0; i--) {
        let l = lasers[i];
        
        // Hit Ship 1? (Only if P2 fired it)
        if (l.owner === "p2" && ship1.hits(l)) {
            processPvpHit(ship1, "p2");
            lasers.splice(i, 1);
            continue;
        }
        
        // Hit Ship 2? (Only if P1 fired it)
        if (l.owner === "p1" && ship2.hits(l)) {
            processPvpHit(ship2, "p1");
            lasers.splice(i, 1);
            continue;
        }
    }

    // --- 3. Asteroid vs Ships (Improved) ---
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let a = asteroids[i];
        
        if (ship1.hits(a)) {
            processPvpHit(ship1);
            // Bounce ship off asteroid
            ship1.vel.mult(-1.2); 
        }
        if (ship2.hits(a)) {
            processPvpHit(ship2);
            // Bounce ship off asteroid
            ship2.vel.mult(-1.2);
        }
    }
}

// NEW HELPER FUNCTION: Handles lives and respawn safety
function processPvpHit(victimShip, attacker) {
    // Only take damage if NOT currently in 'invincible' mode
    // (You'll need to add this.invincible = false to your Ship constructor)
    if (!victimShip.isInvincible) {
        victimShip.lives--;
        victimShip.isInvincible = true;
        victimShip.lastHitTime = millis();
        
        // Optional: Reset position to start so they aren't stuck in the asteroid
        if (victimShip === ship1) victimShip.pos = createVector(100, height/2);
        else victimShip.pos = createVector(width - 100, height/2);
        
        if (victimShip.lives <= 0) {
            overState = true;
            winnerName = (victimShip === ship1) ? "PLAYER 2" : "PLAYER 1";
            if (victimShip === ship1) p2Wins++; else p1Wins++;
        }
    }
}

// Ensure ships reset invincibility state in their own classes 
// or update targetShip.invincible in the draw loop:
// if (ship1.invincible && millis() - ship1.invincibleTimer > 2000) ship1.invincible = false;

function resetPvp() {
    setupPvp();
}