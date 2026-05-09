<?php
// EMPLACEMENT : backend/app/Mail/ReponseContact.php
// (créez le dossier app/Mail/ s'il n'existe pas)

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReponseContact extends Mailable
{
    use Queueable, SerializesModels;

    public ContactMessage $msg;
    public string $reponse;

    public function __construct(ContactMessage $msg, string $reponse)
    {
        $this->msg     = $msg;
        $this->reponse = $reponse;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Réponse à votre message — Auto École Narjiss',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reponse_contact',
        );
    }
}