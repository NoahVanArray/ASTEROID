// le game, le over 

/* REMINDERS:
        + When doing a gameOver, pls:
             - Get and restart the score/highScore
             - Restart game states (solo, duo, pvp)
             - Restart game assets (asteroids, spacechips)
*/ 

function gameOver(){
    noStroke();
    
    textSize(windowWidth/16);
    textAlign(CENTER);
    fill(overColor);
    textFont(headers);
    text('GAME OVER', width / 2, height / 2.22);

    textSize(windowWidth/55);
    fill(goldColor);
    textFont(texts);
    text('HIGHEST SCORE: ' + highScores.solo, width / 2, height / 1.9);

    textSize(windowWidth/55);
    fill(goldColor);
    textFont(texts);
    text('Your Score: ' + timer, width / 2, height / 1.7);

    textSize(windowWidth/55);
    fill(greenColor);
    textFont(texts);
    text('try again? (press r)', width / 2, height / 1.46);

    textSize(windowWidth/55);
    fill(redColor);
    text('exit (esc)', width / 2, height / 1.3);
}