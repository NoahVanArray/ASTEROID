// pvp.js
let winner = "";
let pvpStarted = false;
let pvpPaused = false;
let pvpOver = false;

// Life icons
let p1LifeFull, p1LifeEmpty;
let p2LifeFull, p2LifeEmpty;

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

    // Clear global arrays to prevent leftover data from Solo/Duo
    asteroids = []; 
    lasers = [];
    powerups = []; 

    // Initialize ships
    ship1 = new Ship1(150, height / 2, { up: 87, left: 65, right: 68 }); 
    ship2 = new Ship2(width - 150, height / 2, { up: 38, left: 37, right: 39 });
    
    ship1.lives = 3;
    ship2.lives = 3;
    
    // Spawn exactly 4 new Asteroid objects for PVP
    for (let i = 0; i < 4; i++) {
        asteroids.push(new Asteroid());
    }
}

function drawPvp() {
    // Render Loop with Safety Check
    for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i] && typeof asteroids[i].display === 'function') {
            asteroids[i].display();
        }
    }
    
    for (let i = 0; i < lasers.length; i++) {
        if (lasers[i] && typeof lasers[i].display === 'function') {
            lasers[i].display();
        }
    }
    
    if (ship1) ship1.display();
    if (ship2) ship2.display();

    // Logic Overlays
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

    // Ship Collision (Bump each other)
    let dShips = dist(ship1.pos.x, ship1.pos.y, ship2.pos.x, ship2.pos.y);
    if (dShips < (ship1.size / 2) + (ship2.size / 2)) {
        let pushForce = p5.Vector.sub(ship1.pos, ship2.pos);
        pushForce.setMag(3); 
        ship1.vel.add(pushForce);
        ship2.vel.sub(pushForce);
    }

    // Laser Logic
    for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].update();
        if (lasers[i].offScreen()) {
            lasers.splice(i, 1);
            continue;
        }

        if (lasers[i] instanceof Laser2 && ship1.hits(lasers[i])) {
            ship1.lives--;
            lasers.splice(i, 1);
            checkPvpVictory();
            continue;
        } else if (lasers[i] instanceof Laser1 && ship2.hits(lasers[i])) {
            ship2.lives--;
            lasers.splice(i, 1);
            checkPvpVictory();
            continue;
        }
    }

    // Asteroid Logic & Ship Bumping
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].update();
        
        // Manual screen wrap check
        if (asteroids[i].pos.x > width + asteroids[i].r) asteroids[i].pos.x = -asteroids[i].r;
        else if (asteroids[i].pos.x < -asteroids[i].r) asteroids[i].pos.x = width + asteroids[i].r;
        if (asteroids[i].pos.y > height + asteroids[i].r) asteroids[i].pos.y = -asteroids[i].r;
        else if (asteroids[i].pos.y < -asteroids[i].r) asteroids[i].pos.y = height + asteroids[i].r;

        // Ship vs Asteroid bumping
        if (ship1.hits(asteroids[i])) {
            let pushForce = p5.Vector.sub(ship1.pos, asteroids[i].pos);
            pushForce.setMag(2); // Adjust for harder/softer bounce
            ship1.vel.add(pushForce);
        }
        if (ship2.hits(asteroids[i])) {
            let pushForce = p5.Vector.sub(ship2.pos, asteroids[i].pos);
            pushForce.setMag(2); // Adjust for harder/softer bounce
            ship2.vel.add(pushForce);
        }
    }
}

function checkPvpVictory() {
    if (ship1.lives <= 0) {
        winner = "PLAYER 2";
        pvpOver = true;
    } else if (ship2.lives <= 0) {
        winner = "PLAYER 1";
        pvpOver = true;
    }
}

function drawPvpUi() {
    for (let i = 0; i < 3; i++) {
        let img1 = (i < ship1.lives) ? p1LifeFull : p1LifeEmpty;
        if(img1) image(img1, 50 + (i * 45), 50, 35, 35);

        let img2 = (i < ship2.lives) ? p2LifeFull : p2LifeEmpty;
        if(img2) image(img2, width - 150 + (i * 45), 50, 35, 35);
    }
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

// Ensure handlePvpControls is called in sketch.js keyPressed()
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
        // Uses the global pageState to return to menu
        if (keyCode === ESCAPE) pageState = "gameMode"; 
    }
}