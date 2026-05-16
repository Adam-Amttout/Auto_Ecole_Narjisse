<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamResult extends Model
{
    protected $fillable = [
        'client_id', 'score', 'total', 'duree_secondes', 'reussi', 'detail_categories'
    ];

    protected $casts = [
        'detail_categories' => 'array',
        'reussi' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
