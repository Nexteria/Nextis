<?php
namespace App\Transformers;

use Auth;
use App\Transformers\RoleTransformer;

class UserTransformer extends Transformer
{
    public function transform($user, $fields = [])
    {
        $transformer = new RoleTransformer();
        $roles = $transformer->transformCollection($user->roles);

        $result = [
            'id' => (int) $user->id,
            'firstName' => $user->firstName,
            'username' => $user->username,
            'lastName' => $user->lastName,
            'email' => $user->email,
            'phone' => $user->phone,
            'tuitionFeeVariableSymbol' => $user->student ? $user->student->tuitionFeeVariableSymbol : null,
            'facebookLink' => $user->facebookLink,
            'linkedinLink' => $user->linkedinLink,
            'personalDescription' => $user->personalDescription ? $user->personalDescription : '',
            'photo' => $user->photo,
            'actualJobInfo' => $user->actualJobInfo,
            'school' => $user->school,
            'faculty' => $user->faculty,
            'studyProgram' => $user->studyProgram,
            'studyYear' => $user->studyYear,
            'roles' => $roles,
            'guideDescription' => $user->guideDescription ? $user->guideDescription : '',
            'lectorDescription' => $user->lectorDescription ? $user->lectorDescription : '',
            'buddyDescription' => $user->buddyDescription ? $user->buddyDescription : '',
            'state' => $user->state,
            'iban' => $user->iban,
            'nexteriaTeamRole' => $user->nexteriaTeamRole,
            'hostedEvents' => array_map('intval', $user->hostedEvents()->pluck('id')->toArray()),
            'created_at' => $user->created_at ? $user->created_at->__toString() : null,
            'updated_at' => $user->updated_at ? $user->updated_at->__toString() : null,
            'confirmedPrivacyPolicy' => $user->confirmedPrivacyPolicy,
            'confirmedMarketingUse' => $user->confirmedMarketingUse,
        ];

        return $result;
    }
}
