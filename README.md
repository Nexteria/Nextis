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