


/* TO DO:

	- Menus:
		- Main Menu
		- Game Modes
		- Pause
	- Scoring
		- Highest Score ()
	- 
	- 



*/

// let bg64 = "";

let stars = [];

function preload() {
  // bgImg = loadImage(bg64);
}

function setup() {
	createCanvas(displayWidth-140, displayHeight-140);

	for (let i = 0; i < 100; i++){
		stars.push( new Star() );
	}

}

function draw() {
    background(20);

    // image(bgImg, 0,0, width, height);

    for (let i = 0; i < stars.length; i++) {
    	stars[i].show();
    	stars[i].update();
    }
}

class Star {
	constructor() {
		this.x = random(width);
		this.y = random(height);
		this.size = random(1,5);
		this.speed = random(1,3);
	}

	show() {
		noStroke();
		fill(244);
		ellipse(this.x, this.y, this.size);
	}

	update() {
		this.x -= this.speed;

		if (this.x < this.size) {
			this.x = width + this.size;
			this.y = random(height);
		}
	}
}