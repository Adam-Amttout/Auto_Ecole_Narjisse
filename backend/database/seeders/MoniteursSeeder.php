<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MoniteursSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $moniteurs = [
            ['nom' => 'Filali',    'prenom' => 'Hassan',   'telephone' => '0661234567', 'email' => 'hassan.filali@narjiss.ma',   'actif' => true],
            ['nom' => 'Mansouri',  'prenom' => 'Khalid',   'telephone' => '0662345678', 'email' => 'khalid.mansouri@narjiss.ma', 'actif' => true],
            ['nom' => 'Bouazza',   'prenom' => 'Rachida',  'telephone' => '0663456789', 'email' => 'rachida.bouazza@narjiss.ma', 'actif' => true],
            ['nom' => 'Ziani',     'prenom' => 'Mustapha', 'telephone' => '0664567890', 'email' => 'mustapha.ziani@narjiss.ma',  'actif' => true],
            ['nom' => 'El Fassi',  'prenom' => 'Samira',   'telephone' => '0665678901', 'email' => 'samira.elfassi@narjiss.ma',  'actif' => false],
        ];

        foreach ($moniteurs as $m) {
            DB::table('moniteurs')->updateOrInsert(
                ['email' => $m['email']],
                [
                    'nom'        => $m['nom'],
                    'prenom'     => $m['prenom'],
                    'telephone'  => $m['telephone'],
                    'actif'      => $m['actif'],
                    'created_at' => $now->copy()->subDays(rand(30, 180)),
                    'updated_at' => $now,
                ]
            );
        }

        $this->command->info('  ✅ 5 moniteurs insérés');
    }
}
