<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;

class QcmController extends Controller
{
    /** GET /api/qcm/questions — 12 random for quiz */
    public function random(Request $request)
    {
        $categorie = $request->query('categorie', 'code_route');
        $limit     = min((int) $request->query('limit', 12), 40);
        $questions = Question::where('categorie', $categorie)
            ->inRandomOrder()->limit($limit)
            ->get(['id', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'explication']);
        return response()->json($questions);
    }

    /** GET /api/qcm/all — all questions (admin) */
    public function index()
    {
        return response()->json(Question::orderBy('id', 'desc')->get());
    }

    /** POST /api/qcm — create question */
    public function store(Request $request)
    {
        $v = $request->validate([
            'question'       => 'required|string',
            'option_a'       => 'required|string|max:300',
            'option_b'       => 'required|string|max:300',
            'option_c'       => 'required|string|max:300',
            'option_d'       => 'required|string|max:300',
            'correct_answer' => 'required|in:a,b,c,d',
            'explication'    => 'nullable|string',
            'categorie'      => 'sometimes|string',
        ]);
        $q = Question::create($v);
        return response()->json(['message' => 'Question créée', 'data' => $q], 201);
    }

    /** PUT /api/qcm/{id} — update question */
    public function update(Request $request, $id)
    {
        $q = Question::findOrFail($id);
        $v = $request->validate([
            'question'       => 'sometimes|string',
            'option_a'       => 'sometimes|string|max:300',
            'option_b'       => 'sometimes|string|max:300',
            'option_c'       => 'sometimes|string|max:300',
            'option_d'       => 'sometimes|string|max:300',
            'correct_answer' => 'sometimes|in:a,b,c,d',
            'explication'    => 'nullable|string',
            'categorie'      => 'sometimes|string',
        ]);
        $q->update($v);
        return response()->json(['message' => 'Question mise à jour', 'data' => $q]);
    }

    /** DELETE /api/qcm/{id} */
    public function destroy($id)
    {
        Question::findOrFail($id)->delete();
        return response()->json(['message' => 'Question supprimée']);
    }
}
