let stage = 1;
let isHSReset = false;

function title(){
	// TITLE TEXT LEZGOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
    textSize(windowWidth/16);
	textAlign(CENTER);
  	fill(55, 255, 0);
    textFont(headers);
    text('ASTEROIDS', width / 2, height / 2);

    textSize(windowWidth/50);
  	fill(255, 200, 0);
    textFont(texts);
    text('press ENTER to start', width / 2, height / 1.7);


    if (stage === 1){
        textSize(windowWidth/70);
        fill(252, 124, 5);
        textFont(texts);
        text('press R to reset ALL High Score', width / 2, height / 1.2);

        if (isHSReset === true && stage === 1){
            if (resetHighScore > 0) {
                textSize(windowWidth / 60);
                textFont(texts);
                fill(255, 50, 50, resetHighScore * 7); // fades the thing, nice fx
                text('HIGH SCORES WIPED!', width / 2, height / 1.1);
                
                resetHighScore--;
            }
        }
    }
    
    if (stage === 2){
        isHSReset = false;
        textSize(windowWidth/70);
        fill(255, 50, 50);
        textFont(texts);
        text('are you sure? Y/N', width / 2, height / 1.2);
    }

    
}

// gold colors
// 255 30 30
// 240 50 50