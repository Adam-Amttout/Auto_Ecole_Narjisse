<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class NotificationsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $clientIds = DB::table('clients')->where('role', 'user')->pluck('id')->toArray();

        $notifications = [
            // Notifications globales (client_id = null)
            ['client_id' => null, 'type' => 'general',  'titre' => 'Bienvenue !',                          'message' => 'Bienvenue sur la plateforme Auto École Narjiss. Bonne formation !',                 'icon' => '🎉', 'color' => '#2ecc71', 'lu' => false],
            ['client_id' => null, 'type' => 'general',  'titre' => 'Maintenance prévue',                   'message' => 'La plateforme sera indisponible le dimanche de 2h à 4h du matin.',                  'icon' => '🔧', 'color' => '#f39c12', 'lu' => false],
            ['client_id' => null, 'type' => 'cours',    'titre' => 'Nouveau cours disponible',              'message' => 'Le cours "Conduite sur autoroute" est maintenant disponible.',                       'icon' => '📚', 'color' => '#3498db', 'lu' => false],
            ['client_id' => null, 'type' => 'general',  'titre' => 'Promotion été 2026',                   'message' => 'Profitez de -20% sur la formule complète pendant tout le mois de juin !',            'icon' => '🌞', 'color' => '#e74c3c', 'lu' => false],
            ['client_id' => null, 'type' => 'qcm',      'titre' => 'Nouvelles questions QCM',               'message' => '50 nouvelles questions ont été ajoutées à la banque de questions.',                  'icon' => '❓', 'color' => '#9b59b6', 'lu' => false],
        ];

        // Notifications privées pour certains clients
        if (!empty($clientIds)) {
            $notifications[] = ['client_id' => $clientIds[0], 'type' => 'seance', 'titre' => 'Séance confirmée',       'message' => 'Votre séance de conduite du lundi à 10h est confirmée.',         'icon' => '🚗', 'color' => '#27ae60', 'lu' => true];
            $notifications[] = ['client_id' => $clientIds[0], 'type' => 'qcm',    'titre' => 'Résultat examen blanc',  'message' => 'Vous avez obtenu 37/40 à votre dernier examen blanc. Bravo !',   'icon' => '🏆', 'color' => '#f1c40f', 'lu' => true];
            if (count($clientIds) > 1) {
                $notifications[] = ['client_id' => $clientIds[1], 'type' => 'seance', 'titre' => 'Séance annulée',     'message' => 'Votre séance du mercredi a été reportée à vendredi 14h.',        'icon' => '⚠️', 'color' => '#e74c3c', 'lu' => false];
                $notifications[] = ['client_id' => $clientIds[1], 'type' => 'cours',  'titre' => 'Cours à compléter',  'message' => 'Il vous reste 3 cours à terminer avant l\'examen théorique.',    'icon' => '📝', 'color' => '#e67e22', 'lu' => false];
            }
            if (count($clientIds) > 2) {
                $notifications[] = ['client_id' => $clientIds[2], 'type' => 'general', 'titre' => 'Dossier incomplet', 'message' => 'Veuillez compléter votre dossier administratif (visite médicale).', 'icon' => '📋', 'color' => '#c0392b', 'lu' => false];
            }
        }

        foreach ($notifications as $n) {
            DB::table('notifications')->insert([
                'client_id'  => $n['client_id'],
                'type'       => $n['type'],
                'titre'      => $n['titre'],
                'message'    => $n['message'],
                'icon'       => $n['icon'],
                'color'      => $n['color'],
                'lu'         => $n['lu'],
                'created_at' => $now->copy()->subDays(rand(0, 20)),
                'updated_at' => $now,
            ]);
        }

        $this->command->info('  ✅ ' . count($notifications) . ' notifications insérées');
    }
}
