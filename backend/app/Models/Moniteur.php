<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Moniteur extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'email',
        'actif',
    ];

    protected $casts = [
        'actif' => 'boolean',
    ];

    // ✅ RÈGLE : UN SEUL ÉLÈVE PAR CRÉNEAU (séance de 30 minutes, exclusivité totale)
    const MAX_ELEVES_PAR_CRENEAU = 1;

    /** Relation : un moniteur a plusieurs séances */
    public function seances()
    {
        return $this->hasMany(SeanceConduite::class, 'moniteur_id');
    }

    /** Attribut calculé : nom complet */
    public function getNomCompletAttribute(): string
    {
        return "{$this->prenom} {$this->nom}";
    }

    /**
     * Vérifie si le moniteur est disponible sur ce créneau.
     * ✅ Règle : un seul élève par créneau → le moniteur est indisponible
     * dès qu'il a 1 séance active sur ce créneau.
     */
    public function estDisponible(string $date, string $heureDebut, string $heureFin, ?int $excludeId = null): bool
    {
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
     * Retourne le nombre de places restantes sur un créneau (0 ou 1).
     */
    public function placesRestantes(string $date, string $heureDebut, string $heureFin, ?int $excludeId = null): int
    {
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