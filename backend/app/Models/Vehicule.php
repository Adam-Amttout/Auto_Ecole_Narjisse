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
     * Vérifie si le véhicule est libre sur un créneau.
     */
    public function estDisponible(string $date, string $heureDebut, string $heureFin, ?int $excludeId = null): bool
    {
        if ($this->disponibilite !== 'disponible') {
            return false;
        }

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