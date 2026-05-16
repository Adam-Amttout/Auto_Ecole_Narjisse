<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DossierAdministratif extends Model
{
    protected $table = 'dossiers_administratifs';

    protected $fillable = [
        'client_id',
        'visite_medicale',
        'dossier_depose',
        'exam_theorique_programme',
        'exam_pratique_programme',
        'permis_pret',
        'notes_admin',
    ];

    protected $casts = [
        'visite_medicale'           => 'boolean',
        'dossier_depose'            => 'boolean',
        'exam_theorique_programme'  => 'boolean',
        'exam_pratique_programme'   => 'boolean',
        'permis_pret'               => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function documents()
    {
        return $this->hasMany(DocumentDossier::class, 'client_id', 'client_id');
    }

    // Calcule le pourcentage de progression du dossier
    public function getProgressionAttribute(): int
    {
        $steps = [
            $this->visite_medicale,
            $this->dossier_depose,
            $this->exam_theorique_programme,
            $this->exam_pratique_programme,
            $this->permis_pret,
        ];
        $completed = count(array_filter($steps));
        return (int) round(($completed / count($steps)) * 100);
    }
}
