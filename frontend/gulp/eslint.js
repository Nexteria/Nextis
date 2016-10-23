import gulp from 'gulp';
import runEslint from './support/run-eslint.js';
import args from './support/args';

gulp.task('eslint', () => runEslint(args));
