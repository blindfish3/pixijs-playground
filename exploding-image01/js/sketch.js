(function() {


	// create a renderer instance.
	var renderer = PIXI.autoDetectRenderer(450, 325);

	// add the renderer view element to the DOM
	document.getElementById('sketch01').appendChild(renderer.view);



    PIXI.loader
        .add('elephant.jpg')
        .load(onAssetsLoaded);

    function onAssetsLoaded() {


        blindfish.stage = new PIXI.Container();

        var img = PIXI.BaseTexture.fromImage('elephant.jpg'),
               imgWidth = img.width,
               imgHeight = img.height,
               particleWidth = 10,
               particleHeight = 5,
               halfParticleWidth = particleWidth/2,
               halfParticleHeight = particleHeight/2,
               horizontalDivisions = Math.floor(imgWidth / particleWidth),
               verticalDivisions = Math.floor(imgHeight / particleHeight),
               sprites = [];


            for(var i=0; i<verticalDivisions; i++){
                for(var j=0; j<horizontalDivisions; j++){
                    (function() {
                    var index = j * particleWidth + i,
                          x = j * particleWidth,
                          y = i * particleHeight,
                        texture = new PIXI.Texture(img, new    PIXI.Rectangle(x,y,particleWidth,particleHeight)),
                        s = new PIXI.Sprite(texture);
                       s.anchor.x = 0.5;
                        s.anchor.y = 0.5;
                        s.position.x = x - halfParticleWidth,
                        s.position.y = y - halfParticleHeight;

                     sprites[index] = new blindfish.PixiParticle(s);

                    blindfish.stage.addChild(s);

                    })();
                }
            }


        requestAnimationFrame(animate);

    }



	function animate() {

	    requestAnimationFrame(animate);

	    // render the stage
	    renderer.render(blindfish.stage);
	}


})();

blindfish.PixiParticle = function (args) {
  this.x = args.x;
  this.y = args.y;
  this.vx = args.vx || 0;
  this.vy = args.vy || 0;
  this.size = args.size;
  this.img = args.img;

   // this.imgWidth = this.img.width;
 //   this.imgHeight = this.img.height;

//    this.centreX = this.x + this.size / 2;
//    this.centreY = this.y + this.size / 2;
//    this.originX = this.x;
//    this.originY = this.y;
//    this.doGoToOrigin = true;

}
