/* eslint-disable no-console */
import fs from 'fs';
import proc from 'child_process';
import path from 'path';


const isMjml = fileName =>
  path.extname(fileName) === '.mjml';

console.log('Compiling mjml templates:');

fs.readdirSync('../resources/views/emails/events/mjml')
  .filter(isMjml)
  .forEach(fileName => {
    const name = fileName.split('.')[0];
    console.log(fileName);
    const input = `../resources/views/emails/events/mjml/${fileName}`;
    const output = `../resources/views/emails/events/${name}.blade.php`;
    proc.execSync(`node_modules/.bin/mjml -r ${input} -o ${output}`);
    proc.execSync(`sed -i 's/\&\#36\;/\$/g' ${output}`);
  });

fs.readdirSync('../resources/views/emails/guides/mjml')
  .filter(isMjml)
  .forEach(fileName => {
    const name = fileName.split('.')[0];
    console.log(fileName);
    const input = `../resources/views/emails/guides/mjml/${fileName}`;
    const output = `../resources/views/emails/guides/${name}.blade.php`;
    proc.execSync(`node_modules/.bin/mjml -r ${input} -o ${output}`);
    proc.execSync(`sed -i 's/\&\#36\;/\$/g' ${output}`);
  });

fs.readdirSync('../resources/views/emails/auth/mjml')
  .filter(isMjml)
  .forEach(fileName => {
    const name = fileName.split('.')[0];
    console.log(fileName);
    const input = `../resources/views/emails/auth/mjml/${fileName}`;
    const output = `../resources/views/emails/auth/${name}.blade.php`;
    proc.execSync(`node_modules/.bin/mjml -r ${input} -o ${output}`);
    proc.execSync(`sed -i 's/\&\#36\;/\$/g' ${output}`);
  });
