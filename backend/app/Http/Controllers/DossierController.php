<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DossierAdministratif;
use App\Models\DocumentDossier;
use App\Models\Client;
use Illuminate\Support\Facades\Storage;

class DossierController extends Controller
{
    // ── GET dossier du client (ou crée un vide) ──
    public function show($clientId)
    {
        $dossier = DossierAdministratif::firstOrCreate(
            ['client_id' => $clientId],
            [
                'visite_medicale'          => false,
                'dossier_depose'           => false,
                'exam_theorique_programme' => false,
                'exam_pratique_programme'  => false,
                'permis_pret'              => false,
            ]
        );

        $documents = DocumentDossier::where('client_id', $clientId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'dossier'    => array_merge($dossier->toArray(), ['progression' => $dossier->progression]),
            'documents'  => $documents,
        ]);
    }

    // ── PUT mise à jour des étapes (admin) ──
    public function update(Request $request, $clientId)
    {
        $dossier = DossierAdministratif::firstOrCreate(['client_id' => $clientId]);

        $dossier->update($request->only([
            'visite_medicale',
            'dossier_depose',
            'exam_theorique_programme',
            'exam_pratique_programme',
            'permis_pret',
            'notes_admin',
        ]));

        return response()->json([
            'dossier'    => array_merge($dossier->fresh()->toArray(), ['progression' => $dossier->fresh()->progression]),
            'message'    => 'Dossier mis à jour',
        ]);
    }

    // ── POST upload d'un document ──
    public function uploadDocument(Request $request, $clientId)
    {
        $request->validate([
            'fichier' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120', // 5 MB max
            'type'    => 'required|in:cin,photo,certificat_medical,autre',
        ]);

        $type       = $request->input('type');
        $file       = $request->file('fichier');
        $extension  = $file->getClientOriginalExtension();
        $nomFichier = $type . '_' . $clientId . '_' . time() . '.' . $extension;

        // Stocker dans storage/app/public/dossiers/{clientId}/
        $chemin = $file->storeAs("dossiers/{$clientId}", $nomFichier, 'public');

        // Remplacer l'ancien document du même type s'il existe
        $ancien = DocumentDossier::where('client_id', $clientId)->where('type', $type)->first();
        if ($ancien) {
            Storage::disk('public')->delete($ancien->chemin);
            $ancien->delete();
        }

        $doc = DocumentDossier::create([
            'client_id'   => $clientId,
            'type'        => $type,
            'nom_fichier' => $nomFichier,
            'chemin'      => $chemin,
            'statut'      => 'en_attente',
        ]);

        return response()->json($doc, 201);
    }

    // ── DELETE supprimer un document ──
    public function deleteDocument($docId)
    {
        $doc = DocumentDossier::findOrFail($docId);
        Storage::disk('public')->delete($doc->chemin);
        $doc->delete();
        return response()->json(['message' => 'Document supprimé']);
    }

    // ── PATCH valider/rejeter un document (admin) ──
    public function updateDocumentStatut(Request $request, $docId)
    {
        $doc = DocumentDossier::findOrFail($docId);
        $doc->update([
            'statut'   => $request->input('statut'),   // valide | rejete
            'remarque' => $request->input('remarque'),
        ]);
        return response()->json($doc->fresh());
    }

    // ── GET liste tous les dossiers (admin) ──
    // Auto-crée un dossier pour chaque client s'il n'en a pas encore
    public function index()
    {
        // Récupère tous les clients (sauf admins)
        $clients = Client::where('role', '!=', 'admin')->get();

        foreach ($clients as $client) {
            DossierAdministratif::firstOrCreate(
                ['client_id' => $client->id],
                [
                    'visite_medicale'          => false,
                    'dossier_depose'           => false,
                    'exam_theorique_programme' => false,
                    'exam_pratique_programme'  => false,
                    'permis_pret'              => false,
                ]
            );
        }

        // Retourne tous les dossiers avec le client associé
        $dossiers = DossierAdministratif::with('client')
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn($d) => array_merge($d->toArray(), [
                'progression' => $d->progression,
                'client'      => $d->client ? [
                    'id'     => $d->client->id,
                    'prenom' => $d->client->prenom,
                    'nom'    => $d->client->nom,
                    'email'  => $d->client->email,
                ] : null,
            ]));

        return response()->json($dossiers);
    }
}
