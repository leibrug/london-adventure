var gGreg = function() {


  // TODO: multiple sources
  var gfxBanknote = getImg('img/06_greg/banknote.png');

  var animationFrame;


  var framePositions = [
    [1, 2, 3, 4],
    [5, 6, 7, 8]
  ];
  var framePosition = 1;


  var previousTimeStamp = 0;


  // Set up stroke for frame
  c.lineWidth = 4;
  c.strokeStyle = '#dcb42c';


  function draw(timeStamp) {
    c.drawImage(gfxBanknote, 40, 60);
    c.strokeRect(40, 60, 60, 60);

    window.requestAnimationFrame(draw);
  }


  // Controls

  var isKeyDown = false;
  var currentKey;

  function keyDownHandler(event) {
    if ([37, 38, 39, 40].indexOf(event.keyCode) !== -1) {
      isKeyDown = true;
      currentKey = event.keyCode;
    }
  }

  function keyUpHandler(event) {
    
  }


  return {
    start: () => {
      g.addEventListener('keydown', keyDownHandler, false);
      g.addEventListener('keyup', keyUpHandler, false);
      animationFrame = window.requestAnimationFrame(draw);
    }
  };

}();

gGreg.start();
