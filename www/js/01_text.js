/* (Sub)titles */

var p = document.getElementById('text');
var $text = p; // TODO: replace all p references with $text

var t = [
/**/	'Leibrug presents',
		'a js13kGames entry',
		'Press [space] to start,<br>control using [space] and [arrows]',
		'',
];

// TODO: set document title with t strings


/* Setting (sub)titles */

var tQ = [];

function hideText() {
	p.classList.add('f');
	sT(() => {
		p.innerHTML = '';
	}, 300);
}

function showText(text, classList = [], duration) {
	var toShow = isNaN(text) ? text : t[text];
	p.innerHTML = toShow;
	sT(() => {
		p.classList.remove('f');
	}, 50);
	classList.forEach((c) => {
		p.classList.add(c);
	});
	p.dataset.duration = duration;
}

p.addEventListener('transitionend', () => {
	var pClasses = p.className.split('');
	if (pClasses.indexOf('f') === -1 && pClasses.indexOf('p') === -1) {
		sT(hideText, 1000);
	}
});

function unqueueText() {
	var text = tQ.shift();
	showText(text.id, text.classList, text.duration);
	if (tQ.length) {
		sT(unqueueText, 2000);
	}
}

function queueText(id, classList, duration) {
	var text = {
		id: id,
		classList: classList || [],
		duration: duration || 0
	};
	tQ.push(text);
}
