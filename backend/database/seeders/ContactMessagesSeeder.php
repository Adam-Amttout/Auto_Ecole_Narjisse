<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ContactMessagesSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $messages = [
            [
                'nom' => 'Amrani', 'prenom' => 'Samir', 'email' => 'samir.amrani@gmail.com',
                'telephone' => '0671234567', 'sujet' => 'Demande de tarifs',
                'message' => 'Bonjour, je souhaite connaître vos tarifs pour le permis B. Merci.',
                'lu' => true, 'reponse_admin' => 'Bonjour Samir, nos tarifs commencent à 3500 DH pour la formule classique. N\'hésitez pas à passer nous voir !',
                'repondu_le' => $now->copy()->subDays(3), 'statut' => 'repondu',
            ],
            [
                'nom' => 'Bouzid', 'prenom' => 'Asmae', 'email' => 'asmae.bouzid@outlook.com',
                'telephone' => '0682345678', 'sujet' => 'Horaires d\'ouverture',
                'message' => 'Quels sont vos horaires d\'ouverture ? Je travaille jusqu\'à 18h.',
                'lu' => true, 'reponse_admin' => 'Bonjour Asmae, nous sommes ouverts du lundi au samedi de 8h à 20h. Vous pouvez réserver des créneaux en soirée.',
                'repondu_le' => $now->copy()->subDays(5), 'statut' => 'repondu',
            ],
            [
                'nom' => 'Kettani', 'prenom' => 'Reda', 'email' => 'reda.kettani@yahoo.fr',
                'telephone' => '0693456789', 'sujet' => 'Réclamation',
                'message' => 'Ma séance de conduite a été annulée sans prévenir. Je suis déçu.',
                'lu' => true, 'reponse_admin' => 'Bonjour Reda, nous nous excusons pour ce désagrément. Nous vous offrons une séance gratuite en compensation.',
                'repondu_le' => $now->copy()->subDays(1), 'statut' => 'repondu',
            ],
            [
                'nom' => 'Tahiri', 'prenom' => 'Ghita', 'email' => 'ghita.tahiri@gmail.com',
                'telephone' => '0604567890', 'sujet' => 'Documents nécessaires',
                'message' => 'Quels documents dois-je apporter pour m\'inscrire au permis B ?',
                'lu' => true, 'reponse_admin' => null, 'repondu_le' => null, 'statut' => 'lu',
            ],
            [
                'nom' => 'Slimani', 'prenom' => 'Bilal', 'email' => 'bilal.slimani@gmail.com',
                'telephone' => '0615678901', 'sujet' => 'Partenariat',
                'message' => 'Bonjour, je représente une entreprise et je souhaite proposer des formations à nos employés.',
                'lu' => false, 'reponse_admin' => null, 'repondu_le' => null, 'statut' => 'nouveau',
            ],
            [
                'nom' => 'Lazrak', 'prenom' => 'Meryem', 'email' => 'meryem.lazrak@gmail.com',
                'telephone' => '0626789012', 'sujet' => 'Changement de moniteur',
                'message' => 'Est-il possible de changer de moniteur en cours de formation ?',
                'lu' => false, 'reponse_admin' => null, 'repondu_le' => null, 'statut' => 'nouveau',
            ],
            [
                'nom' => 'Hamdaoui', 'prenom' => 'Ismail', 'email' => 'ismail.hamdaoui@outlook.com',
                'telephone' => '0637890123', 'sujet' => 'Remerciement',
                'message' => 'Merci pour la formation, j\'ai obtenu mon permis hier ! Équipe formidable.',
                'lu' => true, 'reponse_admin' => 'Félicitations Ismail ! Nous sommes ravis de votre réussite. Bonne route !',
                'repondu_le' => $now->copy()->subDays(2), 'statut' => 'repondu',
            ],
            [
                'nom' => 'Zouak', 'prenom' => 'Khadija', 'email' => 'khadija.zouak@gmail.com',
                'telephone' => '0648901234', 'sujet' => 'Paiement en plusieurs fois',
                'message' => 'Proposez-vous le paiement en plusieurs fois pour la formation complète ?',
                'lu' => false, 'reponse_admin' => null, 'repondu_le' => null, 'statut' => 'nouveau',
            ],
        ];

        foreach ($messages as $m) {
            DB::table('contact_messages')->insert([
                'nom'            => $m['nom'],
                'prenom'         => $m['prenom'],
                'email'          => $m['email'],
                'telephone'      => $m['telephone'],
                'sujet'          => $m['sujet'],
                'message'        => $m['message'],
                'lu'             => $m['lu'],
                'reponse_admin'  => $m['reponse_admin'],
                'repondu_le'     => $m['repondu_le'],
                'statut'         => $m['statut'],
                'created_at'     => $now->copy()->subDays(rand(1, 30)),
                'updated_at'     => $now,
            ]);
        }

        $this->command->info('  ✅ 8 messages de contact insérés');
    }
}
