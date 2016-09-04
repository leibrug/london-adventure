sT(() => {
	queueText(0);
	queueText(1);
	unqueueText();
}, 1000);

var skyElem = getImg('img/02_intro/sky.png');
var panoramaElem = getImg('img/02_intro/panorama.gif');
var logoElem = getImg('img/02_intro/logo.png');

var cloudElems = [
	getImg('img/02_intro/cloud1.png'),
	getImg('img/02_intro/cloud2.png'),
	getImg('img/02_intro/cloud3.png')
];
var cloudsAmount = M.ceil(R()*3)+2;
var logoOrder = M.floor(R()*cloudsAmount);
var overSky = [];
function Cloud() {
	this.img = cloudElems[M.floor(R()*3)];
	this.dir = ['W', 'E'][M.floor(R()*2)];
	this.speed = R()+1; // TODO better randomization using while and compare to previous?
	this.x = (this.dir === 'W') ? 320 : this.img.width * -1;
	this.y = 90 + M.ceil(R()*50);
}
for (var i = 0; i <= cloudsAmount; i++) {
	if (i === logoOrder) {
		overSky.push(null);
	}
	else {
		overSky.push(new Cloud());
	}
}
function cloudPosition(i, tS) {
	var cloud = overSky[i];
	if ((cloud.dir === 'W' && cloud.x < cloud.img.width * -1)
		|| (cloud.dir === 'E' && cloud.x > 320)) {
		overSky[i] = new Cloud();	
	}
	else {
		cloud.x = cloud.x + ((tS - oldTs)/50 * cloud.speed) * (cloud.dir === 'W' ? -1 : 1);
	}
}

var isStartShowed = false;
var startPressedTime;

var oldTs = 0;

function introFrame(tS) {
	
	// Sky
	var skyOffset = M.max(tS/-16.7, -480);
	c.drawImage(skyElem, 0, skyOffset, 320, 720);

	// Black overlay
	if (tS <= 2500) {
		var blackOpacity = M.min((2500 - tS) / 2000, 1);		
		c.fillStyle = 'rgba(0, 0, 0, ' + blackOpacity + ')';
		c.fillRect(0, 0, 320, 240);
	}
	
	// Panorama
	if (tS > 5000) {
		var panoramaOffset = M.max(240-(tS-5000)/37.5, 160)
		c.drawImage(panoramaElem, 0, panoramaOffset);
	}
	
	// Logo and clouds
	if (tS > 8250) {
		for (var i = 0; i <= cloudsAmount; i++) {
			if (i === logoOrder) {
				c.drawImage(logoElem, 70, 15);				
			}
			else {
				var cloud = overSky[i];
				c.drawImage(cloud.img, cloud.x, cloud.y);
				cloudPosition(i, tS);
			}
		}
	}
	
	// Start text
	if (tS > 9000 && !isStartShowed) {
		queueText(2, ['p', 'b', 'o']);
		unqueueText();
		g.addEventListener('keydown', keyHandler, false);
		isStartShowed = true;
	}
	
	// Fade out
	if (startPressedTime) {
		var blackOpacity = M.min((tS - startPressedTime) / 1000, 1); // TODO: 500ms delay
		c.fillStyle = 'rgba(0, 0, 0, ' + blackOpacity + ')';
		c.fillRect(0, 0, 320, 240);
	}
	
	oldTs = tS;
	rAf(introFrame);
}

function keyHandler(e) {
	console.log(e);
	if (e.keyCode === 32) {
		startPressedTime = performance.now();
		p.classList.add('q');
		hideText(); // TODO: 500ms delay
		g.removeEventListener('keydown', keyHandler, false);
		sT(endIntro, 1000); // TODO: 500ms delay
	}
}

function endIntro() { return; }

var introReq = rAf(introFrame);
