<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use Inertia\Inertia;
use Inertia\Response;

class ResultController extends Controller
{
    public function show(string $hash): Response
    {
        $receipt = Receipt::where('hash', $hash)->firstOrFail();

        $data = [
            'image' => '/storage/' . $receipt->image,
            'date' => $receipt->date,
            'result_json' => $receipt->result_json,
        ];

        return Inertia::render('result', ['data' => $data]);
    }
}