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
    // Player 1: WASD
    ship1 = new Ship1(width/2 - 100, height/2, { up: 87, left: 65, right: 68 });
    // Player 2: Arrows
    ship2 = new Ship2(width/2 + 100, height/2, { up: 38, left: 37, right: 39 });
    
    asteroids = [];
    lasers = [];
    overState = false;
}

function drawDuo() {

    // DRAW BOTH SHIPS REGARDLESS of life status
    // The Ship classes now handle their own "dead" behavior internally
    ship1.update();
    ship1.display();
    
    ship2.update();
    ship2.display();

    handleDuoCollisions();

    if (frameCount % 60 === 0 && !overState) {
        asteroids.push(new Asteroid());
    }
}

function handleDuoCollisions() {
    // 1. Handle Lasers hitting Asteroids
    for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].update();
        lasers[i].display();

        if (lasers[i].offScreen()) {
            lasers.splice(i, 1);
            continue;
        }

        for (let j = asteroids.length - 1; j >= 0; j--) {
            if (lasers[i].hits(asteroids[j])) {
                splitAsteroid(asteroids[j]); 
                asteroids.splice(j, 1);      
                lasers.splice(i, 1);         
                break;
            }
        }
    }

    // 2. Handle Asteroids & Ship Collisions
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].update();
        asteroids[i].display();

        // Kill Ship 1 if hit and NOT ALREADY DEAD
        if (!ship1.isDead && ship1.hits(asteroids[i])) {
            ship1.isDead = true;
            ship1.vel.mult(1.5); // Give it a little "bump" from the impact
            console.log("P1 is drifting...");
        }

        // Kill Ship 2 if hit and NOT ALREADY DEAD
        if (!ship2.isDead && ship2.hits(asteroids[i])) {
            ship2.isDead = true;
            ship2.vel.mult(1.5);
            console.log("P2 is drifting...");
        }

        // END GAME ONLY IF BOTH ARE DEAD
        if (ship1.isDead && ship2.isDead) {
            overState = true;
        }
    }
}

function resetDuo() {
    setupDuo(); // Just call setupDuo to keep it DRY (Don't Repeat Yourself)
    timer = 0;
    gameStartTime = millis();
}

// Note: If you use the Ship1/Ship2 update() logic, 
// you don't actually need handleDuoControls() anymore! 
// But you DO need to handle the shooting in keyPressed()