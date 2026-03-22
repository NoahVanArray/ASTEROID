let stage = 1;
let isHSReset = false;

function title(){
	textAlign(CENTER, CENTER);

	// TITLE TEXT LEZGOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    textSize(64);
    fill(greenColor);
    textFont(headers);
    text('ASTEROIDS', 400, 250);

    if (frameCount % 65 < 30) {
        textSize(20);
        fill(goldColor);
        textFont(texts);
        text('press ENTER to start', 400, 340); 
    }

    if (stage === 1) {
        textSize(14);
        fill(252, 124, 5);
        textFont(texts);
        text('press R to reset ALL High Score', 400, 500);

        if (isHSReset === true && stage === 1) {
            if (resetHighScore > 0) {
                textSize(16);
                textFont(texts);
                fill(255, 50, 50, resetHighScore * 7); // fades the thing, nice fx // also, on stuff like this, better to declare the rbg code directly
                text('HIGH SCORES WIPED!', 400, 540);
                
                resetHighScore--;
            }
        }
    }
    
    if (stage === 2) {
        isHSReset = false;
        textSize(14);
        fill(redColor);
        textFont(texts);
        text('are you sure? Y/N', 400, 500);
    }
}
