<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $faqs = [
            [
                'question'   => 'Combien coûte la formation ?',
                'reponse'    => 'Le tarif dépend de la formule choisie. Contactez-nous pour un devis personnalisé. Nos formules commencent à partir de 3500 DH.',
                'image'      => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
                'ordre'      => 1,
                'actif'      => true,
            ],
            [
                'question'   => 'Combien de temps dure la formation ?',
                'reponse'    => 'La durée moyenne est de 1 à 3 mois selon votre disponibilité et votre rythme d\'apprentissage.',
                'image'      => 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
                'ordre'      => 2,
                'actif'      => true,
            ],
            [
                'question'   => 'Quel est le taux de réussite ?',
                'reponse'    => 'Notre taux de réussite dépasse 95% grâce à un encadrement personnalisé et des outils pédagogiques modernes.',
                'image'      => 'https://images.unsplash.com/photo-1492724441997-5dc865305da7',
                'ordre'      => 3,
                'actif'      => true,
            ],
            [
                'question'   => 'Puis-je choisir mon moniteur ?',
                'reponse'    => 'Oui, selon disponibilité, vous pouvez choisir votre moniteur préféré pour vos séances de conduite.',
                'image'      => 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c',
                'ordre'      => 4,
                'actif'      => true,
            ],
            [
                'question'   => 'Les cours sont-ils flexibles ?',
                'reponse'    => 'Nous proposons des horaires flexibles adaptés aux étudiants et salariés, y compris les week-ends.',
                'image'      => 'https://images.unsplash.com/photo-1529070538774-1843cb3265df',
                'ordre'      => 5,
                'actif'      => true,
            ],
            [
                'question'   => 'Comment réserver une séance ?',
                'reponse'    => 'La réservation peut se faire directement à l\'agence, par téléphone ou via notre plateforme en ligne.',
                'image'      => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
                'ordre'      => 6,
                'actif'      => true,
            ],
            [
                'question'   => 'Quels documents sont nécessaires pour l\'inscription ?',
                'reponse'    => 'Vous aurez besoin de : copie CIN (recto/verso), 4 photos d\'identité, certificat médical, justificatif de domicile, et le formulaire d\'inscription rempli.',
                'image'      => 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
                'ordre'      => 7,
                'actif'      => true,
            ],
            [
                'question'   => 'Proposez-vous le paiement en plusieurs fois ?',
                'reponse'    => 'Oui, nous proposons des facilités de paiement en 2 ou 3 fois sans frais. Le premier versement se fait à l\'inscription.',
                'image'      => 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
                'ordre'      => 8,
                'actif'      => true,
            ],
            [
                'question'   => 'Comment se déroule l\'examen du code de la route ?',
                'reponse'    => 'L\'examen théorique comprend 40 questions à choix multiples. Vous devez obtenir au moins 35/40 (87,5%) pour réussir. La durée est de 30 minutes.',
                'image'      => 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173',
                'ordre'      => 9,
                'actif'      => true,
            ],
            [
                'question'   => 'Quel est l\'âge minimum pour passer le permis B ?',
                'reponse'    => 'Au Maroc, l\'âge minimum pour passer le permis de conduire catégorie B est de 18 ans. Vous pouvez cependant commencer la formation à 17 ans et demi.',
                'image'      => 'https://images.unsplash.com/photo-1523050854058-8df90110c476',
                'ordre'      => 10,
                'actif'      => true,
            ],
            [
                'question'   => 'Combien d\'heures de conduite sont nécessaires ?',
                'reponse'    => 'Le minimum légal est de 20 heures de conduite. En moyenne, nos élèves effectuent entre 20 et 30 heures selon leur niveau et progression.',
                'image'      => 'https://images.unsplash.com/photo-1449965408869-ebd3fee0e142',
                'ordre'      => 11,
                'actif'      => true,
            ],
            [
                'question'   => 'Que se passe-t-il si j\'échoue à l\'examen ?',
                'reponse'    => 'En cas d\'échec, vous pouvez repasser l\'examen après un délai d\'attente. Des séances de révision supplémentaires sont disponibles pour vous préparer.',
                'image'      => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
                'ordre'      => 12,
                'actif'      => true,
            ],
            [
                'question'   => 'Proposez-vous des cours de conduite pour les femmes uniquement ?',
                'reponse'    => 'Oui, nous avons une monitrice qualifiée qui peut assurer des séances exclusivement féminines pour plus de confort.',
                'image'      => 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8',
                'ordre'      => 13,
                'actif'      => true,
            ],
            [
                'question'   => 'Où se trouve votre auto-école ?',
                'reponse'    => 'Auto École Narjiss est située au centre de Marrakech. Nous sommes facilement accessibles en transport en commun et disposons d\'un parking gratuit.',
                'image'      => 'https://images.unsplash.com/photo-1597212618440-806262de4f6b',
                'ordre'      => 14,
                'actif'      => true,
            ],
            [
                'question'   => 'Les véhicules de formation sont-ils récents ?',
                'reponse'    => 'Oui, notre flotte comprend des véhicules récents et bien entretenus (Dacia Logan, Renault Clio, Peugeot 208) équipés de doubles commandes pour votre sécurité.',
                'image'      => 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afe',
                'ordre'      => 15,
                'actif'      => true,
            ],
        ];

        foreach ($faqs as $faq) {
            DB::table('faqs')->updateOrInsert(
                ['question' => $faq['question']],
                array_merge($faq, [
                    'created_at' => $now->copy()->subDays(rand(10, 120)),
                    'updated_at' => $now,
                ])
            );
        }

        $this->command->info('  ✅ 15 FAQs insérées');
    }
}
