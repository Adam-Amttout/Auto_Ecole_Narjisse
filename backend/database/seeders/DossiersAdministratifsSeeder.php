<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DossiersAdministratifsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $clientIds = DB::table('clients')->where('role', 'user')->pluck('id')->toArray();

        if (empty($clientIds)) {
            $this->command->warn('  ⚠️ Pas de clients, dossiers non insérés.');
            return;
        }

        $notesAdmin = [
            'Dossier complet, prêt pour l\'examen.',
            'En attente de la visite médicale.',
            'Photos d\'identité manquantes.',
            'Dossier validé par l\'administration.',
            null,
            'Certificat médical expiré, à renouveler.',
            'Tout est en ordre.',
            'En attente du dépôt physique du dossier.',
        ];

        // Dossiers administratifs pour chaque client
        foreach ($clientIds as $i => $clientId) {
            $progress = $i / count($clientIds); // Plus le client est ancien, plus il est avancé

            DB::table('dossiers_administratifs')->updateOrInsert(
                ['client_id' => $clientId],
                [
                    'visite_medicale'         => $progress > 0.2 ? true : (bool)rand(0, 1),
                    'dossier_depose'          => $progress > 0.3 ? true : (bool)rand(0, 1),
                    'exam_theorique_programme' => $progress > 0.5 ? true : (bool)rand(0, 1),
                    'exam_pratique_programme'  => $progress > 0.7 ? true : (bool)rand(0, 1),
                    'permis_pret'             => $progress > 0.9 ? true : false,
                    'notes_admin'             => $notesAdmin[array_rand($notesAdmin)],
                    'created_at'              => $now->copy()->subDays(rand(10, 90)),
                    'updated_at'              => $now,
                ]
            );
        }

        // Documents pour les clients
        $types    = ['cin', 'photo', 'certificat_medical', 'autre'];
        $statuts  = ['en_attente', 'valide', 'rejete'];
        $docNames = [
            'cin'                => ['CIN_recto.pdf', 'CIN_verso.pdf'],
            'photo'              => ['photo_identite.jpg', 'photo_passeport.jpg'],
            'certificat_medical' => ['certificat_medical.pdf'],
            'autre'              => ['attestation_residence.pdf', 'quittance.pdf'],
        ];

        $inserted = 0;
        foreach ($clientIds as $clientId) {
            // Chaque client a 2 à 4 documents
            $nbDocs = rand(2, 4);
            $selectedTypes = array_rand(array_flip($types), min($nbDocs, count($types)));
            if (!is_array($selectedTypes)) $selectedTypes = [$selectedTypes];

            foreach ($selectedTypes as $type) {
                $fileName = $docNames[$type][array_rand($docNames[$type])];
                $statut = $statuts[array_rand($statuts)];

                DB::table('documents_dossier')->insert([
                    'client_id'    => $clientId,
                    'type'         => $type,
                    'nom_fichier'  => $fileName,
                    'chemin'       => "documents/{$clientId}/{$fileName}",
                    'statut'       => $statut,
                    'remarque'     => $statut === 'rejete' ? 'Document illisible, veuillez renvoyer une copie claire.' : null,
                    'created_at'   => $now->copy()->subDays(rand(5, 60)),
                    'updated_at'   => $now,
                ]);
                $inserted++;
            }
        }

        $this->command->info("  ✅ " . count($clientIds) . " dossiers administratifs + {$inserted} documents insérés");
    }
}
