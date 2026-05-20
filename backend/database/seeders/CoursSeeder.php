<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CoursSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $cours = [
            [
                'titre'         => 'Les panneaux de danger',
                'description'   => 'Apprenez à reconnaître et comprendre tous les panneaux de danger sur la route.',
                'categorie'     => 'danger',
                'niveau'        => 'debutant',
                'image'         => 'https://images.unsplash.com/photo-1587573089734-599d584d68be',
                'video_url'     => 'https://www.youtube.com/watch?v=example1',
                'contenu'       => '<h3>Les panneaux de danger</h3><p>Les panneaux de danger sont triangulaires avec un bord rouge. Ils préviennent le conducteur d\'un danger à venir.</p><ul><li>Virage dangereux</li><li>Chaussée glissante</li><li>Passage piétons</li></ul>',
                'pdf_url'       => null,
                'duree_minutes' => 45,
                'actif'         => true,
            ],
            [
                'titre'         => 'Les panneaux d\'interdiction',
                'description'   => 'Tous les panneaux d\'interdiction que vous devez connaître pour l\'examen.',
                'categorie'     => 'interdiction',
                'niveau'        => 'debutant',
                'image'         => 'https://images.unsplash.com/photo-1506765515384-028b60a970df',
                'video_url'     => 'https://www.youtube.com/watch?v=example2',
                'contenu'       => '<h3>Panneaux d\'interdiction</h3><p>Ronds avec bord rouge, ils indiquent ce qui est interdit : sens interdit, dépassement interdit, stationnement interdit, etc.</p>',
                'pdf_url'       => null,
                'duree_minutes' => 40,
                'actif'         => true,
            ],
            [
                'titre'         => 'Les panneaux d\'indication',
                'description'   => 'Comprendre les panneaux d\'indication et de direction.',
                'categorie'     => 'indication',
                'niveau'        => 'debutant',
                'image'         => 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afe',
                'video_url'     => null,
                'contenu'       => '<h3>Panneaux d\'indication</h3><p>Carrés ou rectangulaires, généralement bleus, ils donnent des informations utiles : parking, hôpital, station-service.</p>',
                'pdf_url'       => null,
                'duree_minutes' => 35,
                'actif'         => true,
            ],
            [
                'titre'         => 'Règles de priorité',
                'description'   => 'Maîtrisez les règles de priorité aux intersections et ronds-points.',
                'categorie'     => 'code_route',
                'niveau'        => 'intermediaire',
                'image'         => 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98',
                'video_url'     => 'https://www.youtube.com/watch?v=example4',
                'contenu'       => '<h3>Priorité à droite</h3><p>En l\'absence de signalisation, la priorité est à droite. Dans un rond-point, les véhicules engagés ont la priorité.</p>',
                'pdf_url'       => null,
                'duree_minutes' => 50,
                'actif'         => true,
            ],
            [
                'titre'         => 'Le dépassement',
                'description'   => 'Quand et comment dépasser en toute sécurité.',
                'categorie'     => 'code_route',
                'niveau'        => 'intermediaire',
                'image'         => 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
                'video_url'     => null,
                'contenu'       => '<h3>Règles de dépassement</h3><p>Le dépassement se fait par la gauche. Il est interdit en sommet de côte, dans les virages, et aux passages à niveau.</p>',
                'pdf_url'       => null,
                'duree_minutes' => 40,
                'actif'         => true,
            ],
            [
                'titre'         => 'Conduite en ville',
                'description'   => 'Techniques de conduite en milieu urbain : Marrakech et ses spécificités.',
                'categorie'     => 'conduite',
                'niveau'        => 'intermediaire',
                'image'         => 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e',
                'video_url'     => 'https://www.youtube.com/watch?v=example6',
                'contenu'       => '<h3>Conduire en ville</h3><p>Respectez les limitations de vitesse (60 km/h en ville), surveillez les piétons, et anticipez les deux-roues.</p>',
                'pdf_url'       => null,
                'duree_minutes' => 55,
                'actif'         => true,
            ],
            [
                'titre'         => 'Conduite sur autoroute',
                'description'   => 'Maîtrisez la conduite sur autoroute : insertion, dépassement, distances de sécurité.',
                'categorie'     => 'conduite',
                'niveau'        => 'avance',
                'image'         => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
                'video_url'     => 'https://www.youtube.com/watch?v=example7',
                'contenu'       => '<h3>Autoroute</h3><p>Vitesse maximale 120 km/h au Maroc. Gardez 2 secondes de distance de sécurité minimum.</p>',
                'pdf_url'       => null,
                'duree_minutes' => 50,
                'actif'         => true,
            ],
            [
                'titre'         => 'Stationnement et manœuvres',
                'description'   => 'Apprenez le créneau, la marche arrière et le demi-tour.',
                'categorie'     => 'conduite',
                'niveau'        => 'avance',
                'image'         => 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a',
                'video_url'     => null,
                'contenu'       => '<h3>Manœuvres</h3><p>Le créneau, la marche arrière en ligne droite et le demi-tour sont des manœuvres évaluées à l\'examen pratique.</p>',
                'pdf_url'       => null,
                'duree_minutes' => 45,
                'actif'         => true,
            ],
            [
                'titre'         => 'Sécurité routière et premiers secours',
                'description'   => 'Les gestes de premiers secours et la sécurité routière au Maroc.',
                'categorie'     => 'autre',
                'niveau'        => 'debutant',
                'image'         => 'https://images.unsplash.com/photo-1587351021759-3772687fe598',
                'video_url'     => null,
                'contenu'       => '<h3>Premiers secours</h3><p>Protéger, alerter, secourir. Appelez le 150 (SAMU) ou le 177 (gendarmerie) en cas d\'accident.</p>',
                'pdf_url'       => null,
                'duree_minutes' => 30,
                'actif'         => true,
            ],
            [
                'titre'         => 'L\'éclairage et la signalisation du véhicule',
                'description'   => 'Feux de croisement, feux de route, clignotants : tout comprendre.',
                'categorie'     => 'code_route',
                'niveau'        => 'debutant',
                'image'         => 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7',
                'video_url'     => null,
                'contenu'       => '<h3>Éclairage</h3><p>Feux de croisement obligatoires la nuit et par mauvais temps. Les feux de route s\'utilisent hors agglomération.</p>',
                'pdf_url'       => null,
                'duree_minutes' => 35,
                'actif'         => true,
            ],
        ];

        foreach ($cours as $c) {
            DB::table('cours')->updateOrInsert(
                ['titre' => $c['titre']],
                array_merge($c, [
                    'created_at' => $now->copy()->subDays(rand(10, 120)),
                    'updated_at' => $now,
                ])
            );
        }

        $this->command->info('  ✅ 10 cours insérés');
    }
}
