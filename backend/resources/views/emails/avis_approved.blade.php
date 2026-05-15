<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre avis est en ligne !</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
      background-color: #f0f4f8;
      color: #334155;
      line-height: 1.6;
    }
    .wrapper { max-width: 620px; margin: 30px auto; padding: 0 16px 40px; }

    /* ── HEADER ── */
    .email-header {
      background: linear-gradient(135deg, #1d3557 0%, #0f2744 100%);
      border-radius: 20px 20px 0 0;
      padding: 32px 40px 24px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .email-header::before {
      content: "";
      position: absolute;
      top: -60px; right: -60px;
      width: 200px; height: 200px;
      border-radius: 50%;
      background: rgba(230,57,70,0.15);
    }
    .email-header::after {
      content: "";
      position: absolute;
      bottom: -40px; left: -40px;
      width: 140px; height: 140px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
    }

    /* Logo badge */
    .logo-circle {
      width: 72px; height: 72px;
      background: linear-gradient(135deg, #e63946, #c1121f);
      border-radius: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      margin-bottom: 14px;
      box-shadow: 0 8px 24px rgba(230,57,70,0.4);
    }
    .brand-name {
      font-size: 22px;
      font-weight: 800;
      color: white;
      letter-spacing: -0.3px;
    }
    .brand-sub {
      font-size: 12px;
      color: rgba(255,255,255,0.5);
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 3px;
    }

    /* ── BANNER (étoiles) ── */
    .banner {
      background: linear-gradient(135deg, #e63946 0%, #c1121f 100%);
      padding: 24px 40px;
      text-align: center;
    }
    .banner-stars { font-size: 28px; letter-spacing: 4px; margin-bottom: 8px; }
    .banner-title {
      font-size: 20px;
      font-weight: 800;
      color: white;
    }
    .banner-sub {
      font-size: 13px;
      color: rgba(255,255,255,0.85);
      margin-top: 4px;
    }

    /* ── BODY ── */
    .email-body {
      background: white;
      padding: 36px 40px;
    }
    .greeting {
      font-size: 24px;
      font-weight: 700;
      color: #1d3557;
      margin-bottom: 14px;
    }
    .greeting span { color: #e63946; }
    .intro-text {
      font-size: 15px;
      color: #475569;
      margin-bottom: 28px;
    }

    /* ── AVIS CARD ── */
    .avis-card {
      background: linear-gradient(135deg, #fefce8, #fffbeb);
      border: 1.5px solid #fde68a;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 28px;
      position: relative;
    }
    .avis-card::before {
      content: '"';
      position: absolute;
      top: -10px; left: 16px;
      font-size: 60px;
      color: #fbbf24;
      font-family: Georgia, serif;
      line-height: 1;
    }
    .avis-stars {
      font-size: 20px;
      letter-spacing: 2px;
      margin-bottom: 12px;
    }
    .avis-texte {
      font-size: 15px;
      color: #374151;
      font-style: italic;
      line-height: 1.7;
      padding-top: 8px;
    }
    .avis-author {
      margin-top: 14px;
      font-size: 13px;
      font-weight: 700;
      color: #92400e;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* ── INFO BOX ── */
    .info-box {
      background: #f0fdf4;
      border-left: 4px solid #22c55e;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 28px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .info-icon { font-size: 22px; flex-shrink: 0; margin-top: 2px; }
    .info-text { font-size: 14px; color: #166534; }
    .info-text strong { font-weight: 700; }

    /* ── CTA BUTTON ── */
    .cta-wrap { text-align: center; margin-bottom: 32px; }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #e63946, #c1121f);
      color: white !important;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.3px;
      box-shadow: 0 6px 20px rgba(230,57,70,0.35);
    }

    /* ── DIVIDER ── */
    .divider { border: none; border-top: 1px solid #f1f5f9; margin: 24px 0; }

    /* ── FEATURES ── */
    .features { display: table; width: 100%; margin-bottom: 28px; }
    .feature-item {
      display: table-cell;
      text-align: center;
      padding: 16px 10px;
      vertical-align: top;
      width: 33.33%;
    }
    .feature-icon {
      width: 44px; height: 44px;
      background: #f1f5f9;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 8px;
    }
    .feature-label { font-size: 12px; font-weight: 600; color: #64748b; }

    /* ── SIGNATURE ── */
    .signature {
      background: #f8fafc;
      border-radius: 12px;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .sig-avatar {
      width: 48px; height: 48px;
      background: linear-gradient(135deg, #1d3557, #0f2744);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      flex-shrink: 0;
    }
    .sig-name { font-size: 14px; font-weight: 700; color: #1d3557; }
    .sig-role { font-size: 12px; color: #94a3b8; }

    /* ── FOOTER ── */
    .email-footer {
      background: #1d3557;
      border-radius: 0 0 20px 20px;
      padding: 24px 40px;
      text-align: center;
    }
    .footer-links { margin-bottom: 14px; }
    .footer-links a {
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      font-size: 12px;
      margin: 0 10px;
    }
    .footer-links a:hover { color: white; }
    .footer-copy { font-size: 11px; color: rgba(255,255,255,0.35); }
    .footer-addr { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 5px; }

    @media (max-width: 480px) {
      .email-header, .email-body, .banner { padding-left: 20px; padding-right: 20px; }
      .features { display: block; }
      .feature-item { display: block; width: 100%; padding: 8px; }
      .greeting { font-size: 20px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">

    {{-- ── HEADER ── --}}
    <div class="email-header">
      <div class="logo-circle">🚗</div>
      <div class="brand-name">Auto École Narjiss</div>
      <div class="brand-sub">Marrakech • Conduite & Code</div>
    </div>

    {{-- ── BANNER ── --}}
    <div class="banner">
      <div class="banner-stars">
        @for($i = 1; $i <= ($avis->note ?? 5); $i++) ⭐ @endfor
      </div>
      <div class="banner-title">🎉 Votre avis est maintenant en ligne !</div>
      <div class="banner-sub">Validé par notre équipe &nbsp;·&nbsp; Visible sur notre site</div>
    </div>

    {{-- ── BODY ── --}}
    <div class="email-body">

      <p class="greeting">Bonjour <span>{{ $avis->prenom ?: $avis->nom }}</span> ! 👋</p>

      <p class="intro-text">
        Excellente nouvelle ! Votre témoignage a été validé par notre équipe de modération
        et est désormais <strong>publié sur notre site web</strong>. Merci infiniment pour
        votre confiance et votre retour précieux.
      </p>

      {{-- ── Avis card ── --}}
      <div class="avis-card">
        <div class="avis-stars">
          @for($i = 1; $i <= ($avis->note ?? 5); $i++) ⭐ @endfor
        </div>
        <div class="avis-texte">{{ $avis->texte }}</div>
        <div class="avis-author">
          ✍️ {{ $avis->prenom ? $avis->prenom . ' ' . $avis->nom : $avis->nom }}
          @if($avis->role_label)
            &nbsp;·&nbsp; {{ $avis->role_label }}
          @endif
        </div>
      </div>

      {{-- ── Info box ── --}}
      <div class="info-box">
        <div class="info-icon">✅</div>
        <div class="info-text">
          <strong>Ce que cela signifie :</strong> Votre avis aide des futurs conducteurs à choisir
          une auto-école sérieuse et de qualité. Vous contribuez à notre réputation
          et à la communauté.
        </div>
      </div>

      {{-- ── CTA ── --}}
      <div class="cta-wrap">
        <a href="{{ config('app.url') }}/about-details" class="cta-btn">
          🌐 Voir mon avis sur le site
        </a>
      </div>

      <hr class="divider">

      {{-- ── Features ── --}}
      <div class="features">
        <div class="feature-item">
          <div class="feature-icon">📚</div>
          <div class="feature-label">Cours de code<br>disponibles</div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">🚗</div>
          <div class="feature-label">Séances de<br>conduite</div>
        </div>
        <div class="feature-item">
          <div class="feature-icon">📝</div>
          <div class="feature-label">Quiz QCM<br>en ligne</div>
        </div>
      </div>

      <hr class="divider">

      {{-- ── Signature ── --}}
      <div class="signature">
        <div class="sig-avatar">🏫</div>
        <div>
          <div class="sig-name">L'équipe Auto École Narjiss</div>
          <div class="sig-role">Marrakech &nbsp;·&nbsp; Disponible 6j/7 &nbsp;·&nbsp; 📞 +212 XXXXXXXXX</div>
        </div>
      </div>

      <p style="font-size:13px;color:#94a3b8;text-align:center;">
        À très bientôt sur la route ! 🚦
      </p>

    </div>{{-- /email-body --}}

    {{-- ── FOOTER ── --}}
    <div class="email-footer">
      <div class="footer-links">
        <a href="{{ config('app.url') }}">🏠 Accueil</a>
        <a href="{{ config('app.url') }}/cours">📚 Cours</a>
        <a href="{{ config('app.url') }}/contact">✉️ Contact</a>
      </div>
      <div class="footer-copy">
        &copy; {{ date('Y') }} Auto École Narjiss — Marrakech. Tous droits réservés.
      </div>
      <div class="footer-addr">
        Cet email a été envoyé automatiquement suite à la validation de votre avis.
      </div>
    </div>

  </div>{{-- /wrapper --}}
</body>
</html>
