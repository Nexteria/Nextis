#Laravel

     cp .env.example .env
     composer install
     php artisan key:generate
     php artisan migrate

     sudo chmod -R 777 storage/
     sudo chmod -R 777 bootstrap/cache/

# React

use node >= 6

     cp frontend/src/common/config.js.example frontend/src/common/config.js
     cd frontend
     npm install

For development run:

     gulp // or ./node_modules/.bin/gulp

     php artisan serve //or setup apache or nginx

For production run:

     gulp -p

#Contribution

Make sure, that you code will comply with code style.
To ensure you can use this command (which will lint all PHP and JS code - excluding 3rd parties libs):

        gulp codestyle

it takes multiple parameters:

**--lastCommit**

this will check only files modified in last commit

**--masterDiff**

this will check files which are changed in diff between actual branch and master

**--php**

this will check only PHP files

**--js**

this will check only js files

**--files="your_list_of_comma_separated_files"**

this will check only provided files, use it with --php or --js otherwise it will run both linters on the files