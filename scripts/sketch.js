

/* TO DO:

	- Menus:
		- Main Menus 			DONE
		- Game Modes 			toBeContinued
		- Pause 				Ongoing
	- Scoring:
		- Highest Score 	  	DONE
		- Current Score 		DONE
	- Base Gameplay:
		- Shoot 	    		DONE
		- Movement				DONE
		- Death					Ongoing
		- Asteroids 	    	DONE
		- Powerups				Ongoing
	- Sounds:
		- Laser Shots			Ongoing 1
		- Asteroid Broken		Ongoing 1
		- Power Up 				Ongoing 1 
		- Key Press				Ongoing 1
		- GameOver				Ongoing 1
		- Victory (for 2P)		----
		- Highscore 			Ongoing 1
	- Game Modes: 				
		- Solo					Ongoing
		- Duo 					----
		- PvP 	    			----


		To Code (according to prio):
			Max:
				- bgm 
				
			Yoe:
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

	// sounds here
	laserSound = loadSound('assets/sounds/short laser shot 1.wav');
	upgradedLaserSound = loadSound('assets/sounds/short laser shot 1 upg.wav');
	asteroidSound = loadSound('assets/sounds/crushingRocks1Edited.wav');
	powerUpSound = loadSound('assets/sounds/powerUp.wav');
	gameOverSound = loadSound('assets/sounds/gameOver.wav');
	gameStartSound = loadSound('assets/sounds/gameStart.wav');
	keyPressSound = loadSound('assets/sounds/keyPress.wav');
	newHighScoreSound = loadSound('assets/sounds/newHighScore.wav');
	addScorePowerUpSound = loadSound('assets/sounds/addScorePowerUp.wav');
	hsResetSound = loadSound('assets/sounds/hsReset.wav');
	
}

function setup() {
	loadHighScores();	
	setupGlobal();
	// load all gameMode setups here
  	setupSolo();
  	
	let cnv = createCanvas(800, 600);
	cnv.style('display', 'block');
	cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);

	for (let i = 0; i < 100; i++){
		stars.push( new Star() );
	}

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
		duo();
	}
	else if (pageState === "pvp"){
		// pvp();
	} 	
	// REMINDER: over/gameOver IS NOT a state, bruh
	if (over === true){
		gameOver();
	}

	// crt effect
	push(); 
	noFill();
	stroke(0, 50);
	strokeWeight(1);
	for (let i = 0; i < 600; i += 3) {
	    line(0, i, 800, i);
	}
	pop();
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

