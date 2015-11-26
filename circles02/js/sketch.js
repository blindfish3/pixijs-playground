
(function() {

  var w = 640,
         h = 640;

    var circleManager = new blindfish.Circle('sketch1', w, h, 120, 12, 'controls1');


  requestAnimationFrame(animateCircles);


  function animateCircles() {

    circleManager.animate();

    circleManager.renderer.render(circleManager.stage);
    requestAnimationFrame(animateCircles);
  }


})();
