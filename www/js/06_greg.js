var gGreg = function() {


  // TODO: multiple sources
  var gfxBanknote = getImg('img/06_greg/banknote.png');

  var animationFrame;




  var framePositionX = 0;
  var framePositionY = 0;
  var frameState = 0;
  var frameStyles = ['#dcb42c', '#f8f478'];
  var frameMoveTimeStamp = 0;
  var frameMoveDirection;

  // Set up stroke for frame

  c.lineWidth = 4;
  c.strokeStyle = frameStyles[0];





  var previousTimeStamp = 0;



  function draw(timeStamp) {
    // TODO: draw anything only on changes

    c.strokeStyle = '#000000';
    c.strokeRect(40, 60, 240, 120);
    c.drawImage(gfxBanknote, 40, 60);

    var frameOffsetX = 0;
    var frameOffsetY = 0;

    // TODO block if during frame move
    if (isKeyDown) {
      if (currentKey === 32) {
        frameState = Math.abs(frameState - 1);
        c.strokeStyle = frameStyles[frameState];
      }
      else {
        var canMove = false;
        switch (currentKey) {
          case 37:
            canMove = framePositionX > 0;
            frameMoveDirection = '←';
            break;
          case 38:
            canMove = framePositionY > 0;
            frameMoveDirection = '↑';
            break;
          case 39:
            canMove = framePositionX < 3;
            frameMoveDirection = '→';
            break;
          case 40:
            canMove = framePositionY < 1;
            frameMoveDirection = '↓';
            break;
        }
        if (canMove) {
          frameMoveTimeStamp = timeStamp;
          if (frameState === 0) {

          }
          else {
            // TODO: move pieces
          }
        }
        else if (frameState === 1) {
          // TODO: reset if frame state is 1 and can't move
        }
      }
      isKeyDown = false;
    }

    if (frameMoveTimeStamp !== 0) {
      var delta = timeStamp - frameMoveTimeStamp;
      if (delta < 250) {
        var offset = Math.min(delta/4.17, 60);

        switch (frameMoveDirection) {
          case '←':
            frameOffsetX = -offset;
            break;
          case '↑':
            frameOffsetY = -offset;
            break;
          case '→':
            frameOffsetX = offset;
            break;
          case '↓':
            frameOffsetY = offset;
            break;
        }
      }
      else {
        frameMoveTimeStamp = 0;
        switch (frameMoveDirection) {
          case '←':
            framePositionX -= 1;
            break;
          case '↑':
            framePositionY -= 1;
            break;
          case '→':
            framePositionX += 1;
            break;
          case '↓':
            framePositionY += 1;
            break;
        }
      }
    }

    c.strokeStyle = frameStyles[frameState];
    c.strokeRect(40 + framePositionX * 60 + frameOffsetX, 60 + framePositionY * 60 + frameOffsetY, 60, 60);

    // previousTimeStamp = timeStamp;
    window.requestAnimationFrame(draw);
  }


  // Controls

  var isKeyDown = false;
  var currentKey;

  function keyDownHandler(event) {
    if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
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
