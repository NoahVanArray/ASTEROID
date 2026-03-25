let stars = [];
class Star {
    

    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(1,5);
        this.speed = random(1,3);
    }

    show() {
        push();
        drawingContext.shadowColor = color(244); 
        drawingContext.shadowBlur = 20;
        noStroke();
        fill(244);
        ellipse(this.x, this.y, this.size);
        pop();
    }

    update() {
        this.x -= this.speed;

        if (this.x < this.size) {
            this.x = width + this.size;
            this.y = random(height);
        }
    }
    
}