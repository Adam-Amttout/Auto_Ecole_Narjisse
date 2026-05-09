<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réponse Auto École Narjiss</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fa; color: #1e293b; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #e63946 0%, #c1121f 100%); padding: 36px 40px 28px; text-align: center; }
    .logo-circle { width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; color: #fff; margin-bottom: 14px; }
    .header h1 { color: #fff; font-size: 22px; font-weight: 700; margin-bottom: 4px; }
    .header p { color: rgba(255,255,255,0.82); font-size: 13.5px; }
    .body { padding: 36px 40px; }
    .greeting { font-size: 17px; font-weight: 600; margin-bottom: 10px; color: #1e293b; }
    .intro { font-size: 14px; color: #475569; line-height: 1.7; margin-bottom: 24px; }
    .original-box { background: #f8fafc; border-left: 4px solid #e2e8f0; border-radius: 0 10px 10px 0; padding: 16px 20px; margin-bottom: 24px; }
    .original-box .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 8px; }
    .original-box .text { font-size: 13.5px; color: #64748b; line-height: 1.6; font-style: italic; }
    .reply-box { background: #fff7f7; border: 1.5px solid #fecaca; border-radius: 12px; padding: 22px 24px; margin-bottom: 28px; }
    .reply-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #e63946; margin-bottom: 10px; }
    .reply-text { font-size: 14.5px; color: #1e293b; line-height: 1.75; white-space: pre-wrap; }
    .divider { border: none; border-top: 1px solid #f1f5f9; margin: 24px 0; }
    .outro { font-size: 13.5px; color: #475569; line-height: 1.7; margin-bottom: 10px; }
    .cta { text-align: center; margin: 28px 0 8px; }
    .cta a { background: linear-gradient(135deg, #e63946, #c1121f); color: #fff; text-decoration: none; padding: 13px 32px; border-radius: 30px; font-size: 14px; font-weight: 600; display: inline-block; }
    .footer { background: #f8fafc; padding: 22px 40px; text-align: center; border-top: 1px solid #f1f5f9; }
    .footer p { font-size: 12px; color: #94a3b8; line-height: 1.8; }
    .footer .school-name { font-weight: 700; color: #64748b; }
    @media (max-width: 620px) {
      .body, .footer { padding: 24px 20px; }
      .header { padding: 28px 20px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">

    <!-- EN-TÊTE -->
    <div class="header">
      <div class="logo-circle">N</div>
      <h1>Auto École Narjiss</h1>
      <p>Marrakech — Formation au permis de conduire</p>
    </div>

    <!-- CORPS -->
    <div class="body">

      <p class="greeting">Bonjour {{ $msg->prenom }} {{ $msg->nom }},</p>

      <p class="intro">
        Merci pour votre message. Notre équipe a pris le temps de vous lire
        et vous répond personnellement ci-dessous.
      </p>

      <!-- Message original du client -->
      <div class="original-box">
        <div class="label">📩 Votre message</div>
        @if($msg->sujet)
          <p style="font-size:12px;color:#94a3b8;margin-bottom:6px;">Sujet : {{ $msg->sujet }}</p>
        @endif
        <div class="text">{{ $msg->message }}</div>
      </div>

      <!-- Réponse de l'admin -->
      <div class="reply-box">
        <div class="reply-label">💬 Notre réponse</div>
        <div class="reply-text">{{ $reponse }}</div>
      </div>

      <hr class="divider">

      <p class="outro">
        Si cette réponse ne satisfait pas complètement votre demande ou si vous avez
        d'autres questions, n'hésitez pas à nous recontacter. Nous sommes disponibles
        du <strong>lundi au vendredi de 8h à 19h</strong> et le
        <strong>samedi de 9h à 13h</strong>.
      </p>

      <div class="cta">
        <a href="mailto:contact@autoecole-narjiss.ma">Nous écrire à nouveau</a>
      </div>

    </div>

    <!-- PIED DE PAGE -->
    <div class="footer">
      <p>
        <span class="school-name">Auto École Narjiss</span><br>
        Allal Elfassi, Marrakech, Maroc<br>
        📞 +212 524 303 811 &nbsp;|&nbsp; +212 698 837 698<br>
        ✉️ contact@autoecole-narjiss.ma
      </p>
      <p style="margin-top: 12px; font-size: 11px; color: #cbd5e1;">
        Cet email est une réponse automatique à votre formulaire de contact.<br>
        Vous recevez ce message car vous avez contacté Auto École Narjiss.
      </p>
    </div>

  </div>
</body>
</html>