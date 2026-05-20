<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ExamResultsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $clientIds = DB::table('clients')->where('role', 'user')->pluck('id')->toArray();

        if (empty($clientIds)) {
            $this->command->warn('  ⚠️ Pas de clients, exam_results non insérés.');
            return;
        }

        $categories = ['danger', 'indication', 'interdiction', 'code_route', 'conduite'];

        $results = [];
        foreach ($clientIds as $i => $clientId) {
            // Chaque client passe 1 à 3 examens blancs
            $nbExams = rand(1, 3);
            for ($j = 0; $j < $nbExams; $j++) {
                $score = rand(25, 40);
                $total = 40;
                $reussi = $score >= 35;

                // Générer détails par catégorie
                $detail = [];
                $remaining = $score;
                foreach ($categories as $k => $cat) {
                    $catTotal = ($k < 4) ? 8 : 8;
                    $catScore = ($k === count($categories) - 1)
                        ? min($remaining, $catTotal)
                        : min(rand(3, $catTotal), $remaining);
                    $remaining -= $catScore;
                    $detail[$cat] = ['score' => $catScore, 'total' => $catTotal];
                }

                $results[] = [
                    'client_id'          => $clientId,
                    'score'              => $score,
                    'total'              => $total,
                    'duree_secondes'     => rand(900, 2400),
                    'reussi'             => $reussi,
                    'detail_categories'  => json_encode($detail),
                    'created_at'         => $now->copy()->subDays(rand(1, 40)),
                    'updated_at'         => $now,
                ];
            }
        }

        DB::table('exam_results')->insert($results);
        $this->command->info('  ✅ ' . count($results) . ' résultats d\'examens insérés');
    }
}
