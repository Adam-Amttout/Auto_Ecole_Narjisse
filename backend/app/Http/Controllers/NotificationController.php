<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * GET /api/notifications
     * - إذا جا client_id → يرجع الإشعارات الخاصة بهذا الكليان + الإشعارات العامة
     * - بلا client_id → يرجع كل الإشعارات (للأدمين)
     */
    public function index(Request $request)
    {
        if ($request->has('client_id')) {
            $clientId = $request->client_id;
            $notifs = Notification::where(function ($q) use ($clientId) {
                    $q->where('client_id', $clientId)   // إشعارات خاصة لهذا الكليان
                      ->orWhereNull('client_id');         // + الإشعارات العامة
                })
                ->orderBy('created_at', 'desc')
                ->limit(30)
                ->get();
        } else {
            $notifs = Notification::orderBy('created_at', 'desc')->limit(50)->get();
        }

        return response()->json($notifs)->header('Cache-Control', 'no-store');
    }

    /** POST /api/notifications (admin only) */
    public function store(Request $request)
    {
        $v = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'type'      => 'required|string',
            'titre'     => 'required|string|max:200',
            'message'   => 'required|string|max:500',
            'icon'      => 'nullable|string',
            'color'     => 'nullable|string',
        ]);

        $notif = Notification::create($v);
        return response()->json($notif, 201);
    }

    /** PATCH /api/notifications/{id}/lire — le client marque une notif comme lue */
    public function marquerLu($id)
    {
        $notif = Notification::findOrFail($id);
        $notif->update(['lu' => true]);
        return response()->json(['message' => 'Notification marquée comme lue.', 'data' => $notif]);
    }

    /** PATCH /api/notifications/lire-tout — marquer toutes les notifs d'un client comme lues */
    public function marquerToutLu(Request $request)
    {
        $request->validate(['client_id' => 'required|exists:clients,id']);
        Notification::where(function ($q) use ($request) {
                $q->where('client_id', $request->client_id)->orWhereNull('client_id');
            })
            ->where('lu', false)
            ->update(['lu' => true]);
        return response()->json(['message' => 'Toutes les notifications marquées comme lues.']);
    }

    /** DELETE /api/notifications/{id} */
    public function destroy($id)
    {
        Notification::findOrFail($id)->delete();
        return response()->json(['message' => 'Notification supprimée.']);
    }
}
