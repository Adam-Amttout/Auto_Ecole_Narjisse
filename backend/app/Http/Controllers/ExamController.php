<?php

namespace App\Http\Controllers;

use App\Models\ExamResult;
use App\Models\Question;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    /**
     * GET /api/exam/questions
     * Returns 40 random questions distributed across all categories
     */
    public function questions(Request $request)
    {
        $categories = ['danger', 'indication', 'interdiction', 'code_route', 'conduite', 'autre'];
        $perCat = 6; // ~6 per category = 36, +4 extra from any
        $questions = collect();

        // Get ~6 per category
        foreach ($categories as $cat) {
            $q = Question::where('categorie', $cat)->inRandomOrder()->limit($perCat)->get();
            $questions = $questions->merge($q);
        }

        // If less than 40, fill with random from any category
        if ($questions->count() < 40) {
            $existingIds = $questions->pluck('id');
            $extra = Question::whereNotIn('id', $existingIds)
                ->inRandomOrder()
                ->limit(40 - $questions->count())
                ->get();
            $questions = $questions->merge($extra);
        }

        // Shuffle and limit to 40
        return response()->json($questions->shuffle()->take(40)->values());
    }

    /**
     * POST /api/exam/results
     * Save exam result for a client
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id'          => 'required|integer',
            'score'              => 'required|integer',
            'total'              => 'required|integer',
            'duree_secondes'     => 'nullable|integer',
            'reussi'             => 'required|boolean',
            'detail_categories'  => 'nullable|array',
        ]);

        $result = ExamResult::create($data);
        return response()->json($result, 201);
    }

    /**
     * GET /api/exam/results?client_id=X
     * Get exam history for a client
     */
    public function history(Request $request)
    {
        $clientId = $request->query('client_id');
        if (!$clientId) return response()->json([], 200);

        $results = ExamResult::where('client_id', $clientId)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json($results);
    }

    /**
     * GET /api/exam/stats?client_id=X
     * Get stats: best score, average, total exams, category breakdown
     */
    public function stats(Request $request)
    {
        $clientId = $request->query('client_id');
        if (!$clientId) return response()->json([]);

        $results = ExamResult::where('client_id', $clientId)->get();
        if ($results->isEmpty()) return response()->json([
            'total_exams' => 0, 'best_score' => 0, 'avg_score' => 0,
            'reussis' => 0, 'category_avg' => []
        ]);

        // Per-category averages
        $catStats = [];
        foreach ($results as $r) {
            if (!$r->detail_categories) continue;
            foreach ($r->detail_categories as $cat => $data) {
                if (!isset($catStats[$cat])) $catStats[$cat] = ['total_score' => 0, 'total_questions' => 0, 'count' => 0];
                $catStats[$cat]['total_score']     += $data['score'] ?? 0;
                $catStats[$cat]['total_questions']  += $data['total'] ?? 0;
                $catStats[$cat]['count']++;
            }
        }
        $categoryAvg = [];
        foreach ($catStats as $cat => $s) {
            $categoryAvg[$cat] = $s['total_questions'] > 0
                ? round(($s['total_score'] / $s['total_questions']) * 100, 1)
                : 0;
        }

        return response()->json([
            'total_exams' => $results->count(),
            'best_score'  => $results->max('score'),
            'avg_score'   => round($results->avg('score'), 1),
            'reussis'     => $results->where('reussi', true)->count(),
            'category_avg' => $categoryAvg,
        ]);
    }
}
