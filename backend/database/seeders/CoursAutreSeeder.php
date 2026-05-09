<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cours;

class CoursAutreSeeder extends Seeder
{
    public function run(): void
    {
        $cours = [
            [
                'titre'         => 'Éco-conduite : conduire en économisant le carburant',
                'description'   => 'Apprenez les techniques de conduite souple et économique pour réduire votre consommation de carburant et préserver l\'environnement.',
                'categorie'     => 'autre',
                'niveau'        => 'debutant',
                'contenu'       => '<h3>Qu\'est-ce que l\'éco-conduite ?</h3><p>L\'éco-conduite consiste à adopter un style de conduite qui réduit la consommation de carburant, les émissions de CO₂ et l\'usure du véhicule.</p><h3>Principes de base</h3><ul><li>Anticiper les ralentissements et éviter les freinages brusques</li><li>Maintenir une vitesse stable et régulière</li><li>Passer les vitesses tôt (entre 2000 et 2500 tr/min)</li><li>Éviter les démarrages en trombe</li><li>Couper le moteur lors des arrêts prolongés</li></ul><h3>Avantages</h3><ul><li>Économies de carburant de 15 à 20%</li><li>Réduction des émissions polluantes</li><li>Moins d\'usure sur le moteur et les freins</li></ul>',
                'actif'         => true,
                'duree_minutes' => 25,
            ],
            [
                'titre'         => 'Premiers secours sur la route',
                'description'   => 'Que faire en cas d\'accident ? Apprenez les gestes de premiers secours essentiels pour protéger les victimes en attendant les secours.',
                'categorie'     => 'autre',
                'niveau'        => 'debutant',
                'contenu'       => '<h3>Les bons réflexes en cas d\'accident</h3><p>Agir vite et bien peut sauver des vies. Voici les étapes à suivre :</p><h3>Étape 1 — Protéger</h3><p>Sécurisez la zone : allumez les feux de détresse, placez le triangle de signalisation à 30 m, portez le gilet fluorescent.</p><h3>Étape 2 — Alerter</h3><p>Appelez les secours : <strong>19</strong> (Police), <strong>15</strong> (SAMU), <strong>150</strong> (Protection civile).</p><h3>Étape 3 — Secourir</h3><ul><li>Ne déplacez pas les blessés sauf danger immédiat</li><li>Parlez à la victime pour la rassurer</li><li>Si inconsciente et respire : position latérale de sécurité (PLS)</li><li>Si inconsciente et ne respire pas : commencez le massage cardiaque</li></ul>',
                'actif'         => true,
                'duree_minutes' => 30,
            ],
            [
                'titre'         => 'Documents obligatoires dans le véhicule',
                'description'   => 'Quels documents devez-vous avoir sur vous lors d\'un contrôle routier au Maroc ? Permis, carte grise, assurance — tout ce qu\'il faut savoir.',
                'categorie'     => 'autre',
                'niveau'        => 'debutant',
                'contenu'       => '<h3>Documents obligatoires au Maroc</h3><p>Lors d\'un contrôle par les forces de l\'ordre, vous devez présenter :</p><ul><li><strong>Le permis de conduire</strong> — valable et correspondant à la catégorie du véhicule</li><li><strong>La carte grise (certificat d\'immatriculation)</strong> — au nom du propriétaire</li><li><strong>L\'attestation d\'assurance</strong> — en cours de validité</li><li><strong>Le contrôle technique</strong> — si le véhicule a plus de 5 ans</li></ul><h3>Sanctions en cas de manquement</h3><p>Rouler sans ces documents est passible d\'amendes et peut entraîner l\'immobilisation du véhicule.</p><h3>Durée de validité du permis</h3><p>Au Maroc, le permis de conduire est valable <strong>10 ans</strong> et doit être renouvelé avant expiration.</p>',
                'actif'         => true,
                'duree_minutes' => 20,
            ],
            [
                'titre'         => 'Comprendre son assurance automobile',
                'description'   => 'Responsabilité civile, tous risques, franchise... Comprendre les bases de l\'assurance auto pour bien vous couvrir sur la route.',
                'categorie'     => 'autre',
                'niveau'        => 'debutant',
                'contenu'       => '<h3>Les types d\'assurance auto</h3><ul><li><strong>Responsabilité civile (RC)</strong> — Obligatoire. Couvre les dommages causés aux tiers (personnes et biens).</li><li><strong>Assurance tous risques</strong> — Couvre également les dommages subis par votre propre véhicule.</li><li><strong>Assurance au tiers étendu</strong> — Intermédiaire : RC + vol, incendie, bris de glace.</li></ul><h3>La franchise</h3><p>C\'est la somme qui reste à votre charge en cas de sinistre. Plus la franchise est élevée, moins la prime est chère.</p><h3>Déclarer un accident</h3><p>Remplissez le constat amiable sur place et envoyez-le à votre assurance dans les <strong>5 jours ouvrables</strong>.</p>',
                'actif'         => true,
                'duree_minutes' => 25,
            ],
            [
                'titre'         => 'Entretien de base du véhicule',
                'description'   => 'Niveaux d\'huile, pression des pneus, freins, batterie... Les vérifications essentielles pour maintenir votre véhicule en bon état.',
                'categorie'     => 'autre',
                'niveau'        => 'debutant',
                'contenu'       => '<h3>Vérifications régulières</h3><ul><li><strong>Huile moteur</strong> — Vérifier le niveau avec la jauge avant chaque long trajet. Changer toutes les 10 000 km.</li><li><strong>Pression des pneus</strong> — Vérifier à froid une fois par mois. Pneus sous-gonflés = consommation accrue et danger.</li><li><strong>Liquide de refroidissement</strong> — Vérifier le niveau à froid dans le vase d\'expansion.</li><li><strong>Liquide de frein</strong> — À contrôler et changer tous les 2 ans.</li><li><strong>Batterie</strong> — Attention aux démarrages difficiles par temps froid.</li></ul><h3>Contrôle technique</h3><p>Obligatoire au Maroc pour les véhicules de plus de 5 ans, renouvelable tous les 2 ans.</p>',
                'actif'         => true,
                'duree_minutes' => 30,
            ],
            [
                'titre'         => 'Conduite de nuit : précautions et réflexes',
                'description'   => 'La nuit, les risques augmentent considérablement. Découvrez les règles et réflexes pour conduire en sécurité dans l\'obscurité.',
                'categorie'     => 'autre',
                'niveau'        => 'intermediaire',
                'contenu'       => '<h3>Pourquoi la nuit est plus dangereuse ?</h3><p>La vision réduite, la fatigue et l\'éblouissement font que les accidents de nuit sont souvent plus graves malgré un trafic réduit.</p><h3>Règles essentielles</h3><ul><li>Allumer les <strong>feux de croisement</strong> dès la tombée de la nuit</li><li>Utiliser les <strong>feux de route</strong> uniquement hors agglomération et en l\'absence de véhicule en face</li><li>Réduire la vitesse pour adapter la distance de freinage à la portée des phares</li><li>Faire des <strong>pauses régulières</strong> : la fatigue est amplifiée la nuit</li></ul><h3>En cas d\'éblouissement</h3><p>Regardez sur le côté droit de la route, réduisez la vitesse et ne fermez pas les yeux.</p>',
                'actif'         => true,
                'duree_minutes' => 25,
            ],
            [
                'titre'         => 'Conduite par mauvais temps (pluie, brouillard, vent)',
                'description'   => 'Pluie, verglas, brouillard, vent fort — chaque condition météo exige une adaptation de votre conduite. Apprenez les bons réflexes.',
                'categorie'     => 'autre',
                'niveau'        => 'intermediaire',
                'contenu'       => '<h3>Par temps de pluie</h3><ul><li>Réduire la vitesse (autoroute : 100 km/h, route : 80 km/h)</li><li>Augmenter la distance de sécurité (x2)</li><li>Allumer les feux de croisement</li><li>Attention à l\'aquaplaning : lever le pied sans freiner brusquement</li></ul><h3>Par brouillard</h3><ul><li>Allumer les <strong>feux antibrouillard</strong></li><li>Réduire la vitesse drastiquement</li><li>Ne jamais doubler en brouillard dense</li></ul><h3>Par vent fort</h3><ul><li>Tenir fermement le volant à deux mains</li><li>Réduire la vitesse, surtout sur pont et autoroute</li><li>Attention aux rafales latérales lors des dépassements</li></ul><h3>Sur chaussée glissante</h3><ul><li>Éviter les freinages et accélérations brusques</li><li>En cas de dérapage : ne pas freiner, braquer dans le sens du dérapage</li></ul>',
                'actif'         => true,
                'duree_minutes' => 30,
            ],
        ];

        foreach ($cours as $c) {
            Cours::updateOrCreate(
                ['titre' => $c['titre'], 'categorie' => 'autre'],
                $c
            );
        }

        $this->command->info('✅ 7 cours "Autre" créés avec succès.');
    }
}
