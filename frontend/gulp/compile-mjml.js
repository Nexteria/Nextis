/* eslint-disable no-console */
import fs from 'fs';
import proc from 'child_process';
import path from 'path';
import gulp from 'gulp';

gulp.task('compile-mjml', () => {
  const isMjml = fileName =>
    path.extname(fileName) === '.mjml';

  console.log('Compiling mjml templates:');

  return fs.readdirSync('../resources/views/emails/events/mjml')
    .filter(isMjml)
    .forEach(fileName => {
      const name = fileName.split('.')[0];
      console.log(fileName);
      const input = `../resources/views/emails/events/mjml/${fileName}`;
      const output = `../resources/views/emails/events/${name}.blade.php`;
      proc.execSync(`node_modules/.bin/mjml -r ${input} -o ${output}`);
      proc.execSync(`sed -i 's/\&\#36\;/\$/g' ${output}`);
    });
});
