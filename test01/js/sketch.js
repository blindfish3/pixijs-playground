(function() {


	// create a renderer instance.
	var w = 600, h=400,
          renderer = PIXI.autoDetectRenderer(w, h),
          circleSprite,
          numCircles = 500,
          radius = 30,
          centreY = h/2,
          offsetX = w/numCircles,
          // range of movement above and below centreY
          movementRange = (h-radius)/2 + radius*2, // sends the 'turning point' offscreen
          circles = [],
          count = 0;


	// add the renderer view element to the DOM
	document.getElementById('sketch01').appendChild(renderer.view);

    blindfish.stage = new PIXI.Container();

    var texture = makeCircleTexture(radius);

    for(var i=0; i<numCircles; i++) {
            var s = new PIXI.Sprite(texture);
            s.anchor.x = 0.5;
            s.anchor.y = 0.5;
            s.position.x = offsetX * (i);
            s.position.y = centreY;
           s.tint = Math.random() * 0xFFFFFF;
            s.alpha = 0.15;
            blindfish.stage.addChild(s);
            circles.push(s);
    }


    requestAnimationFrame(animate);

	function animate() {

        count += 0.02; // determines speed
        for (var i=0; i<numCircles; i++) {
            // i * 0.5 = offset
            circles[i].y = centreY + Math.sin((i * 0.666) + count) * movementRange;

        //circles[i].x = i * ropeLength + Math.cos((i * 0.3) + count) * 20;
        }

	    // render the stage
	    renderer.render(blindfish.stage);
	    requestAnimationFrame(animate);
	}



    // - - - - - - - - - - - - - - - - - - - - - - //


    function makeCircleTexture(radius) {
        var circle = new PIXI.Graphics();
        // set tint and opacity in sprite instances
        circle.beginFill(0xFFFFFF, 1.0);
        circle.drawCircle(0,0,radius);
        circle.endFill();

        return texture = circle.generateTexture();
    }

})();

