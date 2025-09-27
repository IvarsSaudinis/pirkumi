<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use Gemini\Data\Blob;
use Gemini\Data\GenerationConfig;
use Gemini\Data\Schema;
use Gemini\Enums\DataType;
use Gemini\Enums\MimeType;
use Gemini\Enums\ResponseMimeType;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReceiptController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $receipt = new Receipt();
        $receipt->image = $request->get('receipt_image');
        $receipt->hash = uniqid('id_', true);
        $receipt->date = now();
        $receipt->result_json = '{}';

        $base64Image = $request->get('receipt_image');

        if ($base64Image) {
            $imageData = explode(',', $base64Image)[1] ?? $base64Image;
            $image = base64_decode($imageData);
            $fileName = 'receipts/' . uniqid('image_') . '.jpg';
            Storage::disk('public')->put($fileName, $image);
            $receipt->image = $fileName;
        }
        
        $receipt->save();

        $result = Gemini::generativeModel(model: 'gemini-flash-lite-latest')
            ->withGenerationConfig(
                generationConfig: new GenerationConfig(
                    responseMimeType: ResponseMimeType::APPLICATION_JSON,
                    responseSchema: new Schema(
                        type: DataType::ARRAY,
                        items: new Schema(
                            type: DataType::OBJECT,
                            properties: [
                                'is_receipt' => new Schema(type: DataType::BOOLEAN),
                                'retailer_name' => new Schema(type: DataType::STRING),
                                'retailer_address' => new Schema(type: DataType::STRING),
                                'products' => new Schema(
                                    type: DataType::ARRAY,
                                    items: new Schema(
                                        type: DataType::OBJECT,
                                        properties: [
                                            'name' => new Schema(type: DataType::STRING),
                                            'quantity' => new Schema(type: DataType::NUMBER),
                                            'price' => new Schema(type: DataType::NUMBER),
                                            'price_per_unit' => new Schema(type: DataType::NUMBER),
                                            'total_price' => new Schema(type: DataType::NUMBER),
                                            'discount_price' => new Schema(type: DataType::NUMBER),
                                            'category' => new Schema(type: DataType::STRING),
                                            'brand' => new Schema(type: DataType::STRING),
                                        ],
                                        required: ['name', 'price', 'price_per_unit', 'discount_price', 'category', 'brand'],
                                    ))
                            ],
                            required: ['retailer_name', 'retailer_address', 'products'],
                        )
                    )
                )
            )
            ->generateContent([
                'What is the content of this receipt?',
                new Blob(
                    mimeType: MimeType::IMAGE_JPEG,
                    data: base64_encode(
                        file_get_contents(Storage::disk('public')->path($receipt->image))
                    )
                )
            ]);

        $receipt->result_json = $result->text();
        $receipt->save();

        return to_route('results', ['hash' => $receipt->hash]);
    }
}