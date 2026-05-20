<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VehiculesSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $vehicules = [
            ['marque' => 'Dacia',    'modele' => 'Logan',       'immatriculation' => 'A-12345-31', 'disponibilite' => 'disponible'],
            ['marque' => 'Renault',  'modele' => 'Clio',        'immatriculation' => 'A-23456-31', 'disponibilite' => 'disponible'],
            ['marque' => 'Peugeot',  'modele' => '208',         'immatriculation' => 'A-34567-31', 'disponibilite' => 'disponible'],
            ['marque' => 'Dacia',    'modele' => 'Sandero',     'immatriculation' => 'A-45678-31', 'disponibilite' => 'en_maintenance'],
            ['marque' => 'Hyundai',  'modele' => 'i10',         'immatriculation' => 'A-56789-31', 'disponibilite' => 'disponible'],
            ['marque' => 'Fiat',     'modele' => 'Punto',       'immatriculation' => 'A-67890-31', 'disponibilite' => 'hors_service'],
            ['marque' => 'Renault',  'modele' => 'Symbol',      'immatriculation' => 'A-78901-31', 'disponibilite' => 'disponible'],
            ['marque' => 'Peugeot',  'modele' => '301',         'immatriculation' => 'A-89012-31', 'disponibilite' => 'disponible'],
        ];

        foreach ($vehicules as $v) {
            DB::table('vehicules')->updateOrInsert(
                ['immatriculation' => $v['immatriculation']],
                [
                    'marque'        => $v['marque'],
                    'modele'        => $v['modele'],
                    'disponibilite' => $v['disponibilite'],
                    'created_at'    => $now->copy()->subDays(rand(30, 365)),
                    'updated_at'    => $now,
                ]
            );
        }

        $this->command->info('  ✅ 8 véhicules insérés');
    }
}
