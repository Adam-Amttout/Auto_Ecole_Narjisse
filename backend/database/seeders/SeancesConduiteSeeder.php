<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SeancesConduiteSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $clientIds   = DB::table('clients')->where('role', 'user')->pluck('id')->toArray();
        $moniteurIds = DB::table('moniteurs')->where('actif', true)->pluck('id')->toArray();
        $vehiculeIds = DB::table('vehicules')->where('disponibilite', 'disponible')->pluck('id')->toArray();

        if (empty($clientIds) || empty($moniteurIds) || empty($vehiculeIds)) {
            $this->command->warn('  ⚠️ Clients, moniteurs ou véhicules manquants, seances non insérées.');
            return;
        }

        $statuts = ['planifiee', 'en_cours', 'terminee', 'annulee'];
        $notes = [
            'Bonne maîtrise du volant.',
            'Doit travailler les rétroviseurs.',
            'Excellent progrès, prêt pour le créneau.',
            'Séance annulée pour cause de pluie.',
            'Travail sur le rond-point, bien assimilé.',
            'Difficulté avec la marche arrière.',
            'Très bonne séance, confiant au volant.',
            'A revoir les priorités à droite.',
            null,
            'Première séance, prise en main du véhicule.',
            'Conduite fluide en ville.',
            'Manœuvres de stationnement à améliorer.',
        ];

        $seances = [];
        for ($i = 0; $i < 25; $i++) {
            $date = $now->copy()->subDays(rand(0, 45))->format('Y-m-d');
            $heureDebut = rand(8, 17);
            $statut = ($date < $now->format('Y-m-d')) ? $statuts[rand(2, 3)] : $statuts[rand(0, 1)];

            $seances[] = [
                'client_id'   => $clientIds[array_rand($clientIds)],
                'moniteur_id' => $moniteurIds[array_rand($moniteurIds)],
                'vehicule_id' => $vehiculeIds[array_rand($vehiculeIds)],
                'date'        => $date,
                'heure_debut' => sprintf('%02d:00:00', $heureDebut),
                'heure_fin'   => sprintf('%02d:00:00', $heureDebut + 1),
                'statut'      => $statut,
                'notes'       => $notes[array_rand($notes)],
                'created_at'  => $now->copy()->subDays(rand(1, 50)),
                'updated_at'  => $now,
            ];
        }

        DB::table('seances_conduite')->insert($seances);
        $this->command->info('  ✅ 25 séances de conduite insérées');
    }
}
