(function () {

    blindfish.stage = new PIXI.Container();
    blindfish.radius = 120;
    blindfish.circleContainers = [];
    blindfish.texture = makeCircleTexture(blindfish.radius);
    blindfish.numDivisions = 12;

    initControls();

    var w = 800,
        h = 800,
        centreX = w / 2,
        centreY = h / 2,
        containersLength,
        renderer = PIXI.autoDetectRenderer(w, h),
        circleOffsets = calcChildPositions();



    addCircles(circleOffsets);


    // add the renderer view element to the DOM
    document.getElementById('sketch01').appendChild(renderer.view);

    requestAnimationFrame(animate);

    function animate() {

        for (var i = 0; i < containersLength; i++) {
            var c = blindfish.circleContainers[i],
                dir = (i % 2 === 0) ? 1 : -1; // reversing directions is nice :)

            c.rotation += blindfish.v.speed * dir;


        }
        // render the stage
        renderer.render(blindfish.stage);
        requestAnimationFrame(animate);
    }

    // - - - - - - - - - - EVENTS - - - - - - - - - - - - //

    document.addEventListener('click', function () {
        // updateCircles();
    })



    // - - - - - - - - - - FUNCTIONS - - - - - - - - - - - - //


    function resetRotation() {
        for (var i = 0; i < containersLength; i++) {
            var c = blindfish.circleContainers[i];
            //TODO: ease rotation to '0'
            c.rotation = 0;
        }
    }

    function removeContainers() {
        blindfish.stage.removeChildren();
        blindfish.circleContainers = [];
    }

    function updateCircles() {
        removeContainers();

        var circleOffsets = calcChildPositions();
        addCircles(circleOffsets);

    }

    function addCircles(circleOffsets) {
        var divisions = blindfish.v.divisions;

        for (var i = 0; i < divisions; i++) {
            var cx = centreX + circleOffsets[i].x,
                  cy = centreY + circleOffsets[i].y,
                  c = makeCircleSet(divisions, circleOffsets, blindfish.texture);

            c.position.x = cx;
            c.position.y = cy;
            //          c.cacheAsBitmap = true;

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
            //       s.tint = Math.random() * 0xFFFFFF;

            c.addChild(s);
        }

        //         c.tint = Math.random() * 0xFFFFFF;
        c.alpha = 0.015;
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

        var divisions = blindfish.v.divisions,
            angle = Math.PI * 2 / divisions,
            output = [];

        for (var i = 0; i < divisions; i++) {
            var pointX = blindfish.radius * Math.cos(angle * i),
                pointY = blindfish.radius * Math.sin(angle * i);

            output.push({
                'x': pointX,
                'y': pointY
            });
        }

        return output;

    }

    function initControls() {
        blindfish.v = new blindfish.VariableManager([
                {
                    name: 'divisions',
                    default: blindfish.numDivisions
                },
                {
                    name: 'depth',
                    default: 2
                },
                {
                    name: 'opacity',
                    default: 0.015
                },
                {
                    name: 'speed',
                    default: 0.015
                },
                {
                    name: 'r',
                    default: 255
                },
                {
                    name: 'g',
                    default: 255
                },
                {
                    name: 'b',
                    default: 255
                }
        ]),

            blindfish.v.addSlider("controls",
                'divisions', {
                    min: 0,
                    max: 24,
                    value: blindfish.v.divisions,
                    step: 1
                },
                function (x) {
                    return x
                },
                function (x) {
                    return x
                },
                function () {
                    updateCircles();
                });

        blindfish.v.addSlider("controls",
            'speed', {
                min: 0,
                max: 0.025,
                value: blindfish.v.speed,
                step: 0.001
            },
            function (x) {
                return x
            },
            function (x) {
                return x
            },
            function () {

                if (blindfish.v.speed == 0) {
                    resetRotation();
                }
            });

    }

})();
