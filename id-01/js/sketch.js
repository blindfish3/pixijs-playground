
(function() {

  var w = 400,
         h = 400;

    var circleManager = new blindfish.CircleSet('sketch1', w, h, 60, 6, 'controls1');


  requestAnimationFrame(animateCircles);


  function animateCircles() {

    circleManager.animate();

    circleManager.renderer.render(circleManager.stage);
    requestAnimationFrame(animateCircles);
  }


})();
