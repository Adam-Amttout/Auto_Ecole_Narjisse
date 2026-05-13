<?php

namespace App\Http\Controllers;

use App\Models\Progression;
use App\Models\Cours;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

    /**
     * GET /api/progression/by-category?client_id=X
     * Returns per-category stats: total lessons, completed count, and whether fully done.
     */
    public function byCategory(Request $request)
    {
        $clientId = $request->query('client_id');

        if (!$clientId) {
            return response()->json(['error' => 'client_id requis'], 400);
        }

        // All active courses grouped by category
        $totals = Cours::where('actif', true)
            ->select('categorie', DB::raw('count(*) as total'))
            ->groupBy('categorie')
            ->pluck('total', 'categorie');

        // Completed courses for this client, grouped by category
        $completed = DB::table('progression')
            ->join('cours', 'progression.cours_id', '=', 'cours.id')
            ->where('progression.client_id', $clientId)
            ->where('cours.actif', true)
            ->select('cours.categorie', DB::raw('count(*) as done'))
            ->groupBy('cours.categorie')
            ->pluck('done', 'categorie');

        $categories = [];
        foreach ($totals as $cat => $total) {
            $done = $completed[$cat] ?? 0;
            $categories[$cat] = [
                'total'     => (int) $total,
                'done'      => (int) $done,
                'completed' => $done >= $total && $total > 0,
                'pct'       => $total > 0 ? round(($done / $total) * 100) : 0,
            ];
        }

        return response()->json($categories);
    }

    /**
     * GET /api/progression/admin-stats
     * Returns global progression stats for admin dashboard:
     * - per-course: how many unique students completed it
     * - per-client: how many courses completed + percentage
     * - global summary
     */
    public function adminStats()
    {
        // Per-course completion count
        $perCours = DB::table('progression')
            ->select('cours_id', DB::raw('count(distinct client_id) as nb_eleves'))
            ->groupBy('cours_id')
            ->pluck('nb_eleves', 'cours_id');

        // Total active courses
        $totalCours = Cours::where('actif', true)->count();

        // Total unique students who have at least one completed course
        $totalElevesActifs = DB::table('progression')
            ->distinct('client_id')
            ->count('client_id');

        // Total clients
        $totalClients = Client::count();

        // Per-client stats (top students by completions)
        $perClient = DB::table('progression')
            ->join('clients', 'progression.client_id', '=', 'clients.id')
            ->select(
                'clients.id as client_id',
                'clients.prenom',
                'clients.nom',
                'clients.email',
                DB::raw('count(progression.cours_id) as cours_termines')
            )
            ->groupBy('clients.id', 'clients.prenom', 'clients.nom', 'clients.email')
            ->orderByDesc('cours_termines')
            ->limit(10)
            ->get()
            ->map(function ($row) use ($totalCours) {
                $row->pourcentage = $totalCours > 0
                    ? round(($row->cours_termines / $totalCours) * 100)
                    : 0;
                return $row;
            });

        // Global completion rate
        $totalCompletions = DB::table('progression')->count();
        $maxPossible = $totalCours * max($totalClients, 1);
        $tauxGlobal = $maxPossible > 0 ? round(($totalCompletions / $maxPossible) * 100) : 0;

        return response()->json([
            'per_cours'           => $perCours,
            'per_client'          => $perClient,
            'total_cours'         => $totalCours,
            'total_clients'       => $totalClients,
            'eleves_actifs'       => $totalElevesActifs,
            'total_completions'   => $totalCompletions,
            'taux_global'         => $tauxGlobal,
        ]);
    }
}
