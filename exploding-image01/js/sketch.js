(function () {


    // create a renderer instance.
    blindfish.renderer = PIXI.autoDetectRenderer(450, 325);

    // add the renderer view element to the DOM
    document.getElementById('sketch01').appendChild(blindfish.renderer.view);

    // possibly unecessary given we're using a single image
    PIXI.loader
        .add('elephant.jpg')
        .load(onAssetsLoaded);


    function onAssetsLoaded() {

        blindfish.stage = new PIXI.Container();

        blindfish.container = new PIXI.DisplayObjectContainer();
        blindfish.container = new PIXI.ParticleContainer(200000, [false, true, false, false, false]);
        blindfish.stage.addChild(blindfish.container);
        blindfish.sprites = [];

        var img = PIXI.BaseTexture.fromImage('elephant.jpg'),
            imgWidth = img.width,
            imgHeight = img.height,
            particleWidth = 6,
            particleHeight = 6,
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
                s.position.x = x - halfParticleWidth;
                s.position.y = y - halfParticleHeight;

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
            mouseY = blindfish.renderer.plugins.interaction.mouse.global.y,
            mouseOverStage = false;

        if (mouseX > 0 && mouseX < blindfish.renderer.width && mouseY > 0 && mouseY < blindfish.renderer.height) {
            mouseOverStage = true;
        }
        else {
            mouseOverStage = false;
        }

        for (var i = blindfish.spritesLen - 1; i > 0; i--) {
            blindfish.sprites[i].move(mouseX, mouseY, mouseOverStage);
        }

        // render the stage
        blindfish.renderer.render(blindfish.stage);
        requestAnimationFrame(animate);
    }


})();
