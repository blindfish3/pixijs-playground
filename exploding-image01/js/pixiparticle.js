blindfish.PixiParticle = function (s) {
    // The pixi sprite that does all the heavy lifting :)
    this.s = s;
    //store the original position in the image for this particle
    this.originX = s.position.x;
    this.originY = s.position.y;

    this.vx = 0;
    this.vy = 0;

}

blindfish.PixiParticle.prototype.move = function (mouseX, mouseY, mouseOverStage) {

    var dx = mouseX - this.s.position.x,
        dy = mouseY - this.s.position.y,
        deltaSquared = dx * dx + dy * dy,
        angle = Math.atan2(dy, dx),
        speed = -deltaSquared;


    if (mouseOverStage) {
        if (deltaSquared < 2400) {
            this.returnToOrigin = false;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
        }
    }
    // a value double of that above appears to work best here
    if (deltaSquared > 4800) {
        this.moveToOrigin();
    }

    this.s.position.x += this.vx;
    this.s.position.y += this.vy;

}

blindfish.PixiParticle.prototype.moveToOrigin = function () {
    if (this.returnToOrigin) {
        this.s.position.x = this.originX;
        this.s.position.y = this.originY;
    } else {
        // stop the initially applied motion in readiness for
        // springing back to origin...
        this.vx = 0;
        this.vy = 0;

        var dx2 = this.originX - this.s.position.x,
            dy2 = this.originY - this.s.position.y;

        this.vx += dx2 * blindfish.g.spring;
        this.vy += dy2 * blindfish.g.spring;
        this.vx *= blindfish.g.friction;
        this.vy *= blindfish.g.friction;

        // ensure particles do eventually get back to their exact start position
        if (Math.abs(dx2) < 0.05 && Math.abs(dy2) < 0.05) {
            this.returnToOrigin = true;
        }

    }
}
