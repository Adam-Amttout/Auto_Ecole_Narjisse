<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QcmController extends Controller
{
    /**
     * GET /api/qcm/questions?categorie=code_route&limit=12
     * Returns random questions WITH correct_answer for client-side scoring.
     */
    public function random(Request $request)
    {
        $categorie = $request->query('categorie', 'code_route');
        $limit     = min((int) $request->query('limit', 12), 40);

        $questions = Question::where('categorie', $categorie)
            ->inRandomOrder()
            ->limit($limit)
            ->get(['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'explication']);

        return response()->json($questions);
    }
}
