<?php namespace App\Transformers;

class StudentTransformer extends Transformer
{

    public function transform($student)
    {
        $activeSemesterId = \App\DefaultSystemSettings::get('activeSemesterId');
        $semester = $student->semesters()->where('semesterId', $activeSemesterId)->first();

        return [
          'id' => (int) $student->id,
          'tuitionFeeVariableSymbol' => $student->tuitionFeeVariableSymbol,
          'studentLevelId' => (int) $student->studentLevelId,
          'status' => $student->status,
          'userId' => (int) $student->userId,
          'tuitionFee' => $semester ? $semester->pivot->tuitionFee : 0,
          'activityPointsBaseNumber' => $semester ? $semester->pivot->activityPointsBaseNumber : 0,
          'guideId' => $semester ? $semester->pivot->guideId : null,
          'guidesOptions' => $student->guidesOptions,
          'minimumSemesterActivityPoints' => $semester ? $semester->pivot->minimumSemesterActivityPoints : 0,
        ];
    }
}
