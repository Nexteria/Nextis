<?php namespace App\Transformers;

class StudentSemesterTransformer extends Transformer
{

    public function transform($semester)
    {
        return [
          'id' => (int) $semester->id,
          'name' => $semester->name,
          'endDate' => $semester->endDate,
          'startDate' => $semester->startDate,
          'activityPointsBaseNumber' => $semester->pivot->activityPointsBaseNumber,
          'minimumSemesterActivityPoints' => $semester->pivot->minimumSemesterActivityPoints,
          'tuitionFee' => $semester->pivot->tuitionFee,
          'studentLevelId' => $semester->pivot->studentLevelId,
        ];
    }
}
