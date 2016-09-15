<?php namespace App\Transformers;

use App\Transformers\RoleTransformer;

class UserTransformer extends Transformer
{
    public function transform($user)
    {
        $transformer = new RoleTransformer();
        $roles = $transformer->transformCollection($user->roles);

        return [
            'id' => (int) $user->id,
            'firstName' => $user->firstName,
            'username' => $user->username,
            'lastName' => $user->lastName,
            'email' => $user->email,
            'phone' => $user->phone,
            'variableSymbol' => $user->variableSymbol,
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
            'activityPoints' => $user->activityPoints,
            'guideDescription' => $user->guideDescription ? $user->guideDescription : '',
            'lectorDescription' => $user->lectorDescription ? $user->lectorDescription : '',
            'buddyDescription' => $user->buddyDescription ? $user->buddyDescription : '',
            'state' => $user->state,
            'iban' => $user->iban,
            'nexteriaTeamRole' => $user->nexteriaTeamRole,
            'studentLevelId' => (int) $user->studentLevelId,
            'hostedEvents' => array_map('intval', $user->hostedEvents()->lists('id')->toArray()),
            'created_at' => $user->created_at ? $user->created_at->__toString() : null,
            'updated_at' => $user->updated_at ? $user->updated_at->__toString() : null,
            'confirmedPrivacyPolicy' => $user->confirmedPrivacyPolicy,
            'confirmedMarketingUse' => $user->confirmedMarketingUse,
         ];
    }
}
