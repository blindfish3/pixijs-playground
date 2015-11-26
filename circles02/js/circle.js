// - - - - - - - - - - CIRCLE - - - - - - - - - - - - //

blindfish.Circle = function (targetID, w, h, radius, numDivisions, controlsID) {

    var controlsID = controlsID || targetID;

    this.v = new blindfish.VariableManager([
        { name: 'divisions', default: numDivisions },
        { name: 'depth', default: 2 },
        { name: 'opacity', default: 0.1 },
        { name: 'line_width', default: 100 },
        { name: 'speed', default: 0.025 },
        { name: 'noise', default: 0.1 },
        { name: 'twist', default: 3 },
        { name: 'blur', default: 50},
        { name: 'invert', default: false }
    ]);

    console.info(this.v.bloom_blur);

    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(w, h);

    // Filters look interesting...
    this.noiseFilter = new PIXI.filters.NoiseFilter();
    this.twistFilter = new PIXI.filters.TwistFilter();
    this.invertFilter = new PIXI.filters.InvertFilter();
    this.blurFilter = new PIXI.filters.BlurFilter();
    this.fooFilter = 1;

    this.noiseFilter.noise = this.v.noise;
    this.noiseFilter.padding = this.radius*2;
    this.twistFilter.angle = this.v.twist;
    this.invertFilter.invert = 0;
    this.invertFilter.padding = this.radius*2;
    this.blurFilter.blur = this.v.blur;

//this.DotScreenFilter.angle = 45;
//    this.DotScreenFilter.scale = 1;


    //TODO: figure out why in some instances clipping occurs
    // when changing line width.  Definitely associated with filters,
    // especially those that accept padding
    this.stage.filters = [this.noiseFilter, this.invertFilter,  this.blurFilter, this.twistFilter];

    this.centreX = w / 2;
    this.centreY = h / 2;
    this.radius = radius;
    this.circleContainers = [];
    this.containersLength;
//    this.texture = this.makeCircleTexture(this.radius);
    this.circleOffsets = this.calcChildPositions();


    this.v.addSlider(controlsID,
        'divisions', {
            min: 3,
            max: 24,
            value: this.v.divisions,
            step: 1
        },
        function (x) {
            return x
        },
        function (x) {
            return x
        },
        function () {
            self.updateCircles();
        });

        this.v.addSlider(controlsID,
        'line_width', {
            min: 1,
            max: radius,
            value: this.v.line_width,
            step: 1
        },
        function (x) {
            return x
        },
        function (x) {
            return x
        },
        function () {
            self.updateCircles();
            self.noiseFilter.padding = self.radius*2;
        });


        this.v.addSlider(controlsID,
        'opacity', {
            min: 0,
            max: 0.4,
            value: this.v.opacity,
            step: 0.01
        },
        function (x) {
            return x
        },
        function (x) {
            return x
        },
        function () {
            self.updateCircles();
        });

    this.v.addSlider(controlsID,
        'speed', {
            min: 0,
            max: 0.025,
            value: this.v.speed,
            step: 0.001
        },
        function (x) {
            return x
        },
        function (x) {
            return x
        },
        function () {

            if (self.v.speed == 0) {

            }
        });

    this.v.addSlider('controls2',
            'noise', {
                min: 0,
                max: 0.25,
                value: this.v.noise,
                step: 0.01
            },
            function (x) {
                return x
            },
            function (x) {
                return x
            },
            function () {
                self.noiseFilter.padding = self.radius*2;
                self.noiseFilter.noise = self.v.noise;
            });

            this.v.addSlider('controls2',
                    'twist', {
                        min: 0,
                        max: 10,
                        value: this.v.twist,
                        step: 0.1
                    },
                    function (x) {
                        return x
                    },
                    function (x) {
                        return x
                    },
                    function () {
                        self.twistFilter.angle = self.v.twist;
                    });

            this.v.addSlider('controls2',
                    'blur', {
                        min: 0,
                        max: 50,
                        value: this.v.blur,
                        step: 1
                    },
                    function (x) {
                        return x
                    },
                    function (x) {
                        return x
                    },
                    function () {
                        self.blurFilter.blur = self.v.blur;
                    });

this.v.addCheckbox('controls2', 'invert', {val : this.v.invert }, 'invert', function() {
    self.invertFilter.invert = self.v.invert ? 1 : 0;
});

    this.addCircles();

    var self = this;

    document.getElementById(targetID).appendChild(this.renderer.view);

};


blindfish.Circle.prototype.resetRotation = function () {
    for (var i = 0; i < this.containersLength; i++) {
        var c = this.circleContainers[i];
        //TODO: ease rotation to '0'
        c.rotation = 0;
    }
};

blindfish.Circle.prototype.removeContainers = function () {
    this.stage.removeChildren();
    this.circleContainers = [];
};

blindfish.Circle.prototype.updateCircles = function () {
    this.removeContainers();
    this.circleOffsets = this.calcChildPositions();
    this.addCircles();
};

blindfish.Circle.prototype.addCircles = function () {
    var divisions = this.v.divisions;

    for (var i = 0; i < divisions; i++) {
        var cx = this.centreX + this.circleOffsets[i].x,
            cy = this.centreY + this.circleOffsets[i].y,
            c = this.makeCircleSet(divisions, this.circleOffsets, this.texture);

        c.position.x = cx;
        c.position.y = cy;
        //          c.cacheAsBitmap = true;

//        c.filters= [this.fooFilter];

        this.circleContainers.push(c);

        this.stage.addChild(c);


    }

    this.containersLength = this.circleContainers.length;
};

blindfish.Circle.prototype.makeCircleSet = function () {

    var c = new PIXI.Container(),
          g = new PIXI.Graphics(),
          lastIndex = this.v.divisions -1;

    g.lineStyle(this.v.line_width, 0xffffff, 1);

     g.moveTo(this.circleOffsets[lastIndex].x, this.circleOffsets[lastIndex].y);

    for (var j = 0; j < this.v.divisions; j++) {

        var x = this.circleOffsets[j].x,
              y = this.circleOffsets[j].y
            g.lineTo(x,y);
    }

    c.addChild(g);

// g.tint = Math.random() * 0xFFFFFF;
    // c.alpha = 0.015;
    c.alpha = this.v.opacity;
    return c;

};

/*
blindfish.Circle.prototype.makeCircleTexture = function () {
    var circle = new PIXI.Graphics();
    // set tint and opacity in sprite instances
    circle.lineStyle(4, 0x000000, 1.0);
    circle.beginFill(0xFFFFFF, 1.0);
     circle.drawCircle(0, 0, this.radius);
    circle.endFill();

    return texture = circle.generateTexture(PIXI.WebGLRenderer);
};
*/
blindfish.Circle.prototype.calcChildPositions = function () {

    var divisions = this.v.divisions,
        angle = Math.PI * 2 / divisions,
        output = [];

    for (var i = 0; i < divisions; i++) {
        var pointX = this.radius * Math.cos(angle * i),
            pointY = this.radius * Math.sin(angle * i);

        output.push({
            'x': pointX,
            'y': pointY
        });
    }

    return output;

};

blindfish.Circle.prototype.animate = function () {

    for (var i = 0; i < this.containersLength; i++) {
        var c = this.circleContainers[i],
            dir = (i % 2 === 0) ? 1 : -1; // reversing directions is nice :)

        c.rotation += this.v.speed * dir;

    }
};
