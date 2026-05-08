<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            // 1
            ['question' => "Quelle est la vitesse maximale autorisée en agglomération au Maroc ?",
             'option_a' => "40 km/h", 'option_b' => "60 km/h", 'option_c' => "80 km/h", 'option_d' => "100 km/h",
             'correct_answer' => 'b',
             'explication' => "En agglomération, la vitesse est limitée à 60 km/h sauf indication contraire."],
            // 2
            ['question' => "Quelle est la vitesse maximale autorisée sur autoroute au Maroc ?",
             'option_a' => "100 km/h", 'option_b' => "110 km/h", 'option_c' => "120 km/h", 'option_d' => "130 km/h",
             'correct_answer' => 'c',
             'explication' => "Sur autoroute, la vitesse maximale est de 120 km/h."],
            // 3
            ['question' => "Quelle est la vitesse maximale hors agglomération sur route ordinaire ?",
             'option_a' => "80 km/h", 'option_b' => "90 km/h", 'option_c' => "100 km/h", 'option_d' => "110 km/h",
             'correct_answer' => 'c',
             'explication' => "Hors agglomération sur route ordinaire, la vitesse est limitée à 100 km/h."],
            // 4
            ['question' => "Que signifie un panneau triangulaire rouge ?",
             'option_a' => "Obligation", 'option_b' => "Danger", 'option_c' => "Interdiction", 'option_d' => "Information",
             'correct_answer' => 'b',
             'explication' => "Les panneaux triangulaires rouges signalent un danger à venir sur la route."],
            // 5
            ['question' => "Que signifie un panneau circulaire rouge ?",
             'option_a' => "Obligation", 'option_b' => "Danger", 'option_c' => "Interdiction", 'option_d' => "Direction",
             'correct_answer' => 'c',
             'explication' => "Les panneaux circulaires à fond blanc et bordure rouge indiquent une interdiction."],
            // 6
            ['question' => "Que signifie un panneau circulaire bleu ?",
             'option_a' => "Interdiction", 'option_b' => "Danger", 'option_c' => "Obligation", 'option_d' => "Information",
             'correct_answer' => 'c',
             'explication' => "Les panneaux circulaires bleus indiquent une obligation à respecter."],
            // 7
            ['question' => "À un panneau STOP, que doit faire le conducteur ?",
             'option_a' => "Ralentir et observer", 'option_b' => "S'arrêter complètement et céder la priorité", 'option_c' => "Accélérer pour dégager la voie", 'option_d' => "Klaxonner et passer",
             'correct_answer' => 'b',
             'explication' => "Au panneau STOP, l'arrêt complet est obligatoire avant de reprendre la route."],
            // 8
            ['question' => "Que représente une ligne blanche continue au milieu de la route ?",
             'option_a' => "Possibilité de dépasser si la voie est libre", 'option_b' => "Obligation de s'arrêter", 'option_c' => "Interdiction de franchir ou de dépasser", 'option_d' => "Fin de chaussée",
             'correct_answer' => 'c',
             'explication' => "La ligne continue est infranchissable, elle interdit tout dépassement ou changement de voie."],
            // 9
            ['question' => "Quand doit-on obligatoirement utiliser les feux de croisement (codes) ?",
             'option_a' => "Seulement la nuit", 'option_b' => "La nuit et par mauvaise visibilité (brouillard, pluie forte)", 'option_c' => "Uniquement en ville", 'option_d' => "Jamais en plein jour",
             'correct_answer' => 'b',
             'explication' => "Les feux de croisement sont obligatoires la nuit et dès que la visibilité est insuffisante."],
            // 10
            ['question' => "La règle de priorité à droite s'applique :",
             'option_a' => "Toujours sur toutes les routes", 'option_b' => "Uniquement sur autoroute", 'option_c' => "Dans les carrefours sans signalisation particulière", 'option_d' => "Seulement dans les zones 30",
             'correct_answer' => 'c',
             'explication' => "Dans un carrefour non réglementé, tout conducteur doit céder le passage au véhicule venant de sa droite."],
            // 11
            ['question' => "Un feu rouge clignotant signifie :",
             'option_a' => "Passer sans ralentir", 'option_b' => "Ralentir légèrement et continuer", 'option_c' => "Arrêt obligatoire, ne passer que si la voie est libre", 'option_d' => "Accélérer pour franchir l'intersection",
             'correct_answer' => 'c',
             'explication' => "Le feu rouge clignotant impose un arrêt obligatoire. Le passage n'est autorisé que si la voie est libre."],
            // 12
            ['question' => "La ceinture de sécurité est :",
             'option_a' => "Obligatoire uniquement sur autoroute", 'option_b' => "Obligatoire pour le conducteur seulement", 'option_c' => "Obligatoire pour tous les occupants du véhicule", 'option_d' => "Facultative en ville",
             'correct_answer' => 'c',
             'explication' => "Le port de la ceinture de sécurité est obligatoire pour tous les occupants, à tout moment."],
            // 13
            ['question' => "La distance de sécurité minimale derrière un véhicule à 100 km/h est d'environ :",
             'option_a' => "20 mètres", 'option_b' => "30 mètres", 'option_c' => "50 mètres", 'option_d' => "80 mètres",
             'correct_answer' => 'c',
             'explication' => "La distance de sécurité correspond à la distance parcourue en 2 secondes, soit environ 50 m à 100 km/h."],
            // 14
            ['question' => "Le dépassement est strictement interdit :",
             'option_a' => "Sur les lignes droites en rase campagne", 'option_b' => "Dans les virages, au sommet des côtes et aux passages à niveau", 'option_c' => "En ville uniquement", 'option_d' => "Sur les routes à deux voies de circulation",
             'correct_answer' => 'b',
             'explication' => "Le dépassement est dangereux et interdit dans les virages, au sommet des côtes et aux passages à niveau."],
            // 15
            ['question' => "Quel est le taux d'alcoolémie maximal autorisé au volant au Maroc ?",
             'option_a' => "0,0 g/L de sang", 'option_b' => "0,2 g/L de sang", 'option_c' => "0,5 g/L de sang", 'option_d' => "0,8 g/L de sang",
             'correct_answer' => 'b',
             'explication' => "Le Code de la Route marocain fixe la limite d'alcoolémie à 0,2 g/L de sang, plus stricte que dans beaucoup de pays."],
            // 16
            ['question' => "Les piétons engagés sur un passage piéton ont :",
             'option_a' => "L'obligation de courir pour dégager la voie", 'option_b' => "La priorité absolue sur les véhicules", 'option_c' => "La même priorité que les véhicules", 'option_d' => "L'obligation d'attendre le feu vert",
             'correct_answer' => 'b',
             'explication' => "Tout conducteur doit impérativement céder la priorité aux piétons engagés sur un passage clouté."],
            // 17
            ['question' => "Le gyrophare bleu est réservé aux :",
             'option_a' => "Camions de livraison", 'option_b' => "Taxis", 'option_c' => "Véhicules prioritaires (police, ambulance, pompiers)", 'option_d' => "Véhicules de travaux",
             'correct_answer' => 'c',
             'explication' => "Seuls les véhicules d'urgence (police, gendarmerie, ambulance, pompiers) sont autorisés à utiliser le gyrophare bleu."],
            // 18
            ['question' => "Par temps de pluie, la vitesse maximale sur autoroute est réduite à :",
             'option_a' => "80 km/h", 'option_b' => "100 km/h", 'option_c' => "110 km/h", 'option_d' => "La vitesse n'est pas modifiée",
             'correct_answer' => 'b',
             'explication' => "Par mauvaises conditions météo (pluie), la vitesse sur autoroute est réduite à 100 km/h."],
            // 19
            ['question' => "Un feu orange (jaune) fixe signifie :",
             'option_a' => "Continuer à la même vitesse", 'option_b' => "Accélérer pour passer avant le rouge", 'option_c' => "S'arrêter si possible sans freinage brusque", 'option_d' => "Passer lentement",
             'correct_answer' => 'c',
             'explication' => "Le feu orange annonce le passage au rouge. Il faut s'arrêter si cela est possible sans danger."],
            // 20
            ['question' => "La signalisation temporaire de chantier :",
             'option_a' => "Est moins importante que la signalisation permanente", 'option_b' => "Peut être ignorée si la route semble dégagée", 'option_c' => "Prévaut sur la signalisation permanente", 'option_d' => "N'est pas obligatoire",
             'correct_answer' => 'c',
             'explication' => "La signalisation temporaire (chantier, travaux) est prioritaire sur la signalisation permanente."],
            // 21
            ['question' => "Le temps de réaction moyen d'un conducteur est d'environ :",
             'option_a' => "0,5 seconde", 'option_b' => "1 seconde", 'option_c' => "2 secondes", 'option_d' => "3 secondes",
             'correct_answer' => 'b',
             'explication' => "Le temps de réaction moyen est d'environ 1 seconde. Il augmente avec la fatigue ou l'alcool."],
            // 22
            ['question' => "En cas de panne sur autoroute, que doit-on faire en priorité ?",
             'option_a' => "Rester dans le véhicule sur la voie de circulation", 'option_b' => "Allumer les feux de détresse et placer le triangle de signalisation", 'option_c' => "Continuer à rouler lentement jusqu'à la prochaine sortie", 'option_d' => "Téléphoner depuis la voie rapide",
             'correct_answer' => 'b',
             'explication' => "En cas de panne, activer les feux de détresse, sortir du véhicule par la droite et placer le triangle de signalisation."],
            // 23
            ['question' => "L'angle mort d'un véhicule est :",
             'option_a' => "La zone visible dans les rétroviseurs", 'option_b' => "La zone non visible par les rétroviseurs", 'option_c' => "Le champ de vision direct devant le véhicule", 'option_d' => "La zone couverte par le pare-brise",
             'correct_answer' => 'b',
             'explication' => "L'angle mort est une zone non couverte par les rétroviseurs. Il faut tourner la tête avant de changer de voie."],
            // 24
            ['question' => "Le panneau 'Cédez le passage' (triangle inversé) signifie :",
             'option_a' => "Arrêt absolu obligatoire", 'option_b' => "Passage totalement interdit", 'option_c' => "Laisser la priorité aux usagers de la voie croisée", 'option_d' => "Fin de zone prioritaire",
             'correct_answer' => 'c',
             'explication' => "Ce panneau impose de céder le passage aux véhicules circulant sur la voie que l'on va croiser."],
            // 25
            ['question' => "Dans un tunnel, que doit-on faire ?",
             'option_a' => "Éteindre les feux pour ne pas éblouir", 'option_b' => "Allumer les feux de croisement", 'option_c' => "Utiliser les feux de route (pleins phares)", 'option_d' => "Rouler sans feux si le tunnel est éclairé",
             'correct_answer' => 'b',
             'explication' => "Dans un tunnel, les feux de croisement sont obligatoires, même si le tunnel est éclairé."],
            // 26
            ['question' => "La 'Zone 30' indique :",
             'option_a' => "Une vitesse minimale de 30 km/h", 'option_b' => "Un stationnement de 30 minutes maximum", 'option_c' => "Une vitesse maximale de 30 km/h", 'option_d' => "Une distance minimale de 30 mètres",
             'correct_answer' => 'c',
             'explication' => "La Zone 30 est une zone urbaine où la vitesse maximale autorisée est de 30 km/h."],
            // 27
            ['question' => "Les feux de route (pleins phares) sont interdits :",
             'option_a' => "Sur autoroute la nuit", 'option_b' => "En agglomération uniquement", 'option_c' => "Face à un véhicule venant en sens inverse ou qu'on suit de près", 'option_d' => "Par temps de brouillard",
             'correct_answer' => 'c',
             'explication' => "Il faut passer en feux de croisement dès qu'un véhicule arrive en face ou qu'on en suit un de près pour ne pas éblouir."],
            // 28
            ['question' => "L'alcool au volant :",
             'option_a' => "Améliore la concentration à faible dose", 'option_b' => "N'a aucun effet sur la conduite", 'option_c' => "Augmente le temps de réaction et réduit la vigilance", 'option_d' => "Est interdit seulement la nuit",
             'correct_answer' => 'c',
             'explication' => "L'alcool ralentit les réflexes, diminue la vision et altère le jugement, même à faible dose."],
            // 29
            ['question' => "Pour prévenir la fatigue au volant, il est recommandé :",
             'option_a' => "De boire du café et de continuer", 'option_b' => "De faire une pause d'au moins 15 minutes toutes les 2 heures", 'option_c' => "D'accélérer pour terminer le trajet plus vite", 'option_d' => "D'écouter la musique fort",
             'correct_answer' => 'b',
             'explication' => "Une pause de 15 à 20 minutes toutes les 2 heures est indispensable pour lutter contre la fatigue."],
            // 30
            ['question' => "Où est-il interdit de stationner ?",
             'option_a' => "Sur les routes nationales en dehors des villes", 'option_b' => "Sur les passages piétons et devant les bouches d'incendie", 'option_c' => "Sur les parkings payants sans ticket", 'option_d' => "À plus de 5 m d'un carrefour",
             'correct_answer' => 'b',
             'explication' => "Stationner sur un passage piéton ou devant une bouche d'incendie est strictement interdit."],
            // 31
            ['question' => "L'utilisation du téléphone tenu en main en conduisant est :",
             'option_a' => "Autorisée si on s'arrête au feu rouge", 'option_b' => "Autorisée à vitesse réduite", 'option_c' => "Strictement interdite", 'option_d' => "Autorisée sur autoroute",
             'correct_answer' => 'c',
             'explication' => "Tenir son téléphone en main en conduisant est interdit et passible d'amende et de retrait de permis."],
            // 32
            ['question' => "Une ligne jaune continue peinte sur le bord de la chaussée signifie :",
             'option_a' => "Stationnement autorisé 30 minutes", 'option_b' => "Interdiction de stationner", 'option_c' => "Voie réservée aux bus", 'option_d' => "Fin de zone de travaux",
             'correct_answer' => 'b',
             'explication' => "Une ligne jaune continue sur le côté de la route indique l'interdiction totale de stationner."],
            // 33
            ['question' => "Les enfants de moins de 10 ans doivent voyager :",
             'option_a' => "À l'avant avec coussin de siège", 'option_b' => "À l'arrière dans un siège homologué adapté à leur taille", 'option_c' => "Sans ceinture si le trajet est court", 'option_d' => "Debout entre les sièges arrière",
             'correct_answer' => 'b',
             'explication' => "Les enfants de moins de 10 ans doivent impérativement voyager à l'arrière dans un siège auto homologué."],
            // 34
            ['question' => "Le clignotant doit être actionné :",
             'option_a' => "Juste au moment de tourner", 'option_b' => "Uniquement sur route", 'option_c' => "Suffisamment à l'avance avant tout changement de direction ou dépassement", 'option_d' => "Seulement la nuit",
             'correct_answer' => 'c',
             'explication' => "Le clignotant doit être mis suffisamment à l'avance pour prévenir les autres usagers de vos intentions."],
            // 35
            ['question' => "Sur une route à deux voies de circulation de sens opposés, le dépassement est autorisé :",
             'option_a' => "Jamais", 'option_b' => "Uniquement à droite", 'option_c' => "En ligne droite, avec bonne visibilité et absence de ligne continue", 'option_d' => "Seulement la nuit",
             'correct_answer' => 'c',
             'explication' => "Le dépassement est permis uniquement sur une ligne droite avec bonne visibilité et sans ligne blanche continue."],
            // 36
            ['question' => "Le port du casque est obligatoire pour :",
             'option_a' => "Les conducteurs de camions", 'option_b' => "Les motocyclistes et leurs passagers", 'option_c' => "Tous les usagers de la route", 'option_d' => "Les cyclistes uniquement",
             'correct_answer' => 'b',
             'explication' => "Le casque homologué est obligatoire pour tout conducteur ou passager de moto, mobylette ou scooter."],
        ];

        foreach ($questions as $q) {
            Question::updateOrCreate(
                ['question' => $q['question']],
                $q + ['categorie' => 'code_route']
            );
        }
    }
}
