// pvp.js
let winner = "";
let pvpStarted = false;
let pvpPaused = false;
let pvpOver = false;

// Life icons
let p1LifeFull, p1LifeEmpty;
let p2LifeFull, p2LifeEmpty;

// Damage cooldowns to prevent instant death
let p1HitTimer = 0;
let p2HitTimer = 0;
const HIT_COOLDOWN = 1000; // 1 second of invincibility after being hit

function preloadPvp() {
    ship1Img = loadImage('assets/graphics/spaceships/ship1.png');
    thrust1Img = loadImage('assets/graphics/spaceships/thrust1.png');
    lazerImg = loadImage('assets/graphics/bullets/laser1.png');
    
    ship2Img = loadImage('assets/graphics/spaceships/ship2.png');
    thrust2Img = loadImage('assets/graphics/spaceships/thrust2.png');
    lazer2Img = loadImage('assets/graphics/bullets/laser2.png');

    largeAsteroid = loadImage("assets/graphics/asteroids/large.png");
    mediumAsteroid = loadImage("assets/graphics/asteroids/medium.png");
    smallAsteroid = loadImage("assets/graphics/asteroids/small.png");

    p1LifeFull = loadImage('assets/graphics/spaceships/ship1.png');
    p1LifeEmpty = loadImage('assets/graphics/spaceships/ship1LoseLives.png');
    p2LifeFull = loadImage('assets/graphics/spaceships/ship2.png');
    p2LifeEmpty = loadImage('assets/graphics/spaceships/ship2LoseLives.png'); 
}

function setupPvp() {
    resetPvp();
}

function resetPvp() {
    pvpStarted = false;
    pvpPaused = false;
    pvpOver = false;
    winner = "";
    p1HitTimer = 0;
    p2HitTimer = 0;

    asteroids = []; 
    lasers = [];
    powerups = []; 

    ship1 = new Ship1(150, height / 2, { up: 87, left: 65, right: 68 }); 
    ship2 = new Ship2(width - 150, height / 2, { up: 38, left: 37, right: 39 });
    
    ship1.lives = 3;
    ship2.lives = 3;
    
    for (let i = 0; i < 5; i++) {
        asteroids.push(new Asteroid());
    }
}

function drawPvp() {
    for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i]) asteroids[i].display();
    }
    
    for (let i = 0; i < lasers.length; i++) {
        if (lasers[i]) lasers[i].display();
    }
    
    // Blink ships if they were recently hit
    if (ship1) {
        if (millis() < p1HitTimer + 1000 && frameCount % 10 < 5) {
            // don't draw to create "blink" effect
        } else {
            ship1.display();
        }
    }
    if (ship2) {
        if (millis() < p2HitTimer + 1000 && frameCount % 10 < 5) {
            // blink
        } else {
            ship2.display();
        }
    }

    if (!pvpStarted) {
        drawOverlay("PVP MODE", "P1: WASD + SHIFT | P2: ARROWS + DOT (.)\n\n[3 LIVES EACH]\n\nPress ENTER to Start", false);
    } else if (pvpOver) {
        drawPvpWinnerOverlay();
    } else if (pvpPaused) {
        drawOverlay("PAUSED", "Press P to Resume", false);
    } else {
        updatePvpLogic();
    }
    
    drawPvpUi();
}

function updatePvpLogic() {
    ship1.update();
    ship1.edges();
    ship2.update();
    ship2.edges();

    // 1. SHIP vs SHIP Bumping
    let dShips = dist(ship1.pos.x, ship1.pos.y, ship2.pos.x, ship2.pos.y);
    if (dShips < (ship1.size / 2) + (ship2.size / 2)) {
        let pushForce = p5.Vector.sub(ship1.pos, ship2.pos);
        pushForce.setMag(3); 
        ship1.vel.add(pushForce);
        ship2.vel.sub(pushForce);
    }

    // 2. LASER LOGIC
    for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].update();
        
        if (lasers[i].offScreen()) {
            lasers.splice(i, 1);
            continue;
        }

        let laserHitSomething = false;

        // Laser vs Asteroids
        for (let j = asteroids.length - 1; j >= 0; j--) {
            if (dist(lasers[i].pos.x, lasers[i].pos.y, asteroids[j].pos.x, asteroids[j].pos.y) < asteroids[j].r) {
                splitAsteroid(asteroids[j]); 
                asteroids.splice(j, 1);
                if (typeof asteroidSound !== 'undefined') asteroidSound.play();
                laserHitSomething = true;
                break; 
            }
        }

        if (laserHitSomething) {
            lasers.splice(i, 1);
            continue;
        }

        if (laserHitSomething) {
            lasers.splice(i, 1);
            continue;
        }

        // Laser vs Ship 1
        if (lasers[i] instanceof Laser2 && millis() > p1HitTimer + HIT_COOLDOWN) {
            if (dist(lasers[i].pos.x, lasers[i].pos.y, ship1.pos.x, ship1.pos.y) < ship1.size / 2) {
                ship1.lives--;
                p1HitTimer = millis();
                lasers.splice(i, 1);
                checkPvpVictory();
                continue;
            }
        }

        // Laser vs Ship 2
        if (lasers[i] instanceof Laser1 && millis() > p2HitTimer + HIT_COOLDOWN) {
            if (dist(lasers[i].pos.x, lasers[i].pos.y, ship2.pos.x, ship2.pos.y) < ship2.size / 2) {
                ship2.lives--;
                p2HitTimer = millis();
                lasers.splice(i, 1);
                checkPvpVictory();
                continue;
            }
        }
    }

    // 3. ASTEROID LOGIC
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].update();
        
        if (asteroids[i].pos.x > width + asteroids[i].r) asteroids[i].pos.x = -asteroids[i].r;
        else if (asteroids[i].pos.x < -asteroids[i].r) asteroids[i].pos.x = width + asteroids[i].r;
        if (asteroids[i].pos.y > height + asteroids[i].r) asteroids[i].pos.y = -asteroids[i].r;
        else if (asteroids[i].pos.y < -asteroids[i].r) asteroids[i].pos.y = height + asteroids[i].r;

        // Ship 1 vs Asteroid
        let d1 = dist(ship1.pos.x, ship1.pos.y, asteroids[i].pos.x, asteroids[i].pos.y);
        if (d1 < (ship1.size / 2) + asteroids[i].r) {
            if (millis() > p1HitTimer + HIT_COOLDOWN) {
                ship1.lives -= 1;
                p1HitTimer = millis();
                
                splitAsteroid(asteroids[i]); 
                asteroids.splice(i, 1); 
                if (typeof asteroidSound !== 'undefined') asteroidSound.play();
                
                checkPvpVictory();
                continue;
            }
        }

        // Ship 2 vs Asteroid
        let d2 = dist(ship2.pos.x, ship2.pos.y, asteroids[i].pos.x, asteroids[i].pos.y);
        if (d2 < (ship2.size / 2) + asteroids[i].r) {
            if (millis() > p2HitTimer + HIT_COOLDOWN) {
                ship2.lives -= 1;
                p2HitTimer = millis();

                splitAsteroid(asteroids[i]);
                asteroids.splice(i, 1);
                if (typeof asteroidSound !== 'undefined') asteroidSound.play();

                checkPvpVictory();
                continue;
            }
        }
    }
}

function checkPvpVictory() {
    // Only trigger the win logic ONCE per round
    if (!pvpOver) {
        if (ship1.lives <= 0) {
            ship1.lives = 0;
            winner = "PLAYER 2";
            addPvpWin(2); // Give P2 a point
            pvpOver = true;
            if (typeof pvpVictory !== 'undefined') pvpVictory.play();
        } else if (ship2.lives <= 0) {
            ship2.lives = 0;
            winner = "PLAYER 1";
            addPvpWin(1); // Give P1 a point
            pvpOver = true;
            if (typeof pvpVictory !== 'undefined') pvpVictory.play();
        }
    }
}

function drawPvpUi() {
    // Draw the Hearts
    for (let i = 0; i < 3; i++) {
        let img1 = (i < Math.floor(ship1.lives)) ? p1LifeFull : p1LifeEmpty;
        if(img1) image(img1, 50 + (i * 45), 50, 35, 35);

        let img2 = (i < Math.floor(ship2.lives)) ? p2LifeFull : p2LifeEmpty;
        if(img2) image(img2, width - 150 + (i * 45), 50, 35, 35);
    }

    // Draw the Win Tracker Head-to-Head
    push();
    textFont(headers);
    
    // "WINS" Header
    fill(255);
    textSize(20);
    textAlign(CENTER, TOP);
    text("WINS", width / 2, 20);

    // Player 1 Wins (Orange)
    textSize(30);
    fill(orangeColor); 
    textAlign(RIGHT, TOP);
    text(highScores.pvpP1, width / 2 - 20, 50);

    // Dash separator
    fill(255);
    textAlign(CENTER, TOP);
    text("-", width / 2, 50);

    // Player 2 Wins (Blue)
    fill("#52a1c8"); 
    textAlign(LEFT, TOP);
    text(highScores.pvpP2, width / 2 + 20, 50);
    
    pop();
}

function drawPvpWinnerOverlay() {
    fill(0, 180);
    rect(0, 0, width, height);
    textAlign(CENTER, CENTER);
    textFont(headers);
    fill(255);
    textSize(60);
    text(winner + " WINS!", width/2, height/2 - 30);
    
    textFont(texts);
    textSize(20);
    fill(greenColor);
    text("REMATCH? (PRESS R)", width/2, height/2 + 60);
    fill(redColor);
    text("EXIT (ESC)", width/2, height/2 + 100);
}

function handlePvpControls() {
    if (!pvpStarted && keyCode === ENTER) {
        pvpStarted = true;
    }

    if (pvpStarted && !pvpOver && (keyCode === 80 || key.toLowerCase() === 'p')) {
        pvpPaused = !pvpPaused;
    }

    if (pvpStarted && !pvpPaused && !pvpOver) {
        if (keyCode === SHIFT) {
            lasers.push(new Laser1(ship1.pos, ship1.angle));
            if (typeof laserSound !== 'undefined') laserSound.play();
        }
        if (keyCode === 190) { // '.' key
            lasers.push(new Laser2(ship2.pos, ship2.angle));
            if (typeof laserSound !== 'undefined') laserSound.play();
        }
    }

    if (pvpOver) {
        if (key.toLowerCase() === 'r') resetPvp();
        if (keyCode === ESCAPE) pageState = "gameMode"; 
    }
}