// Is there any benefit to creating a separate Circle object?
blindfish.Circle = function(container, radius, depth, colour) {
    this.c = container;
    this.radius = radius;
    this.depth = depth;
    this.colour = colour;
}



// - - - - - - - - - - CIRCLESET - - - - - - - - - - - - //

blindfish.CircleSet = function (targetID, w, h, radius, numDivisions, controlsID) {

    var controlsID = controlsID || targetID;

    this.v = new blindfish.VariableManager([
        { name: 'divisions', default: numDivisions },
        { name: 'depth', default: 2 },
        { name: 'opacity', default: 0.25 },
        { name: 'line_width', default: 2 },
        { name: 'speed', default: 0.0 },
        { name: 'noise', default: 0.1 },
        { name: 'twist', default: 3 },
        { name: 'blur', default: 0},
        { name: 'sepia', default: 0.3},
        { name: 'invert', default: false }
    ]);


    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(w, h);

    this.centreX = w / 2;
    this.centreY = h / 2;
    this.radius = radius;
    this.circleContainers = [];
    this.containersLength;
    this.texture = this.makeCircleTexture(this.radius);
    
    this.circleOffsets = this.calcChildPositions();

    
    this.addControls(controlsID);
    
    this.addCircles();

 document.getElementById(targetID).appendChild(this.renderer.view);

};


blindfish.CircleSet.prototype.resetRotation = function () {
    for (var i = 0; i < this.containersLength; i++) {
        var c = this.circleContainers[i];
        //TODO: ease rotation to '0'
        c.rotation = 0;
    }
};

blindfish.CircleSet.prototype.removeContainers = function () {
    this.stage.removeChildren();
    this.circleContainers = [];
};

blindfish.CircleSet.prototype.updateCircles = function () {
    this.removeContainers();
    this.circleOffsets = this.calcChildPositions();
    this.addCircles();
};

blindfish.CircleSet.prototype.addCircles = function () {
    var divisions = this.v.divisions;

    for (var i = 0; i < divisions; i++) {
        var cx = this.centreX + this.circleOffsets[i].x,
            cy = this.centreY + this.circleOffsets[i].y,
            c = this.makeCircleSet(divisions, this.circleOffsets);

        c.position.x = cx;
        c.position.y = cy;

        this.circleContainers.push(c);

        this.stage.addChild(c);

        // for debug...
        var text = new PIXI.Text(''+i,{font : '16px Arial', fill : 0xff9900, align : 'left'});
    text.position.x = cx - 6;
    text.position.y = cy - 8;
//    this.stage.addChild(text);
        

    }
    
       this.drawStar();

    this.containersLength = this.circleContainers.length;
};

blindfish.CircleSet.prototype.makeCircleSet = function () {

    var c = new PIXI.Container(),
        g = new PIXI.Graphics(),
        lastIndex = this.v.divisions -1;

    g.lineStyle(this.v.line_width, 0xffffff, 1);

    g.moveTo(this.circleOffsets[lastIndex].x,  
             this.circleOffsets[lastIndex].y);

    for (var j = 0; j < this.v.divisions; j++) {

        var x = this.circleOffsets[j].x,
            y = this.circleOffsets[j].y;
            g.lineTo(x,y);
        
    
            s = new PIXI.Sprite(this.texture);

        s.anchor.x = 0.5;
        s.anchor.y = 0.5;
        s.position.x = x;
        s.position.y = y;
//        s.tint = Math.random() * 0xFFFFFF;
       s.alpha = 0.25;
        c.addChild(s);
    }

    
    
        
    c.addChild(g);

    // TODO: add colour in a uniform fashion that is stored
    // g.tint = Math.random() * 0xFFFFFF;
    // c.alpha = 0.015;
    c.alpha = this.v.opacity;
    
    // instead of a separate circle class we could add props directly to the Container
    // That *could* lead to a naming clash though!!!
    c.myProps = {};
    return c;

};


blindfish.CircleSet.prototype.makeCircleTexture = function () {
    var circle = new PIXI.Graphics();
    // set tint and opacity in sprite instances
    circle.lineStyle(2, 0x000000, 1.0);
    circle.beginFill(0xFFFFFF, 1.0);
     circle.drawCircle(0, 0, this.radius);
    circle.endFill();

    return texture = circle.generateTexture(PIXI.WebGLRenderer);
};



blindfish.CircleSet.prototype.drawStar = function() {

    var g = new PIXI.Graphics();
    g.lineStyle(this.v.line_width, 0x000000, 0.6);
    
    console.log(this.circleOffsets);
        console.log(this.centreX);
for(var i=0, len = this.circleOffsets.length; i<len; i++) {
    

 if(i==0) {
    g.moveTo(this.centreX +
             this.circleOffsets[i].x, 
            this.centreY +
             this.circleOffsets[i].y);
    }
    if(i < len-1) {
    g.lineTo(this.centreX +
             this.circleOffsets[i].x +
             this.circleOffsets[i+1].x, 
            this.centreY +
             this.circleOffsets[i].y +
             this.circleOffsets[i+1].y);
    
    
    g.lineTo(this.centreX +
             this.circleOffsets[i+1].x, 
            this.centreY +
             this.circleOffsets[i+1].y);
    }
    else {
    g.lineTo(this.centreX +
             this.circleOffsets[i].x +
             this.circleOffsets[0].x, 
            this.centreY +
             this.circleOffsets[i].y +
             this.circleOffsets[0].y);
    
    
    g.lineTo(this.centreX +
             this.circleOffsets[0].x, 
            this.centreY +
             this.circleOffsets[0].y);
    }
    
}    
    
    
    this.stage.addChild(g);
    
}

blindfish.CircleSet.prototype.calcChildPositions = function () {

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

blindfish.CircleSet.prototype.animate = function () {

    for (var i = 0; i < this.containersLength; i++) {
        var c = this.circleContainers[i],
            dir = (i % 2 === 0) ? 1 : -1; // reversing directions is nice :)

        c.rotation += this.v.speed * dir;

    }
};



blindfish.CircleSet.prototype.addControls = function(controlsID) {
    
    var self = this;
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
            max: this.radius,
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
    
}