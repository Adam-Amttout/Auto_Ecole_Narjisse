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

    // ✅ RÈGLE : UN SEUL ÉLÈVE PAR CRÉNEAU
    const MAX_ELEVES_PAR_CRENEAU = 1;

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
     * Vérifie si le véhicule est disponible sur ce créneau.
     * ✅ Règle : un seul élève par créneau → indisponible dès qu'il y a 1 séance active.
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

        return $query->count() < self::MAX_ELEVES_PAR_CRENEAU;
    }

    /**
     * Retourne le nombre de places restantes (0 ou 1).
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