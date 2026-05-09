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

    const MAX_ELEVES_PAR_CRENEAU = 3;

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
     * Vérifie si le moniteur peut encore accepter un élève sur ce créneau.
     * Un moniteur peut avoir au maximum MAX_ELEVES_PAR_CRENEAU élèves simultanément.
     * On exclut la séance $excludeId pour permettre la modification.
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

        // Le moniteur est disponible si le nombre d'élèves sur ce créneau < MAX
        return $query->count() < self::MAX_ELEVES_PAR_CRENEAU;
    }

    /**
     * Retourne le nombre de places restantes sur un créneau.
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