// le game, le over 

/* REMINDERS:
        + When doing a gameOver, pls:
             - Get and restart the score/highScore
             - Restart game states (solo, duo, pvp)
             - Restart game assets (asteroids, spacechips)
*/ 

function gameOver(){
    noStroke();
    textAlign(CENTER, CENTER);

    // main header
    textSize(64); 
    fill(overColor);
    textFont(headers);
    text('GAME OVER', width / 2, height / 3);

    // scores
    textSize(24); 
    fill(goldColor);
    textFont(texts);
    
    // Check which high score to show
    let displayHS = (pageState === "duo") ? highScores.duo : highScores.solo;
    
    text('HIGHEST SCORE: ' + displayHS, width / 2, height / 2);
    text('Your Score: ' + timer, width / 2, height / 2 + 40);

    // other kemerut
    textSize(20); 
    fill(greenColor);
    text('try again? (press r)', width / 2, height / 2 + 100);
    fill(redColor);
    text('exit (esc)', width / 2, height / 2 + 140);
}