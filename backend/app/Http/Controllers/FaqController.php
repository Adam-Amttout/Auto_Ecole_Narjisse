<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FaqController extends Controller
{
    /** Transforme le chemin stocké en URL accessible */
    private function withImageUrl(Faq $faq): Faq
    {
        if ($faq->image) {
            $faq->image = asset('storage/' . $faq->image);
        }
        return $faq;
    }

    /** GET /api/faq — public : FAQ actives triées */
    public function index()
    {
        return response()->json(
            Faq::where('actif', true)
                ->orderBy('ordre')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($f) => $this->withImageUrl($f))
        );
    }

    /** GET /api/faq/all — admin : toutes les FAQ */
    public function all()
    {
        return response()->json(
            Faq::orderBy('ordre')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($f) => $this->withImageUrl($f))
        );
    }

    /**
     * POST /api/faq — admin : créer une FAQ
     * Accepte multipart/form-data avec un fichier image optionnel
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'question' => 'required|string|max:500',
            'reponse'  => 'required|string|max:2000',
            'image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:3072',
            'ordre'    => 'nullable|integer|min:0',
            'actif'    => 'nullable',
        ]);

        $imagePath = null;
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $imagePath = $request->file('image')->store('faqs', 'public');
        }

        $faq = Faq::create([
            'question' => $data['question'],
            'reponse'  => $data['reponse'],
            'image'    => $imagePath,
            'ordre'    => $data['ordre'] ?? 0,
            'actif'    => filter_var($request->input('actif', true), FILTER_VALIDATE_BOOLEAN),
        ]);

        return response()->json([
            'message' => 'FAQ créée avec succès.',
            'data'    => $this->withImageUrl($faq),
        ], 201);
    }

    /**
     * POST /api/faq/{id}  (avec _method=PUT dans le body)
     * Laravel method-spoofing pour accepter multipart/form-data en "PUT"
     */
    public function update(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);

        $data = $request->validate([
            'question' => 'sometimes|required|string|max:500',
            'reponse'  => 'sometimes|required|string|max:2000',
            'image'    => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:3072',
            'ordre'    => 'nullable|integer|min:0',
            'actif'    => 'nullable',
        ]);

        // Champs texte
        if (isset($data['question'])) $faq->question = $data['question'];
        if (isset($data['reponse']))  $faq->reponse  = $data['reponse'];
        if (isset($data['ordre']))    $faq->ordre    = $data['ordre'];
        if ($request->has('actif'))   $faq->actif    = filter_var($request->input('actif'), FILTER_VALIDATE_BOOLEAN);

        // Remplacement de l'image
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            // Supprimer l'ancienne image
            if ($faq->getOriginal('image') && Storage::disk('public')->exists($faq->getOriginal('image'))) {
                Storage::disk('public')->delete($faq->getOriginal('image'));
            }
            $faq->image = $request->file('image')->store('faqs', 'public');
        }

        $faq->save();

        return response()->json([
            'message' => 'FAQ mise à jour.',
            'data'    => $this->withImageUrl($faq),
        ]);
    }

    /** DELETE /api/faq/{id} — admin : supprimer FAQ + image */
    public function destroy($id)
    {
        $faq = Faq::findOrFail($id);

        if ($faq->image && Storage::disk('public')->exists($faq->image)) {
            Storage::disk('public')->delete($faq->image);
        }
        $faq->delete();

        return response()->json(['message' => 'FAQ supprimée.']);
    }
}