import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import proc from 'child_process';

// To fix some eslint issues: gulp eslint --fix
const runEslint = (args) => {
  const isFixed = file => args.fix && file.eslint && file.eslint.fixed;

  let files = [
    'src/**/*.js',
    'gulp/**/*.js',
    'gulpfile.babel.js',
    'messages/*.js',
    'webpack/*.js',
  ];


  if (args.lastCommit) {
    files = proc.execSync('git log -m -n 1 --name-only --pretty=format:"" | grep ".js$" | sed -e :a -e N -e \'s/\\n/,/\' -e \'s/frontend\\///\' -e ta').toString(); // eslint-disable-line max-len
    files = files.split(',');
  }

  if (args.masterDiff) {
    files = proc.execSync('git diff --name-only master..$(git rev-parse --abbrev-ref HEAD) | grep ".js$" | sed -e :a -e N -e \'s/\\n/,/\' -e \'s/frontend\\///\' -e ta').toString(); // eslint-disable-line max-len
    files = files.split(',');
  }

  if (args.files) {
    files = args.files.split(',');
  }

  return gulp.src(files, { base: './' })
    .pipe(eslint({ fix: args.fix }))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest('./')));
};

export default runEslint;
