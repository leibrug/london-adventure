var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('gulp-concat');

var jsFiles = [
	'www/js/00_config.js',
	'www/js/01_text.js',
	'www/js/02_intro.js',
	'www/js/03_travel.js',
	'www/js/04_hub.js',
	'www/js/05_gordon',
	'www/js/06_greg.js',
	'www/js/07_janush.js',
	'www/js/08_isa.js',
	'www/js/09_michael.js'
];

gulp.task('watch', function() {
	gulp.watch('www/js/*.js', ['concat']);
});

gulp.task('concat', function() {
	gulp.src(jsFiles)
		.pipe(concat('game.js'))
		.pipe(gulp.dest('www/js/'));
});

gulp.task('default', ['watch']);
