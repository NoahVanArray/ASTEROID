let stage = 1;
let isHSReset = false;

function title(){
	// TITLE TEXT LEZGOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    textSize(windowWidth/16);
	textAlign(CENTER);
  	fill(greenColor);
    textFont(headers);
    text('ASTEROIDS', width / 2, height / 2);

    if (frameCount % 65 < 30) {
        textSize(windowWidth/50);
      	fill(goldColor);
        textFont(texts);
        text('press ENTER to start', width / 2, height / 1.7);
    }

    if (stage === 1){
        textSize(windowWidth/70);
        fill(252, 124, 5);
        textFont(texts);
        text('press R to reset ALL High Score', width / 2, height / 1.2);

        // ... Reset text display ...
        if (isHSReset && resetHighScore > 0) {
            textSize(windowWidth / 60);
            textFont(texts);
            fill(255, 50, 50, resetHighScore * 8); // Multiplier depends on how fast you want it to fade
            text('HIGH SCORES WIPED!', width / 2, height / 1.1);
            
            resetHighScore--;
            
            // When timer hits zero, turn the switch back off
            if (resetHighScore <= 0) {
                isHSReset = false;
            }
        }
    }
    
    if (stage === 2){
        isHSReset = false;
        textSize(windowWidth/70);
        fill(redColor);
        textFont(texts);
        text('are you sure? Y/N', width / 2, height / 1.2);
    }

    
}
