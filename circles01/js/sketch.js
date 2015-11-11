(function () {

  blindfish.stage = new PIXI.Container();
  blindfish.radius = 120;
  blindfish.circleContainers = [];
  blindfish.texture = makeCircleTexture(blindfish.radius);
  blindfish.numDivisions = 12;

    // create a renderer instance.
    var w = 1200,
        h = 800,
        centreX = w/2,
        centreY = h/2,
        renderer = PIXI.autoDetectRenderer(w, h),
        containersLength,
        circleOffsets = calcChildPositions();

    addCircles(circleOffsets);


    // add the renderer view element to the DOM
    document.getElementById('sketch01').appendChild(renderer.view);

    requestAnimationFrame(animate);

    function animate() {

        for(var i=0; i<containersLength; i++) {
          var c = blindfish.circleContainers[i],
                 dir = (i%2 === 0) ? 1 : -1; // reversing directions is nice :)

          c.rotation += 0.005 * dir;


        }
        // render the stage
        renderer.render(blindfish.stage);
        requestAnimationFrame(animate);
    }

    // - - - - - - - - - - EVENTS - - - - - - - - - - - - //

    document.addEventListener('click', function() {
      removeContainers();

      var circleOffsets = calcChildPositions();
      addCircles(circleOffsets);
    })



    // - - - - - - - - - - FUNCTIONS - - - - - - - - - - - - //


    function removeContainers() {
        blindfish.stage.removeChildren();
        blindfish.circleContainers = [];
    }

    function addCircles(circleOffsets) {
      for (var i = 0; i < blindfish.numDivisions; i++) {
          var cx = centreX +  circleOffsets[i].x,
              cy = centreY + circleOffsets[i].y,

              c = makeCircleSet(blindfish.numDivisions, circleOffsets, blindfish.texture);

          c.position.x = cx;
          c.position.y = cy;
          // c.cacheAsBitmap = true;

          blindfish.circleContainers.push(c);

          blindfish.stage.addChild(c);

      }

      containersLength = blindfish.circleContainers.length;
    }

    function makeCircleSet() {

      var c = new PIXI.Container();

      for (var j = 0; j < blindfish.numDivisions; j++) {

       var x = circleOffsets[j].x,
             y = circleOffsets[j].y,
               s = new PIXI.Sprite(blindfish.texture);

       s.anchor.x = 0.5;
       s.anchor.y = 0.5;
       s.position.x = x;
       s.position.y = y;
       s.tint = Math.random() * 0xFFFFFF;
       // s.alpha = 0.015;
       s.alpha = 0.03;
       // circles.push(s);

       c.addChild(s);
      }

      return c;

    }


    function makeCircleTexture() {
        var circle = new PIXI.Graphics();
        // set tint and opacity in sprite instances
        circle.lineStyle(4, 0x000000, 1.0);
        circle.beginFill(0xFFFFFF, 1.0);
        circle.drawCircle(0, 0, blindfish.radius);
        circle.endFill();

        return texture = circle.generateTexture(PIXI.WebGLRenderer);
    }

    function calcChildPositions() {

        var angle = Math.PI * 2 / blindfish.numDivisions,
            output = [];

        for (var i = 0; i < blindfish.numDivisions; i++) {
            var pointX = blindfish.radius * Math.cos(angle * i),
                pointY = blindfish.radius * Math.sin(angle * i);

            output.push({
                'x': pointX,
                'y': pointY
            });
        }

        return output;

    }


})();
