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
            'studentLevelId' => $user->student ? $user->student->studentLevelId : null,
            'facebookLink' => $user->facebookLink,
            'studentId' => $user->student ? $user->student->id : null,
            'linkedinLink' => $user->linkedinLink,
            'personalDescription' => $user->personalDescription ? $user->personalDescription : '',
            'profilePicture' => $user->profilePicture,
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
            'hostedEvents' => $user->hostedEventsQuery()->select('nx_events.id as eventId', 'nx_event_terms.id as termId')->get()->toArray(),
            'created_at' => $user->created_at ? $user->created_at->__toString() : null,
            'updated_at' => $user->updated_at ? $user->updated_at->__toString() : null,
            'confirmedPrivacyPolicy' => $user->confirmedPrivacyPolicy,
            'confirmedMarketingUse' => $user->confirmedMarketingUse,
            'dateOfBirth' => $user->dateOfBirth ? $user->dateOfBirth->toDateTimeString() : null,
        ];

        if (in_array('gainedActivityPoints', $fields) || in_array('potentialActivityPoints', $fields)) {
            $activityPoints = $user->computeActivityPoints();
        }

        if (in_array('gainedActivityPoints', $fields)) {
            $result['gainedActivityPoints'] = $activityPoints['sumGainedPoints'];
            if ($user->student) {
                $result['activityPointsBaseNumber'] = $user->student->getActiveSemester()->pivot->activityPointsBaseNumber;
            }
        }

        if (in_array('potentialActivityPoints', $fields)) {
            $result['potentialActivityPoints'] = $activityPoints['sumPotentialPoints'];
        }

        return $result;
    }
}
