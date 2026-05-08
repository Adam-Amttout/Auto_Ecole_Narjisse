<?php

namespace App\Http\Controllers;

use App\Models\Progression;
use App\Models\Cours;
use Illuminate\Http\Request;

class ProgressionController extends Controller
{
    /**
     * GET /api/progression?client_id=X
     * Returns all cours_ids completed by the client + total/active cours count
     */
    public function index(Request $request)
    {
        $clientId = $request->query('client_id');

        if (!$clientId) {
            return response()->json(['error' => 'client_id requis'], 400);
        }

        $completed = Progression::where('client_id', $clientId)
            ->pluck('cours_id');

        $totalCours = Cours::where('actif', true)->count();

        return response()->json([
            'completed'   => $completed,
            'total'       => $totalCours,
            'count'       => $completed->count(),
            'pourcentage' => $totalCours > 0
                ? round(($completed->count() / $totalCours) * 100)
                : 0,
        ]);
    }

    /**
     * POST /api/progression/toggle
     * Body: { client_id, cours_id }
     * Marks a cours as done or undone (toggle)
     */
    public function toggle(Request $request)
    {
        $data = $request->validate([
            'client_id' => 'required|integer',
            'cours_id'  => 'required|integer|exists:cours,id',
        ]);

        $existing = Progression::where('client_id', $data['client_id'])
            ->where('cours_id', $data['cours_id'])
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['status' => 'removed']);
        }

        Progression::create($data);
        return response()->json(['status' => 'added']);
    }
}
