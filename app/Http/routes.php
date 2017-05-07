<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Auth::routes();

Route::get('/logout', 'Auth\LoginController@logout');
Route::post('/payments', 'PaymentsController@processPayment');

// email event signIn
Route::get('/nxEvents/{signInToken}/signIn', 'NxEventAttendeesController@updateSignInByToken');
Route::get('/nxEvents/{signInToken}/wontGo', 'NxEventAttendeesController@updateWontGoByToken');
Route::post('/nxEvents/{signInToken}/wontGo', 'NxEventAttendeesController@updateWontGoByToken');

Route::group(['middleware' => 'auth'], function () {
    Route::group(['prefix' => '/api'], function () {

        Route::group(['prefix' => '/admin'], function () {
            Route::get('/nxEvents/categories', 'AdminController@getNxEventsCategories');
            Route::put('/nxEvents', 'AdminController@getNxEvents');

            Route::get('/semesters', 'AdminController@getSemesters');
            Route::get('/students', 'AdminController@getStudents');
        });
        
        Route::get('/app/constants', 'HomeController@getConstants');

        Route::get('/paymentsSettings', 'PaymentsController@getGlobalPaymentsSettings');
        Route::post('/paymentsSettings', ['middleware' => ['permission:change_payments_settings'], 'uses' => 'PaymentsController@updateGlobalPaymentsSettings']);

        Route::get('/users/{userId}/paymentsSettings', 'UsersController@getUserPaymentsSettings');
        Route::post('/users/{userId}/paymentsSettings', ['middleware' => ['permission:change_payments_settings'], 'uses' => 'UsersController@updateUserPaymentsSettings']);

        Route::post('/usernames', 'UsersController@checkUsernameAvailability');
        Route::post('/emails', 'UsersController@checkEmailAvailability');

        Route::get('/levels', 'LevelsController@getLevels');
        Route::get('/permissions', 'PermissionsController@getPermissions');

        Route::get('payments/unassociated', 'PaymentsController@getUnassociatedPayments');

        Route::post('/payments', ['middleware' => ['permission:add_payments'], 'uses' => 'PaymentsController@createPayments']);

        Route::put('payments/{paymentId}', 'PaymentsController@updatePayment');
        Route::delete('/users/{userId}/payments', ['middleware' => ['permission:delete_payments'], 'uses' => 'UsersController@deletePayments']);

        Route::get('/roles', 'RolesController@getRoles');
        Route::post('/roles', ['middleware' => ['permission:create_roles'], 'uses' => 'RolesController@createRole']);
        Route::put('/roles/{roleId}', ['middleware' => ['permission:update_roles'], 'uses' => 'RolesController@updateRole']);
        Route::delete('/roles/{roleId}', ['middleware' => ['permission:delete_roles'], 'uses' => 'RolesController@deleteRole']);
        
        Route::post('/nxEvents/feedbackForm/validate', 'NxEventsController@validateFeedbackForm');

        Route::put('/nxEvents/{eventId}/users/{userId}', 'NxEventAttendeesController@updateAttendee');
        Route::get('/nxEvents/{eventId}/settings', 'NxEventsController@getNxEventSettings');
        Route::post('/nxEvents/{eventId}/settings', 'NxEventsController@updateNxEventSettings');
        
        Route::get('/nxEvents/{eventId}/emails', 'NxEventsController@getEmailsStats');

        Route::get('/nxEvents', 'NxEventsController@getNxEvents');
        Route::post('/nxEvents', ['middleware' => ['permission:create_events'], 'uses' => 'NxEventsController@createNxEvent']);
        Route::put('/nxEvents/{eventId}', ['middleware' => ['permission:update_events'], 'uses' => 'NxEventsController@updateNxEvent']);
        Route::delete('/nxEvents/{eventId}', ['middleware' => ['permission:delete_events'], 'uses' => 'NxEventsController@deleteNxEvent'])
          ->where(array('groupId' => '[0-9]+'));
        Route::get('/nxEvents/settings', 'NxEventsController@getDefaultEventsSettings');
        Route::post('/nxEvents/settings', 'NxEventsController@updateDefaultEventsSettings');

        Route::get('/payments/tuitionFeesSummary/download', 'PaymentsController@exportTuitionSumary');
        Route::post('/payments/import', 'PaymentsController@importPayments');

        Route::get('/nxLocations', 'NxLocationsController@getNxLocations');
        Route::post('/nxLocations', 'NxLocationsController@createNxLocation');
        Route::put('/nxLocations/{locationId}', 'NxLocationsController@updateNxLocation');
        Route::delete('/nxLocations/{locationId}', 'NxLocationsController@deleteNxLocation');

        Route::get('/userGroups', 'UserGroupsController@getUserGroup');
        Route::post('/userGroups', 'UserGroupsController@createUserGroup');
        Route::put('/userGroups', 'UserGroupsController@updateUserGroup');
        Route::delete('/userGroups/{groupId}', 'UserGroupsController@deleteUserGroup')
          ->where(array('groupId' => '[0-9]+'));

        Route::get('/users', 'UsersController@getUsers');
        Route::get('/users/{id}', 'UsersController@getUsers')->where(['id' => '[0-9]+|me']);
        Route::get('/users/{userId}/payments', 'UsersController@getUserPayments')->where(['userId' => '[0-9]+']);
        Route::get('/users/payments', 'UsersController@getUsersPayments');
        Route::post('/users', 'UsersController@createUser');
        Route::put('/users', 'UsersController@updateUser');
        Route::put('/users/me/password', 'UsersController@changePassword');
        Route::put('/users/me/privacyPolicy', 'UsersController@confirmPrivacyPolicy');

        Route::get('/semesters', 'SemestersController@getSemesters');
        
        Route::get('/users/{userId}/activityPoints', 'UsersController@getActivityPoints');
        Route::get('/users/{userId}/semesters', 'UsersController@getSemesters');

        Route::delete('/users/{userId}', 'UsersController@deleteUser')
          ->where(array('userId' => '[0-9]+'));
        
        Route::post('/pictures', 'ImagesController@uploadPicture');

        Route::any('{slug?}', function ($slug = null) {
            return response()->json([
              "error" => "Resource not found",
              "code" => 404,
            ], 404);
        })->where('slug', '.*');
    });

    Route::any('{slug?}', function ($slug = null) {
        return view('index');
    })->where('slug', '(?!api).*');
});
