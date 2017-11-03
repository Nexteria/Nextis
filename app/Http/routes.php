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
Route::get('/nxEvents/{signInToken}/signIn', 'NxEventAttendeesController@getSigninFormByToken');
Route::get('/nxEvents/{signInToken}/wontGo', 'NxEventAttendeesController@getSigninFormByToken');
Route::post('/nxEvents/{signInToken}/wontGo', 'NxEventAttendeesController@getSigninFormByToken');

Route::group(['prefix' => '/api'], function () {
    Route::get('/nxEvents/{signInToken}', 'NxEventAttendeesController@getBasicFormData')->where(['signInToken' => '[0-9a-zA-z]{32}']);
    Route::put('/nxEvents/{signInToken}/signIn', 'NxEventAttendeesController@updateSignInByToken');
    Route::put('/nxEvents/{signInToken}/wontGo', 'NxEventAttendeesController@updateWontGoByToken');
    Route::get('/nxEvents/{eventId}/questionnaire', 'NxEventsController@getBeforeEventQuestionnaire');
});

Route::group(['middleware' => 'auth'], function () {
    Route::group(['prefix' => '/api'], function () {

        Route::group(['prefix' => '/admin'], function () {
            Route::get('/nxEvents/categories', 'AdminController@getNxEventsCategories');
            Route::get('/nxEvents/{eventId}/attendees/{type}', 'AdminController@getAttendeesList');
            Route::put('/nxEvents', 'AdminController@getNxEvents');

            Route::get('/questionnaire/{formId}/results', 'AdminController@getFormResults');
            Route::get('/questionnaire/{formId}/answers', 'AdminController@getFormAnswers');

            Route::get('/semesters', 'AdminController@getSemesters');
            Route::post('/semesters', 'AdminController@createSemester');
            Route::post('/semesters/{semesterId}/assign', 'AdminController@assignSemester');

            Route::get('/students', 'AdminController@getStudents');
            Route::post('/students/import', 'AdminController@importNewStudentsFromExcel');
            Route::post('/students/level', 'AdminController@changeStudentLevel');
            Route::post('/students/tuitionFee', 'AdminController@changeTuitionFee');
            Route::post('/students/{studentId}/comments', 'AdminController@createStudentComment');
            Route::post('/students/comments', 'AdminController@createBulkStudentsComment');
            Route::get('/students/{studentId}/comments', 'AdminController@getStudentComments');
            Route::get('/students/endSchoolYear', 'AdminController@endSchoolYear');
            Route::post('/students/profile', 'AdminController@exportStudentProfiles');
            Route::put('/students/points', 'AdminController@changeActivityPoints');
            Route::get('/students/reports/{reportType}', 'AdminController@getStudentsReports');

            Route::post('/comments/{commentId}/comments', 'AdminController@createComment');
            Route::put('/comments/{commentId}', 'AdminController@updateComment');
            Route::delete('/comments/{commentId}', 'AdminController@deleteComment');
            
            Route::get('/templates/imports/newStudents', 'AdminController@getNewStudentsImportTemplate');
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

        Route::get('/nxEvents/settings', 'NxEventsController@getDefaultEventsSettings');
        Route::post('/nxEvents/settings', 'NxEventsController@updateDefaultEventsSettings');

        Route::put('/nxEvents/users/{userId}', 'NxEventAttendeesController@updateAttendee');
        Route::get('/nxEvents/{eventId}/settings', 'NxEventsController@getNxEventSettings');
        Route::post('/nxEvents/{eventId}/settings', 'NxEventsController@updateNxEventSettings');
        
        Route::put('/nxEventTerms/{termId}/attendees/{attendeeId}', 'NxEventAttendeesController@updateTermAttendance');
        Route::put('/nxEvents/{eventId}/attendees/{attendeeId}', 'NxEventAttendeesController@updateEventAttendance');

        Route::get('/nxEvents/{eventId}/emails', 'NxEventsController@getEmailsStats');
        Route::get('/nxEvents/{eventId}/attendees', 'NxEventsController@getEventAttendees');

        Route::get('/nxEvents', 'NxEventsController@getNxEvents');
        Route::post('/nxEvents', ['middleware' => ['permission:create_events'], 'uses' => 'NxEventsController@createNxEvent']);
        Route::put('/nxEvents/{eventId}', ['middleware' => ['permission:update_events'], 'uses' => 'NxEventsController@updateNxEvent']);
        Route::delete('/nxEvents/{eventId}', ['middleware' => ['permission:delete_events'], 'uses' => 'NxEventsController@deleteNxEvent'])
          ->where(array('groupId' => '[0-9]+'));

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
