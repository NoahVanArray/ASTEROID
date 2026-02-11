

/* TO DO:

	- Menus:
		- Main Menus 			DONE
		- Game Modes 			toBeContinued
		- Pause 				----
	- Scoring:
		- Highest Score ()  	DONE
		- Current Score 		DONE
	- Base Gameplay:
		- Shoot 	    			DONE
		- Movement			DONE
		- Death					Ongoing
		- Asteroids 	    		DONE
	- Game Modes: 				
		- Solo					Ongoing
		- Duo 					----
		- PvP 	    				----


		To Code (according to prio):
			Max:
				- bgm 
				
			Yoe:
				- blinking phase transition
				- sfx


	COLOR SCHEMES:
		Texts/Headers/Instructions - 
		Scores/HighScores/ 
		Interactives - 
		Warnings -
*/

function preload() {
	// load all gameMode preloads here
	preloadSolo();	
	preloadGameMode();

	

}

function setup() {
	loadHighScores();	
	setupGlobal();
	// load all gameMode setups here
  	setupSolo();
  	createCanvas(displayWidth*0.99, displayHeight*0.83);

	for (let i = 0; i < 100; i++){
		stars.push( new Star() );
	}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  	background(20);

  	for (let i = 0; i < stars.length; i++) {
    	stars[i].show();
    	stars[i].update();
    }

	// where you curr are
	// load all gameMode draws here
	if (pageState === "title"){
		 title();
	}
	else if (pageState === "gameMode"){
		gameMode();
	}
	else if (pageState === "solo"){
		drawSolo();
	}
	else if (pageState === "duo"){
		// duo();
	}
	else if (pageState === "pvp"){
		// pvp();
	} 	
	// REMINDER: over/gameOver IS NOT a state, bruh
	if (over === true){
		gameOver();
	}
}

function resetAllHighScores() {
    highScores.solo = 0;
    highScores.duo = 0;
    highScores.pvp = 0;

    removeItem('soloHigh');
    removeItem('duoHigh');
    removeItem('pvpHigh');

    console.log("High Scores have been reset!");
}

// handles ALL actions when a key is pressed
function keyPressed() {
	// 13 = enter key
	if (keyCode === 13) {
		if (pageState === "title") {
			pageState = "gameMode"; 
			timer = 0;
	    }
	}

	// 27 = escape key
	if (keyCode === 27) {
		if (pageState === "gameMode") {
			pageState = "title";
	    }
	    if (pageState === "solo") {
			pageState = "gameMode";
			over = false;
	    }
	}

	//  49 = "1"
	if (keyCode === 49) {
		if (pageState === "gameMode") {
			resetSolo();
			pageState = "solo";
	    }
	}

	//  50= "2"
	if (keyCode === 50) {
		if (pageState === "gameMode") {
			pageState = "duo";
	    }
	}

	//  51 = "3"
	if (keyCode === 51) {
		if (pageState === "gameMode") {
			pageState = "pvp";
	    }
	}

	//  78 = "N" key
	if (keyCode === 78) {
		if (pageState === "title") {
			stage = 1;
		}
	}

	//  82 = "R" key
	if (keyCode === 82) {
		if (over === true) {
			resetSolo();
			pageState = "solo";
	    }
		if (pageState === "title") {
			stage = 2;
			// resetAllHighScores();
		}
	}

	//  89 = "Y" key
	if (keyCode === 89) {
		if (pageState === "title" && stage === 2) {
			resetHighScore = 120;
			stage = 1;
			isHSReset = true;
	    	resetAllHighScores();
		}
	}

	if (pageState === "solo") {
        keyPressedSolo(); 
    }
}