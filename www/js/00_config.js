/* Globals */

var M = Math;
var R = M.random;

var sT = setTimeout;
var sI = setInterval;

var rAf = window.requestAnimationFrame;


/* Canvas */

var g = document.getElementById('game');
var c = g.getContext('2d');

// TODO: enable?
c.webkitImageSmoothingEnabled = false;
c.mozImageSmoothingEnabled = false;
c.imageSmoothingEnabled = false;

c.fillRect(0, 0, 320, 240);


/**/

function getImg(path) {
	var img = document.createElement('img');
	img.src = path;
	return img;
}

g.focus();
