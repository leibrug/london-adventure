var gGreg = function() {


  /* Titles */

  var text = [
    'I can do it.',
    'Seems easy to me.',
    'Remember son, a man\'s worth is measured by his earnings.',
    'Just get it together...',
    'Another one, great!',
    'One pound used to be as much as <strong>seven</strong> zlotys!'
  ];
  function placeText() {
    showText(text[Math.floor(Math.random()*text.length)]);
  }


  /* Unexpected spendings */

  var spendings = [
    { cost: 10, text: 'Satellite TV is a must.' },
    { cost: 20, text: 'Need to refill my tobacco supply. Because fuck lungs.' },
    { cost: 50, text: 'Time for monthly interest... on another interest.' },
    { cost: 100, text: '...and the engine just stopped. Bargain fix!' },
    { cost: 200, text: 'One-in-a-lifetime gift for my goddaughter\'s wedding.' }
  ];


  /* Greg's head */

  var headImg = getImg('img/06_greg/head.png');


  /* Banknotes */

  var banknotes = [
    { value: 5, src: 'img/06_greg/banknote-5.png' },
    { value: 10, src: 'img/06_greg/banknote-10.png' },
    { value: 20, src: 'img/06_greg/banknote-20.png' },
    { value: 50, src: 'img/06_greg/banknote-50.png' }
  ];
  var banknoteImg = getImg();
  var banknoteImageData = null;

  // Place new banknote
  var banknoteState;
  var banknoteValue = 0;
  function placeBanknote() {
    do {
      banknoteState = getShuffledBanknoteState();
    } while (isBanknoteCompleted());
    var banknoteId = getBanknoteId();
    banknoteValue = banknotes[banknoteId].value;
    getBanknoteImageData(banknoteId);
    placeText();
  }
  placeBanknote();

  // Shuffle pieces (logic)
  function getShuffledBanknoteState() {
    var ordered = [0, 1, 2, 3, 4, 5, 6, 7];
    var shuffled = [[], []];
    while (ordered.length > 0) {
      var row = (ordered.length > 4) ? 0 : 1;
      shuffled[row].push(ordered.splice(Math.floor(Math.random() * ordered.length), 1)[0]);
    }
    return shuffled;
  }

  function isBanknoteCompleted() {
    return banknoteState[0].concat(banknoteState[1]).join('') === '01234567';
  }

  function getBanknoteId() {
    var chance = Math.random();
    var id = 3;
    if (chance < 0.9) { id = 2; }
    if (chance < 0.7) { id = 1; }
    if (chance < 0.4) { id = 0; }
    return id;
  }

  // Shuffle pieces (graphics)
  var isBanknoteShuffled = false;
  var banknotePieceCoord = [
    { x: 0, y: 0 }, { x: 60, y: 0 }, { x: 120, y: 0 }, { x: 180, y: 0 },
    { x: 0, y: 60 }, { x: 60, y: 60 }, { x: 120, y: 60 }, { x: 180, y: 60 }
  ];
  function getBanknoteImageData(banknoteId) {
    banknoteImg.src = banknotes[banknoteId].src;
    banknoteImg.onload = () => {
      createImageBitmap(banknoteImg).then((bitmap) => {
        isBanknoteShuffled = true;
        banknoteImageData = bitmap;
      }, (error) => { console.error(error); });
    };
  }

  // Banknotes switching
  var banknoteSwitchTimeStamp = 0;
  var banknoteDropImageData = null;


  /* Frame */

  var framePositionX = 0;
  var framePositionY = 0;
  var frameState = 0;
  var frameStyles = ['#dcb42c', '#f8f478'];
  var frameMoveTimeStamp = 0;
  var frameMoveDirection;
  var frameOverPiece;
  var frameUnderPiece;

  c.lineWidth = 4;
  c.strokeStyle = frameStyles[0];


  /* Score */

  var score = 0;
  function updateScore(value) {
    score += value || 0;
    $score.innerHTML = '£' + score;
  }


  /* Timer */

  var timerBase = 20;
  var timerStart;
  var timerInterval;
  function startTimer() {
    timerStart = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
  }
  function updateTimer() {
    var timerState = timerBase - Math.floor((Date.now() - timerStart) / 1000);
    if (timerState <= 15) { $time.classList.add('b'); }
    if (timerState <= 5) { $time.classList.add('q'); }
    if (timerState <= 0) {
      timerState = 0;
      clearInterval(timerInterval);
      $time.classList.remove('b');
    }
    updateTime(timerState);
  }
  function updateTime(value) {
    var timeValue = isNaN(value) ? timerBase : value;
    $time.innerHTML = ('0' + timeValue).substr(-2);
  }


  /* Main loop */

  var animationFrame;
  var previousTimeStamp = 0;

  function draw(timeStamp) {

    // Initial draw - background and banknote
    c.strokeStyle = '#000000';
    c.strokeRect(40, 40, 240, 120);

    if (isBanknoteShuffled) {
      for (var i = 0; i < 8; i++) {
        var row = (i < 4) ? 0 : 1;
        var pieceCoord = banknotePieceCoord[banknoteState[row][i%4]];
        c.drawImage(banknoteImageData, pieceCoord.x, pieceCoord.y, 60, 60, 40 + banknotePieceCoord[i].x, 40 + banknotePieceCoord[i].y, 60, 60);
      }
    }
    else if (banknoteImageData && banknoteSwitchTimeStamp === 0) {
      c.putImageData(banknoteImageData, 40, 40);
    }

    // Remember shuffled image
    if (isBanknoteShuffled) {
      banknoteImageData = c.getImageData(40, 40, 240, 120);
      isBanknoteShuffled = false;
    }

    // Change frame state / setup pieces move
    var frameOffsetX = 0;
    var frameOffsetY = 0;

    if (isKeyDown) {
      if (currentKey === 32) {
        frameState = Math.abs(frameState - 1);
        if (frameState === 1) {
          frameOverPiece = c.getImageData(40 + framePositionX * 60, 40 + framePositionY * 60, 60, 60);
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
            frameUnderPiece = c.getImageData(40 + framePositionX * 60 + frameUnderPieceOffsetX, 40 + framePositionY * 60 + frameUnderPieceOffsetY, 60, 60);
          }
        }
        else if (frameState === 1) {
          frameState = 0;
        }
      }
      isKeyDown = false;
    }

    // Move frame and pieces
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
          // Black fill under moving pieces
          var fillOffsetX = (frameMoveDirection === '←') ? -60 : 0;
          var fillOffsetY = (frameMoveDirection === '↑') ? -60 : 0;
          var fillMultiplierX = (frameMoveDirection === '←' || frameMoveDirection === '→') ? 2 : 1;
          var fillMultiplierY = (frameMoveDirection === '↑' || frameMoveDirection === '↓') ? 2 : 1;
          c.fillRect(40 + framePositionX * 60 + fillOffsetX, 40 + framePositionY * 60 + fillOffsetY, 60 * fillMultiplierX, 60 * fillMultiplierY);
          // "Under" piece (target position)
          var frameUnderPiecePositionX = 40 + framePositionX * 60;
          var frameUnderPiecePositionY = 40 + framePositionY * 60;
          switch (frameMoveDirection) {
            case '←':
              frameUnderPiecePositionX -= 60;
              break;
            case '↑':
              frameUnderPiecePositionY -= 60;
              break;
            case '→':
              frameUnderPiecePositionX += 60;
              break;
            case '↓':
              frameUnderPiecePositionY += 60;
              break;
          }
          c.putImageData(frameUnderPiece, frameUnderPiecePositionX - frameOffsetX, frameUnderPiecePositionY - frameOffsetY);
          // "Over" piece (source position)
          c.putImageData(frameOverPiece, 40 + framePositionX * 60 + frameOffsetX, 40 + framePositionY * 60 + frameOffsetY);
        }
      }
      else {
        if (frameState === 1) {
          // Target frame position
          var targetFramePositionX = framePositionX;
          var targetFramePositionY = framePositionY;
          // Remember image after move
          var frameOverPieceOffsetX = 0;
          var frameOverPieceOffsetY = 0;
          switch (frameMoveDirection) {
            case '←':
              targetFramePositionX -= 1;
              frameOverPieceOffsetX -= 60;
              break;
            case '↑':
              targetFramePositionY -= 1;
              frameOverPieceOffsetY -= 60;
              break;
            case '→':
              targetFramePositionX += 1;
              frameOverPieceOffsetX += 60;
              break;
            case '↓':
              targetFramePositionY += 1;
              frameOverPieceOffsetY += 60;
              break;
          }
          c.putImageData(frameUnderPiece, 40 + framePositionX * 60, 40 + framePositionY * 60);
          c.putImageData(frameOverPiece, 40 + framePositionX * 60 + frameOverPieceOffsetX, 40 + framePositionY * 60 + frameOverPieceOffsetY);
          banknoteImageData = c.getImageData(40, 40, 240, 120);
          // Update state
          var tempPieceValue = banknoteState[framePositionY][framePositionX];
          banknoteState[framePositionY][framePositionX] = banknoteState[targetFramePositionY][targetFramePositionX];
          banknoteState[targetFramePositionY][targetFramePositionX] = tempPieceValue;
          // Banknote completed
          if (isBanknoteCompleted()) {
            banknoteSwitchTimeStamp = timeStamp;
            banknoteDropImageData = banknoteImageData;
            updateScore(banknoteValue);
            placeBanknote();
          }
        }
        // (Re)set vars
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

    // Switch to new banknote
    if (banknoteSwitchTimeStamp !== 0) {
      var delta = timeStamp - banknoteSwitchTimeStamp;
      if (delta < 500) {
        c.fillRect(40, 40, 240, 200);
        // TODO: scale instead expand
        // TODO: remove "jump" at end
        c.putImageData(banknoteImageData, 40, 40, 90 - delta*0.18, 45 - delta*0.12, 60 + delta*0.36, 30 + delta*0.24);
        if (delta < 250) {
          c.putImageData(banknoteDropImageData, 40, 40 + Math.min(delta*0.8, 200));
        }
      }
      else {
        banknoteSwitchTimeStamp = 0;
        banknoteDropImageData = null;
      }
    }

    // Place frame
    c.strokeStyle = frameStyles[frameState];
    c.strokeRect(40 + framePositionX * 60 + frameOffsetX, 40 + framePositionY * 60 + frameOffsetY, 60, 60);

    // Place head
    c.drawImage(headImg, 0, 0, 16, 16, 16, 192, 32, 32);

    // previousTimeStamp = timeStamp;
    window.requestAnimationFrame(draw);
  }


  /* Controls */

  var isKeyDown = false;
  var currentKey;

  function keyDownHandler(event) {
    if ([32, 37, 38, 39, 40].includes(event.keyCode)
        && frameMoveTimeStamp === 0
        && banknoteSwitchTimeStamp === 0) {
      isKeyDown = true;
      currentKey = event.keyCode;
    }
  }


  /* Interface */

  return {
    start: () => {
      updateScore();
      updateTime();
      startTimer();
      $text.classList.remove('c'); // TODO: remove
      $text.classList.add('t');
      g.addEventListener('keydown', keyDownHandler, false);
      animationFrame = window.requestAnimationFrame(draw);
    }
  };

}();

gGreg.start();
