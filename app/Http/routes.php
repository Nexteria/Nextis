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

Route::auth();

Route::post('/payments', 'PaymentsController@processPayment');

Route::group(['middleware' => 'auth'], function () {
    Route::group(['prefix' => '/api'], function () {
        Route::post('/usernames', 'UsersController@checkUsernameAvailability');
        Route::post('/emails', 'UsersController@checkEmailAvailability');

        Route::get('/levels', 'LevelsController@getLevels');
        Route::get('/permissions', 'PermissionsController@getPermissions');

        Route::get('payments/unassociated', 'PaymentsController@getUnassociatedPayments');
        Route::put('payments/{paymentId}', 'PaymentsController@updatePayment');

        Route::get('/roles', 'RolesController@getRoles');
        Route::post('/roles', ['middleware' => ['permission:create_roles'], 'uses' => 'RolesController@createRole']);
        Route::put('/roles/{roleId}', ['middleware' => ['permission:update_roles'], 'uses' => 'RolesController@updateRole']);
        Route::delete('/roles/{roleId}', ['middleware' => ['permission:delete_roles'], 'uses' => 'RolesController@deleteRole']);
        
        Route::put('/nxEvents/{eventId}/users/{userId}', 'NxEventAttendeesController@updateAttendee');
        Route::get('/nxEvents', 'NxEventsController@getNxEvents');
        Route::post('/nxEvents', ['middleware' => ['permission:create_events'], 'uses' => 'NxEventsController@createNxEvent']);
        Route::put('/nxEvents/{eventId}', ['middleware' => ['permission:update_events'], 'uses' => 'NxEventsController@updateNxEvent']);
        Route::delete('/nxEvents/{eventId}', ['middleware' => ['permission:delete_events'], 'uses' => 'NxEventsController@deleteNxEvent'])
          ->where(array('groupId' => '[0-9]+'));

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
        Route::post('/users', 'UsersController@createUser');
        Route::put('/users', 'UsersController@updateUser');
        Route::put('/users/me/privacyPolicy', 'UsersController@confirmPrivacyPolicy');
        
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
