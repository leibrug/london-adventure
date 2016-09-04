var gulp = require('gulp');
var watch = require('gulp-watch');
var concat = require('gulp-concat');

var jsFiles = [
	'00_config.js',
	'01_text.js',
	'02_intro.js',
	'03_travel.js',
	'04_hub.js',
	'05_gordon',
	'06_greg.js',
	'07_janush.js',
	'08_isa.js',
	'09_michael.js'
];

gulp.task('default', function() {
	
	watch('js/*.js', function() {
		gulp.src(jsFiles)
			.pipe(concat('game.js'))
			.pipe(gulp.dest('js'));
	});

});
