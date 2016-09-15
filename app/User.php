<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Zizaco\Entrust\Traits\EntrustUserTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Role;
use App\StudentLevel;
use Carbon\Carbon;

class User extends Authenticatable
{
    use SoftDeletes, EntrustUserTrait {
        SoftDeletes::restore insteadof EntrustUserTrait;
        EntrustUserTrait::restore insteadof SoftDeletes;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username',
        'firstName',
        'lastName',
        'phone',
        'email',
        'facebookLink',
        'linkedinLink',
        'actualJobInfo',
        'school',
        'faculty',
        'studyProgram',
        'studyYear',
        'state',
        'iban',
        'nexteriaTeamRole',
    ];

    protected $dates = ['deleted_at'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public static function createNew($attributes = [])
    {
        $user = User::create($attributes);
        $user->save();

        $user->personalDescription = clean($attributes['personalDescription']);
        $user->buddyDescription = clean($attributes['buddyDescription']);
        $user->guideDescription = clean($attributes['guideDescription']);
        $user->lectorDescription = clean($attributes['lectorDescription']);
        $user->variableSymbol = Carbon::now()->format("Ym").$user->id;

        if ($attributes['newPassword'] === $attributes['confirmationPassword']) {
          $user->password = \Hash::make($attributes['newPassword']);
        }
        
        if ($attributes['profilePicture']) {
            $user->profilePictureId = $attributes['profilePicture']->id;
        }
        
        if ($attributes['studentLevelId']) {
          $user->studentLevelId = StudentLevel::findOrFail($attributes['studentLevelId'])->id;
        }

        $user->roles()->sync(Role::whereIn('id', $attributes['roles'])->lists('id')->toArray());

        $user->save();
        return $user;
    }

    public function updateData($attributes = [])
    {
        $this->fill($attributes);

        if (isset($attributes['roles'])) {
            $this->roles()->sync(Role::whereIn('id', $attributes['roles'])->lists('id')->toArray());
        }

        if ($attributes['studentLevelId']) {
          $this->studentLevelId = StudentLevel::findOrFail($attributes['studentLevelId'])->id;
        }

        if (isset($attributes['personalDescription'])) {
            $this->personalDescription = clean($attributes['personalDescription']);
        }

        if (isset($attributes['buddyDescription'])) {
            $this->buddyDescription = clean($attributes['buddyDescription']);
        }

        if (isset($attributes['guideDescription'])) {
            $this->guideDescription = clean($attributes['guideDescription']);
        }

        if (isset($attributes['lectorDescription'])) {
            $this->lectorDescription = clean($attributes['lectorDescription']);
        }

        if (isset($attributes['confirmedPrivacyPolicy'])) {
            $this->confirmedPrivacyPolicy = $attributes['confirmedPrivacyPolicy'];
        }

        if (isset($attributes['confirmedMarketingUse'])) {
            $this->confirmedMarketingUse = $attributes['confirmedMarketingUse'];
        }

        if (isset($attributes['photo'])) {
          // TODO upload photos
        }

        $this->save();
    }

    public function roles()
    {
        return $this->belongsToMany('App\Role');
    }

    public function profilePicture()
    {
        return $this->hasOne('App\Image', 'profilePictureId');
    }

    public function studentLevel()
    {
        return $this->hasOne('App\StudentLevel', 'studentLevelId');
    }

    public function payments()
    {
        return $this->hasMany('App\Payment', 'userId');
    }

    public function hostedEvents()
    {
        return $this->hasMany('App\NxEvent', 'hostId');
    }
}
