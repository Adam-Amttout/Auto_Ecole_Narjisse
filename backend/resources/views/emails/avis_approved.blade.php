<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #e63946, #ff6b6b); padding: 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .content { padding: 30px; }
        .content h2 { color: #1e3557; margin-top: 0; }
        .quote { background: #f1f5f9; border-left: 4px solid #e63946; padding: 15px; margin: 20px 0; font-style: italic; color: #475569; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        .btn { display: inline-block; padding: 12px 25px; background: #e63946; color: white !important; text-decoration: none; border-radius: 30px; font-weight: 700; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Auto École Narjisse</h1>
        </div>
        <div class="content">
            <h2>Bonjour {{ $avis->prenom }} !</h2>
            <p>Bonne nouvelle ! Votre avis vient d'être validé par notre équipe et est désormais visible sur notre site internet.</p>
            
            <p>Nous vous remercions chaleureusement pour votre retour d'expérience :</p>
            
            <div class="quote">
                "{{ $avis->texte }}"
            </div>
            
            <p>Votre satisfaction est notre plus grande réussite. Grâce à vous, d'autres futurs conducteurs pourront nous faire confiance.</p>
            
            <a href="{{ config('app.url') }}" class="btn">Voir mon avis sur le site</a>
            
            <p style="margin-top: 30px;">À très bientôt sur la route !</p>
            <p><strong>L'équipe Auto École Narjisse</strong></p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Auto École Narjisse Marrakech. Tous droits réservés.
        </div>
    </div>
</body>
</html>
