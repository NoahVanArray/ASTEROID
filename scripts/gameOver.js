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
    fill(240, 80, 50);
        textFont(headers);
        text('GAME OVER', width / 2, height / 2);

        textSize(windowWidth/50);
    fill(255, 200, 0);
    textFont(texts);
    text('try again? (press r)', width / 2, height / 1.61);

        textSize(windowWidth/50);
    fill(55, 255, 0);
        text('exit (esc)', width / 2, height / 1.4);
}