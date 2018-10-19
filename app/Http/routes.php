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


Route::post('/login', 'Auth\LoginController@login');
Route::post('/logout', 'Auth\LoginController@logout');
Route::post('/payments', 'PaymentsController@processPayment');
Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail');
Route::get('password/reset/{token}', function(){ return view('index'); });
Route::post('password/reset', 'Auth\ResetPasswordController@reset');

// email event signIn
Route::get('/nxEvents/{signInToken}/signIn', function() { return view('index'); });
Route::get('/nxEvents/{signInToken}/wontGo', function() { return view('index'); });
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
            Route::get('/guides', 'AdminController@getGuides');
            Route::get('/guides/fields', 'AdminController@getGuidesFieldTypes');
            

            Route::group(['middleware' => 'role:ADMIN'], function () {
                Route::post('/guides/fields', 'AdminController@createOrUpdateGuidesFieldType');
                Route::put('/guides/fields/{fieldId}', 'AdminController@createOrUpdateGuidesFieldType');
                Route::delete('/guides/fields/{fieldId}', 'AdminController@deleteGuidesFieldType');
                Route::post('/guides/{guideId}', 'AdminController@updateGuides')
                    ->where(array('guideId' => '[0-9]+'));
                Route::post('/guides/import', 'AdminController@importGuides');
                Route::post('/guides', 'AdminController@createGuides');

                Route::get('/questionnaire/{formId}/results', 'AdminController@getFormResults');
                Route::get('/questionnaire/{formId}/answers', 'AdminController@getFormAnswers');

                Route::post('/semesters', 'AdminController@createSemester');
                Route::post('/semesters/{semesterId}/assign', 'AdminController@assignSemester');

                Route::post('/students/import', 'AdminController@importNewStudentsFromExcel');
                Route::post('/students/level', 'AdminController@changeStudentLevel');
                Route::put('/students/status', 'AdminController@changeStudentStatus');
                Route::post('/students/tuitionFee', 'AdminController@changeTuitionFee');
                Route::post('/students/{studentId}/comments', 'AdminController@createStudentComment');
                Route::post('/students/comments', 'AdminController@createBulkStudentsComment');
                Route::get('/students/{studentId}/comments', 'AdminController@getStudentComments');
                Route::put('/students/{studentId}/guides/{guideId}/assign', 'AdminController@assignStudentGuide');
                Route::post('/students/{studentId}/guides/{guideId}', 'AdminController@assignStudentGuideOption');

                Route::delete('/students/{studentId}/guidesOption/{optionId}', 'AdminController@removeStudentGuideOption');
                Route::get('/students/endSchoolYear', 'AdminController@endSchoolYear');
                Route::post('/students/profile', 'AdminController@exportStudentProfiles');
                Route::put('/students/points', 'AdminController@changeActivityPoints');
                Route::put('/students/{studentId}/points', ['middleware' => ['permission:add_activity_points'], 'uses' => 'AdminController@changeStudentActivityPoints']);
                Route::post('/students/points', ['middleware' => ['permission:add_activity_points'], 'uses' => 'AdminController@addActivityPoints']);

                Route::get('/students/reports/{reportType}', 'AdminController@getStudentsReports');
                Route::delete('/students/{studentId}/guides', 'AdminController@removeStudentGuideConnection');

                Route::post('/comments/{commentId}/comments', 'AdminController@createComment');
                Route::put('/comments/{commentId}', 'AdminController@updateComment');
                Route::delete('/comments/{commentId}', 'AdminController@deleteComment');
                
                Route::get('/templates/imports/newStudents', 'AdminController@getNewStudentsImportTemplate');
            });

            Route::get('/nxEvents/categories', 'AdminController@getNxEventsCategories');
            Route::get('/nxEvents/{eventId}/terms/{termId}/attendees/{type}', 'AdminController@getTermAttendeesList');
            Route::get('/nxEvents/{eventId}/terms/attendees/{type}', 'AdminController@getEventAttendeesList');
            Route::put('/nxEvents', 'AdminController@getNxEvents');

            Route::get('/semesters', 'AdminController@getSemesters');
            Route::get('/students', 'AdminController@getStudents');
            Route::get('/students/points/missing', 'AdminController@getStudentsWithMissingActivityPoints');
        });
        
        Route::get('/app/constants', 'HomeController@getConstants');

        Route::get('/contacts', 'UsersController@getContacts');
        Route::get('/terms/{termId}/hostlist', 'NxEventsController@getHostlist');

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

        Route::post('/students/me/guidesOptions/{optionId}', 'StudentsController@updateGuidesOption');
        
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
        Route::get('/nxEvents/list', 'NxEventsController@getNxEventsList');
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
        Route::get('/semesters/{semesterId}/students/{studentId}', 'StudentsController@getSemesterStudent');

        Route::get('/students/{studentId}/activities/events/{eventId}', 'StudentsController@getStudentEventDetails');
        Route::delete('/students/{studentId}/activityPoints/{activityPointsId}', ['middleware' => ['permission:delete_activity_points'], 'uses' => 'StudentsController@deleteActivityPoints']);
        
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

    Route::get('/events/{eventId}/{action?}', function ($eventId = null) {
        return view('index');
    });
});

Route::any('{slug?}', function ($slug = null) {
    return view('index');
});
