// le game, le over 

/* REMINDERS:
        + When doing a gameOver, pls:
             - Get and restart the score/highScore
             - Restart game states (solo, duo, pvp)
             - Restart game assets (asteroids, spacechips)
*/ 

function gameOver(){
    background(0,0,0,120);
    noStroke();
    textAlign(CENTER, CENTER);

    // main header
    push();
    drawingContext.shadowColor = color(overColor); 
    drawingContext.shadowBlur = 20;
    textSize(64); 
    fill(overColor);
    textFont(headers);
    text('GAME OVER', width / 2, height / 3);
    pop();
    // scores
    push();
    drawingContext.shadowColor = color(goldColor); 
    drawingContext.shadowBlur = 20;
    
    textSize(24); 
    fill(goldColor);
    textFont(texts);
    
    // Check which high score to show
    let displayHS = (pageState === "duo") ? highScores.duo : highScores.solo;
    
    text('HIGHEST SCORE: ' + displayHS, width / 2, height / 2);
    text('Your Score: ' + timer, width / 2, height / 2 + 40);
    pop();
    // other kemerut
    textSize(20); 
    push();
    drawingContext.shadowColor = color(greenColor); 
    drawingContext.shadowBlur = 20;
    fill(greenColor);
    text('try again? (press r)', width / 2, height / 2 + 100);
    pop();

    push();
    drawingContext.shadowColor = color(redColor); 
    drawingContext.shadowBlur = 20;
    fill(redColor);
    text('exit (esc)', width / 2, height / 2 + 140);
    pop();
}