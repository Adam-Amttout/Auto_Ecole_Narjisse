<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /** GET /api/notifications — 15 dernières notifs */
    public function index()
    {
        $notifs = Notification::orderBy('created_at', 'desc')
            ->limit(15)
            ->get();

        return response()->json($notifs)
            ->header('Cache-Control', 'no-store');
    }

    /** POST /api/notifications (admin only — usage interne) */
    public function store(Request $request)
    {
        $v = $request->validate([
            'type'    => 'required|string',
            'titre'   => 'required|string|max:200',
            'message' => 'required|string|max:500',
            'icon'    => 'nullable|string',
            'color'   => 'nullable|string',
        ]);

        $notif = Notification::create($v);
        return response()->json($notif, 201);
    }

    /** DELETE /api/notifications/{id} (admin) */
    public function destroy($id)
    {
        Notification::findOrFail($id)->delete();
        return response()->json(['message' => 'Notification supprimée']);
    }
}
