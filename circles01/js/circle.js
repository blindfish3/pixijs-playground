// - - - - - - - - - - CIRCLE - - - - - - - - - - - - //

blindfish.Circle = function (targetID, w, h, radius, numDivisions, controlsID) {

    var controlsID = controlsID || targetID;

    this.v = new blindfish.VariableManager([{
        name: 'divisions',
        default: numDivisions
        }, {
        name: 'depth',
        default: 2
        }, {
        name: 'opacity',
        default: 0.015
        }, {
        name: 'speed',
        default: 0.015
        }, {
        name: 'r',
        default: 255
        }, {
        name: 'g',
        default: 255
        }, {
        name: 'b',
        default: 255
        }]);

    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(w, h);

    this.centreX = w / 2;
    this.centreY = h / 2;
    this.radius = radius;
    this.circleContainers = [];
    this.containersLength;
    this.texture = this.makeCircleTexture(this.radius);
    this.circleOffsets = this.calcChildPositions();


    this.v.addSlider(controlsID,
        'divisions', {
            min: 0,
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
                self.resetRotation();
            }
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

        this.circleContainers.push(c);
        this.stage.addChild(c);

    }

    this.containersLength = this.circleContainers.length;
};

blindfish.Circle.prototype.makeCircleSet = function () {

    var c = new PIXI.Container();

    for (var j = 0; j < this.v.divisions; j++) {

        var x = this.circleOffsets[j].x,
            y = this.circleOffsets[j].y,
            s = new PIXI.Sprite(this.texture);

        s.anchor.x = 0.5;
        s.anchor.y = 0.5;
        s.position.x = x;
        s.position.y = y;
        s.tint = Math.random() * 0xFFFFFF;

        c.addChild(s);
    }


    // c.alpha = 0.015;
    c.alpha = 0.025;
    return c;

};

blindfish.Circle.prototype.makeCircleTexture = function () {
    var circle = new PIXI.Graphics();
    // set tint and opacity in sprite instances
    circle.lineStyle(4, 0x000000, 1.0);
    circle.beginFill(0xFFFFFF, 1.0);
    circle.drawCircle(0, 0, this.radius);
    circle.endFill();

    return texture = circle.generateTexture(PIXI.WebGLRenderer);
};

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
