(function () {

    // create a renderer instance.
    blindfish.renderer = PIXI.autoDetectRenderer(450, 325);

    // add the renderer view element to the DOM
   var sketch = document.getElementById('sketch01');

    sketch.appendChild(blindfish.renderer.view);

    // possibly unecessary given we're using a single image
    PIXI.loader
        .add('elephant.jpg')
        .load(onAssetsLoaded);


    function onAssetsLoaded() {

        blindfish.stage = new PIXI.Container();
        blindfish.stageCentreX =  blindfish.renderer.width/2;
        blindfish.stageCentreY =  blindfish.renderer.height/2;

        blindfish.container = new PIXI.DisplayObjectContainer();
        blindfish.container = new PIXI.ParticleContainer(10000, [false, true, false, false, false]);
        blindfish.stage.addChild(blindfish.container);
        blindfish.sprites = [];

        var img = PIXI.BaseTexture.fromImage('elephant.jpg'),
            imgWidth = img.width,
            imgHeight = img.height,
            particleWidth = 4,
            particleHeight = 4,
            halfParticleWidth = particleWidth / 2,
            halfParticleHeight = particleHeight / 2,
            horizontalDivisions = Math.floor(imgWidth / particleWidth),
            verticalDivisions = Math.floor(imgHeight / particleHeight),
            index = 0;

        for (var i = 0; i < verticalDivisions; i++) {
            for (var j = 0; j < horizontalDivisions; j++) {

                var x = j * particleWidth,
                    y = i * particleHeight,
                    texture = new PIXI.Texture(img, new PIXI.Rectangle(x, y, particleWidth, particleHeight)),
                    s = new PIXI.Sprite(texture);

                s.anchor.x = 0.5;
                s.anchor.y = 0.5;
                s.position.x = x;
                s.position.y = y;

                blindfish.sprites[index] = new blindfish.PixiParticle(s);

                blindfish.container.addChild(s);
                index++;
            }
        }

        blindfish.spritesLen = blindfish.sprites.length;
        console.info("number of particles: " + blindfish.spritesLen);

        requestAnimationFrame(animate);
    }


    function animate() {
        // avoid recalculating these in every particle!
        var mouseX = blindfish.renderer.plugins.interaction.mouse.global.x,
              mouseY = blindfish.renderer.plugins.interaction.mouse.global.y;

        blindfish.mouseOverStage = (mouseX > 0 &&
                                                mouseX <  blindfish.renderer.width &&
                                                mouseY > 0 &&
                                                mouseY < blindfish.renderer.height);


        for (var i = blindfish.spritesLen - 1; i > 0; i--) {
            blindfish.sprites[i].move(mouseX, mouseY, blindfish.mouseOverStage);
        }

        // render the stage
        blindfish.renderer.render(blindfish.stage);
        requestAnimationFrame(animate);
    }

    document.getElementById('implodeBtn').addEventListener('click',function() {
        explode("implode");
    });
    document.getElementById('randomBtn').addEventListener('click',function() {
        explode("random");
    });

    function explode(mode) {
        for (var i = blindfish.spritesLen - 1; i > 0; i--) {
                blindfish.sprites[i].explode(mode);
            }
    }
    document.getElementById('resetBtn').addEventListener('click',function() {
        for (var i = blindfish.spritesLen - 1; i > 0; i--) {
                blindfish.sprites[i].reset();
            }
    });

})();
