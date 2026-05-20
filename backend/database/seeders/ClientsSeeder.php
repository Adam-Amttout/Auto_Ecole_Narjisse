<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class ClientsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $password = Hash::make('password123');

        $clients = [
            ['nom' => 'Benali',    'prenom' => 'Youssef',  'email' => 'youssef.benali@gmail.com',    'role' => 'user'],
            ['nom' => 'El Amrani', 'prenom' => 'Fatima',   'email' => 'fatima.elamrani@gmail.com',   'role' => 'user'],
            ['nom' => 'Tazi',      'prenom' => 'Mehdi',    'email' => 'mehdi.tazi@outlook.com',      'role' => 'user'],
            ['nom' => 'Bennani',   'prenom' => 'Sara',     'email' => 'sara.bennani@gmail.com',      'role' => 'user'],
            ['nom' => 'Idrissi',   'prenom' => 'Karim',    'email' => 'karim.idrissi@yahoo.fr',      'role' => 'user'],
            ['nom' => 'Alaoui',    'prenom' => 'Nadia',    'email' => 'nadia.alaoui@gmail.com',      'role' => 'user'],
            ['nom' => 'Chraibi',   'prenom' => 'Omar',     'email' => 'omar.chraibi@hotmail.com',    'role' => 'user'],
            ['nom' => 'Fassi',     'prenom' => 'Leila',    'email' => 'leila.fassi@gmail.com',       'role' => 'user'],
            ['nom' => 'Ouazzani',  'prenom' => 'Amine',    'email' => 'amine.ouazzani@gmail.com',    'role' => 'user'],
            ['nom' => 'Berrada',   'prenom' => 'Hanane',   'email' => 'hanane.berrada@outlook.com',  'role' => 'user'],
            ['nom' => 'Sqalli',    'prenom' => 'Rachid',   'email' => 'rachid.sqalli@gmail.com',     'role' => 'user'],
            ['nom' => 'Hajji',     'prenom' => 'Zineb',    'email' => 'zineb.hajji@gmail.com',       'role' => 'user'],
            ['nom' => 'Kettani',   'prenom' => 'Ayoub',    'email' => 'ayoub.kettani@yahoo.fr',      'role' => 'user'],
            ['nom' => 'Lahlou',    'prenom' => 'Imane',    'email' => 'imane.lahlou@gmail.com',      'role' => 'user'],
            ['nom' => 'Belhaj',    'prenom' => 'Hamza',    'email' => 'hamza.belhaj@gmail.com',      'role' => 'user'],
        ];

        foreach ($clients as $c) {
            DB::table('clients')->updateOrInsert(
                ['email' => $c['email']],
                [
                    'nom'          => $c['nom'],
                    'prenom'       => $c['prenom'],
                    'password'     => $password,
                    'role'         => $c['role'],
                    'photo_profil' => null,
                    'created_at'   => $now->copy()->subDays(rand(10, 90)),
                    'updated_at'   => $now,
                ]
            );
        }

        $this->command->info('  ✅ 15 clients insérés');
    }
}
