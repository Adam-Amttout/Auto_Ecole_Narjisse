<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InscriptionsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $clientIds = DB::table('clients')->where('role', 'user')->pluck('id')->toArray();

        $inscriptions = [
            ['nom' => 'Benali',    'prenom' => 'Youssef',  'email' => 'youssef.benali@gmail.com',    'telephone' => '0661112233', 'sujet' => 'Permis B',           'message' => 'Je souhaite m\'inscrire pour le permis B. Disponible les matins.'],
            ['nom' => 'El Amrani', 'prenom' => 'Fatima',   'email' => 'fatima.elamrani@gmail.com',   'telephone' => '0662223344', 'sujet' => 'Permis B',           'message' => 'Bonjour, je veux commencer ma formation dès que possible.'],
            ['nom' => 'Tazi',      'prenom' => 'Mehdi',    'email' => 'mehdi.tazi@outlook.com',      'telephone' => '0663334455', 'sujet' => 'Permis A (Moto)',    'message' => 'Intéressé par le permis moto. Quels sont les tarifs ?'],
            ['nom' => 'Bennani',   'prenom' => 'Sara',     'email' => 'sara.bennani@gmail.com',      'telephone' => '0664445566', 'sujet' => 'Permis B',           'message' => 'Je cherche une formation accélérée pour le permis B.'],
            ['nom' => 'Idrissi',   'prenom' => 'Karim',    'email' => 'karim.idrissi@yahoo.fr',      'telephone' => '0665556677', 'sujet' => 'Code de la route',   'message' => 'Je veux d\'abord passer le code avant la conduite.'],
            ['nom' => 'Alaoui',    'prenom' => 'Nadia',    'email' => 'nadia.alaoui@gmail.com',      'telephone' => '0666667788', 'sujet' => 'Permis B',           'message' => 'Disponible les week-ends uniquement. Merci de me contacter.'],
            ['nom' => 'Chraibi',   'prenom' => 'Omar',     'email' => 'omar.chraibi@hotmail.com',    'telephone' => '0667778899', 'sujet' => 'Permis B',           'message' => 'Je suis étudiant, avez-vous des offres spéciales ?'],
            ['nom' => 'Fassi',     'prenom' => 'Leila',    'email' => 'leila.fassi@gmail.com',       'telephone' => '0668889900', 'sujet' => 'Remise à niveau',    'message' => 'J\'ai déjà conduit mais je veux reprendre des cours.'],
            ['nom' => 'Ouazzani',  'prenom' => 'Amine',    'email' => 'amine.ouazzani@gmail.com',    'telephone' => '0669990011', 'sujet' => 'Permis B',           'message' => 'Je souhaite m\'inscrire avec un ami. Tarif duo possible ?'],
            ['nom' => 'Berrada',   'prenom' => 'Hanane',   'email' => 'hanane.berrada@outlook.com',  'telephone' => '0670001122', 'sujet' => 'Permis B',           'message' => 'Inscription pour ma fille. Elle a 18 ans.'],
            ['nom' => 'Moussaoui', 'prenom' => 'Yassine',  'email' => 'yassine.moussaoui@gmail.com', 'telephone' => '0671112233', 'sujet' => 'Permis C (Poids lourd)', 'message' => 'Je suis chauffeur professionnel, je veux upgrader mon permis.'],
            ['nom' => 'Rachidi',   'prenom' => 'Soukaina', 'email' => 'soukaina.rachidi@gmail.com',  'telephone' => '0672223344', 'sujet' => 'Permis B',           'message' => 'Bonjour, quels documents faut-il pour l\'inscription ?'],
        ];

        foreach ($inscriptions as $i => $insc) {
            $clientId = isset($clientIds[$i]) ? $clientIds[$i] : null;

            DB::table('inscriptions')->updateOrInsert(
                ['email' => $insc['email'], 'sujet' => $insc['sujet']],
                [
                    'client_id'  => $clientId,
                    'nom'        => $insc['nom'],
                    'prenom'     => $insc['prenom'],
                    'telephone'  => $insc['telephone'],
                    'message'    => $insc['message'],
                    'created_at' => $now->copy()->subDays(rand(5, 60)),
                    'updated_at' => $now,
                ]
            );
        }

        $this->command->info('  ✅ 12 inscriptions insérées');
    }
}
