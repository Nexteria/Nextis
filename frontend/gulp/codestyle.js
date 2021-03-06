import gulp from 'gulp';
import runEslint from './support/run-eslint.js';
import args from './support/args';
import proc from 'child_process';
import phpcs from 'gulp-phpcs';

gulp.task('codestyle', () => {
  const noOption = !args.js && !args.php;
  if (args.js || noOption) {
    runEslint(args);
  }

  if (args.php || noOption) {
    let files = ['../app/**/*.php'];

    if (args.files) {
      files = args.files.split(',');
    }

    if (args.lastCommit) {
      files = proc.execSync('git log -m -n 1 --name-only --pretty=format:"" | grep ".php$" | tr \'\\n\' \',\' | sed -e \'s/,$//\'').toString(); // eslint-disable-line max-len
      files = files.split(',');
      files = files.map(file => `../${file}`);
    }

    if (args.masterDiff) {
      files = proc.execSync('git diff --name-only origin/master..$(git rev-parse --abbrev-ref HEAD) | grep ".php$" | tr \'\\n\' \',\' | sed -e \'s/,$//\'').toString(); // eslint-disable-line max-len
      files = files.split(',');
      files = files.map(file => `../${file}`);
    }


    return gulp.src(files)
      .pipe(phpcs({
        bin: '../vendor/bin/phpcs',
        standard: 'PSR2',
        warningSeverity: 0,
      }))
      .pipe(phpcs.reporter('log'));
  }

  return true;
});
