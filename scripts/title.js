let stage = 1;
let isHSReset = false;

function title() {
    textAlign(CENTER, CENTER);

    // TITLE TEXT
    push();
    drawingContext.shadowColor = color(greenColor); 
    drawingContext.shadowBlur = 20;
    
    textSize(64);
    fill(greenColor);
    textFont(headers);
    text('ASTEROIDS', 400, 250);
    pop();

    if (frameCount % 65 < 30) {

        push();
        drawingContext.shadowColor = color(goldColor); 
        drawingContext.shadowBlur = 20;

        textSize(20);
        fill(goldColor);
        textFont(texts);
        text('press ENTER to start', 400, 340); 
        pop();
    }

    if (stage === 1) {

        push();
        drawingContext.shadowColor = color(252, 124, 5); 
        drawingContext.shadowBlur = 20;

        textSize(14);
        fill(252, 124, 5);
        textFont(texts);
        text('press R to reset ALL High Score', 400, 500);
        pop();

        if (isHSReset === true) { // Removed the redundant "&& stage === 1"
            if (resetHighScore > 0) {
                push();
                drawingContext.shadowColor = color(255, 50, 50, resetHighScore * 8); 
                drawingContext.shadowBlur = 20;

                textSize(16);
                textFont(texts);
                fill(255, 50, 50, resetHighScore * 8); 
                text('HIGH SCORES WIPED!', 400, 540);
                
                resetHighScore--;
                
                if (resetHighScore <= 0) {
                    isHSReset = false;
                }
                pop();
            }
        } // <--- Added this to close isHSReset
    } // <--- Added this to close stage === 1

    if (stage === 2) {
        isHSReset = false;
        push();
        drawingContext.shadowColor = color(redColor); 
        drawingContext.shadowBlur = 20;
        
        textSize(14);
        fill(redColor);
        textFont(texts);
        text('are you sure? Y/N', 400, 500);
        pop();
    }

}
