
(function() {

  var w = 400,
         h = 300;

    var circleManager = new blindfish.Circle('sketch1', w, h, 60, 12, 'controls1');
    var circleManager2 = new blindfish.Circle('sketch2', w, h, 50, 12,  'controls2');

  requestAnimationFrame(animateCircles);


  function animateCircles() {

      circleManager.animate();
      circleManager2.animate();


    // render the stage
    circleManager.renderer.render(circleManager.stage);
    circleManager2.renderer.render(circleManager2.stage);
    requestAnimationFrame(animateCircles);
  }


})();
