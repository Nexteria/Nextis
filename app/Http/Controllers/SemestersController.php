<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Semester;

class SemestersController extends Controller
{
    /**
     * @var \App\Transformers\SemesterTransformer
     */
    protected $semesterTransformer;

    public function __construct(\App\Transformers\SemesterTransformer $semesterTransformer)
    {
        $this->semesterTransformer = $semesterTransformer;
    }

    public function getSemesters($id = null)
    {
        $semesters = $id ? Semester::find($id) : Semester::all();

        return response()->json([
          'semesters' => $this->semesterTransformer->transformCollection($semesters),
          'activeSemesterId' => (int) \App\DefaultSystemSettings::get('activeSemesterId'),
        ]);
    }
}
