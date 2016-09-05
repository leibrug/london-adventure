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
  var frameOverPiece;
  var frameUnderPiece;

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
        if (frameState === 1) {
          frameOverPiece = c.getImageData(40 + framePositionX * 60, 60 + framePositionY * 60, 60, 60);
          // console.log(frameOverPiece);
        }
      }
      else {
        var canMove = false;
        var frameUnderPieceOffsetX = 0;
        var frameUnderPieceOffsetY = 0;
        switch (currentKey) {
          case 37:
            canMove = framePositionX > 0;
            frameMoveDirection = '←';
            frameUnderPieceOffsetX = -60;
            break;
          case 38:
            canMove = framePositionY > 0;
            frameMoveDirection = '↑';
            frameUnderPieceOffsetY = -60;
            break;
          case 39:
            canMove = framePositionX < 3;
            frameMoveDirection = '→';
            frameUnderPieceOffsetX = 60;
            break;
          case 40:
            canMove = framePositionY < 1;
            frameMoveDirection = '↓';
            frameUnderPieceOffsetY = 60;
            break;
        }
        if (canMove) {
          frameMoveTimeStamp = timeStamp;
          if (frameState === 1) {
            frameUnderPiece = c.getImageData(40 + framePositionX * 60 + frameUnderPieceOffsetX, 60 + framePositionY * 60 + frameUnderPieceOffsetY, 60, 60);
            // console.log(frameUnderPiece);
          }
        }
        else if (frameState === 1) {
          frameState = 0;
        }
      }
      isKeyDown = false;
    }

    if (frameMoveTimeStamp !== 0) {
      var delta = timeStamp - frameMoveTimeStamp;
      if (delta < 200) {
        var offset = Math.min(delta/3.33, 60);
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
        if (frameState === 1) {
          var fillOffsetX = (frameMoveDirection === '←') ? -60 : 0;
          var fillOffsetY = (frameMoveDirection === '↑') ? -60 : 0;
          var fillMultiplierX = (frameMoveDirection === '←' || frameMoveDirection === '→') ? 2 : 1;
          var fillMultiplierY = (frameMoveDirection === '↑' || frameMoveDirection === '↓') ? 2 : 1;
          c.fillRect(40 + framePositionX * 60 + fillOffsetX, 60 + framePositionY * 60 + fillOffsetY, 60 * fillMultiplierX, 60 * fillMultiplierY);
        }
      }
      else {
        frameState = 0;
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
    if ([32, 37, 38, 39, 40].includes(event.keyCode) && frameMoveTimeStamp === 0) {
      isKeyDown = true;
      currentKey = event.keyCode;
    }
  }



  return {
    start: () => {
      g.addEventListener('keydown', keyDownHandler, false);
      animationFrame = window.requestAnimationFrame(draw);
    }
  };

}();

gGreg.start();
