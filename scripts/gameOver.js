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
    fill(247, 70, 39);
    textFont(headers);
    text('GAME OVER', width / 2, height / 2.22);

    textSize(windowWidth/55);
    fill(255, 200, 0);
    textFont(texts);
    text('HIGHEST SCORE: ' + highScores.solo, width / 2, height / 1.9);

    textSize(windowWidth/55);
    fill(255, 200, 0);
    textFont(texts);
    text('Your Score: ' + timer, width / 2, height / 1.7);

    textSize(windowWidth/55);
    fill(55, 255, 0);
    textFont(texts);
    text('try again? (press r)', width / 2, height / 1.46);

    textSize(windowWidth/55);
    fill(247, 70, 39);
    text('exit (esc)', width / 2, height / 1.3);
}