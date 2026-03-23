// duo.js
let ship1, ship2;
let overDuo = false;

function setupDuo() {
  // Player 1 (WASD)
  ship1 = new Ship(width/2 - 50, height/2, { up: 87, left: 65, right: 68 });
  
  // Player 2 (Arrows: 38=Up, 37=Left, 39=Right)
  ship2 = new Ship(width/2 + 50, height/2, { up: 38, left: 37, right: 39 });
}

function resetDuo() {
    // Initialize Player 1 (WASD)
    ship1 = new Ship(width / 2 - 50, height / 2, ship1Img); 
    
    // Initialize Player 2 (Arrows)
    // Use a different image or tint() it so players don't get confused!
    ship2 = new Ship(width / 2 + 50, height / 2, ship2Img); 
    
    asteroids = [];
    lasers = [];
    overDuo = false;
    timer = 0;
    gameStartTime = millis();
    hsAnnounced = false;
}

function handleDuoControls() {
    // --- PLAYER 1 (WASD + SHIFT) ---
    if (keyIsDown(65)) ship1.turn(-0.1); // A
    if (keyIsDown(68)) ship1.turn(0.1);  // D
    if (keyIsDown(87)) ship1.thrust();   // W
    // Shift to shoot (checked in keyPressed for single shots)

    // --- PLAYER 2 (ARROWS + CONTROL) ---
    if (keyIsDown(LEFT_ARROW))  ship2.turn(-0.1);
    if (keyIsDown(RIGHT_ARROW)) ship2.turn(0.1);
    if (keyIsDown(UP_ARROW))    ship2.thrust();
    // Ctrl to shoot (checked in keyPressed)
}