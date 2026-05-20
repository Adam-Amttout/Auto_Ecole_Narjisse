<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AvisSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $avis = [
            ['nom' => 'Benali',    'prenom' => 'Youssef',  'email' => 'youssef.benali@gmail.com',   'role_label' => 'Permis B obtenu en 3 semaines',   'texte' => 'Excellente auto-école ! Les moniteurs sont patients et professionnels. J\'ai obtenu mon permis du premier coup grâce à eux.',                    'note' => 5, 'statut' => 'approved'],
            ['nom' => 'El Amrani', 'prenom' => 'Fatima',   'email' => 'fatima.elamrani@gmail.com',  'role_label' => 'Permis B obtenu en 1 mois',       'texte' => 'Formation de qualité, moniteurs compétents. Je recommande vivement Auto École Narjiss à Marrakech.',                                             'note' => 5, 'statut' => 'approved'],
            ['nom' => 'Tazi',      'prenom' => 'Mehdi',    'email' => 'mehdi.tazi@outlook.com',     'role_label' => 'Permis B en cours',                'texte' => 'Très bonne expérience. Les cours de code sont bien structurés et les exercices en ligne m\'ont beaucoup aidé.',                                   'note' => 4, 'statut' => 'approved'],
            ['nom' => 'Bennani',   'prenom' => 'Sara',     'email' => 'sara.bennani@gmail.com',     'role_label' => 'Permis B obtenu',                  'texte' => 'Auto-école sérieuse avec un bon suivi. Le seul bémol est le temps d\'attente parfois pour les créneaux de conduite.',                             'note' => 4, 'statut' => 'approved'],
            ['nom' => 'Idrissi',   'prenom' => 'Karim',    'email' => 'karim.idrissi@yahoo.fr',     'role_label' => 'Permis B obtenu en 2 mois',       'texte' => 'Moniteur Hassan est le meilleur ! Patient, pédagogue et toujours de bonne humeur. Merci Narjiss !',                                              'note' => 5, 'statut' => 'approved'],
            ['nom' => 'Alaoui',    'prenom' => 'Nadia',    'email' => 'nadia.alaoui@gmail.com',     'role_label' => 'Permis B obtenu',                  'texte' => 'J\'avais peur de conduire mais grâce à l\'encadrement de cette auto-école, j\'ai pris confiance rapidement.',                                     'note' => 5, 'statut' => 'approved'],
            ['nom' => 'Chraibi',   'prenom' => 'Omar',     'email' => 'omar.chraibi@hotmail.com',   'role_label' => 'Étudiant - Permis B',              'texte' => 'Prix raisonnable pour la qualité offerte. Les horaires flexibles conviennent bien aux étudiants.',                                                'note' => 4, 'statut' => 'approved'],
            ['nom' => 'Fassi',     'prenom' => 'Leila',    'email' => 'leila.fassi@gmail.com',      'role_label' => 'Permis B obtenu en 20h',           'texte' => 'Rapide et efficace ! L\'application de suivi en ligne est un vrai plus. Tout est moderne et bien organisé.',                                      'note' => 5, 'statut' => 'approved'],
            ['nom' => 'Moukhtari', 'prenom' => 'Anas',     'email' => 'anas.moukhtari@gmail.com',   'role_label' => 'Permis B en cours',                'texte' => 'Je suis satisfait de la formation. Les cours théoriques sont complets.',                                                                          'note' => 4, 'statut' => 'pending'],
            ['nom' => 'Rachidi',   'prenom' => 'Soukaina', 'email' => 'soukaina.rachidi@gmail.com', 'role_label' => 'Permis B obtenu',                  'texte' => 'Service client excellent. Ils répondent rapidement à toutes les questions.',                                                                      'note' => 5, 'statut' => 'pending'],
        ];

        foreach ($avis as $a) {
            DB::table('avis')->updateOrInsert(
                ['email' => $a['email']],
                [
                    'nom'        => $a['nom'],
                    'prenom'     => $a['prenom'],
                    'role_label' => $a['role_label'],
                    'texte'      => $a['texte'],
                    'note'       => $a['note'],
                    'photo_url'  => null,
                    'statut'     => $a['statut'],
                    'created_at' => $now->copy()->subDays(rand(5, 90)),
                    'updated_at' => $now,
                ]
            );
        }

        $this->command->info('  ✅ 10 avis insérés');
    }
}
