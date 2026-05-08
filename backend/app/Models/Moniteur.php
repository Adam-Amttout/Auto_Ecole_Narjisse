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
     * Vérifie si le moniteur est libre sur un créneau.
     * On exclut la séance $excludeId pour permettre la modification.
     */
    public function estDisponible(string $date, string $heureDebut, string $heureFin, ?int $excludeId = null): bool
    {
        $query = $this->seances()
            ->where('date', $date)
            ->where('statut', '!=', 'annulee')
            ->where('heure_debut', '<', $heureFin)
            ->where('heure_fin', '>', $heureDebut);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->count() === 0;
    }
}