<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    protected $fillable = [
        'marque',
        'modele',
        'immatriculation',
        'disponibilite',
    ];

    const MAX_ELEVES_PAR_CRENEAU = 3;

    /** Relation : un véhicule a plusieurs séances */
    public function seances()
    {
        return $this->hasMany(SeanceConduite::class, 'vehicule_id');
    }

    /** Attribut calculé : libellé complet */
    public function getLibelleAttribute(): string
    {
        return "{$this->marque} {$this->modele} ({$this->immatriculation})";
    }

    /**
     * Vérifie si le véhicule peut encore accepter un élève sur ce créneau.
     * Un véhicule peut transporter au maximum MAX_ELEVES_PAR_CRENEAU élèves simultanément.
     * On exclut la séance $excludeId pour permettre la modification.
     */
    public function estDisponible(string $date, string $heureDebut, string $heureFin, ?int $excludeId = null): bool
    {
        // Véhicule hors service ou en maintenance → indisponible
        if ($this->disponibilite !== 'disponible') {
            return false;
        }

        $query = $this->seances()
            ->where('date', $date)
            ->where('statut', '!=', 'annulee')
            ->where('heure_debut', '<', $heureFin)
            ->where('heure_fin',   '>', $heureDebut);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        // Le véhicule est disponible si le nombre de réservations < MAX
        return $query->count() < self::MAX_ELEVES_PAR_CRENEAU;
    }

    /**
     * Retourne le nombre de places restantes dans le véhicule sur ce créneau.
     */
    public function placesRestantes(string $date, string $heureDebut, string $heureFin, ?int $excludeId = null): int
    {
        if ($this->disponibilite !== 'disponible') {
            return 0;
        }

        $query = $this->seances()
            ->where('date', $date)
            ->where('statut', '!=', 'annulee')
            ->where('heure_debut', '<', $heureFin)
            ->where('heure_fin',   '>', $heureDebut);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return max(0, self::MAX_ELEVES_PAR_CRENEAU - $query->count());
    }
}