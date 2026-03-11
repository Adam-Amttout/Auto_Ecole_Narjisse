import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "./Services.css";

function Services() {

const services = [
{
title:"Formation Code de la Route",
icon:"🚦",
description:"Cours théoriques complets pour maîtriser le code de la route avec explications détaillées, exercices et tests."
},
{
title:"Cours de Conduite",
icon:"🚗",
description:"Séances pratiques avec des moniteurs qualifiés pour apprendre la conduite en toute sécurité."
},
{
title:"Tests en Ligne",
icon:"🧠",
description:"Plateforme de tests interactifs pour s'entraîner aux examens du code de la route."
},
{
title:"Formation Intensive",
icon:"⚡",
description:"Programme accéléré pour obtenir votre permis de conduire rapidement."
},
{
title:"Accompagnement Examen",
icon:"📝",
description:"Préparation complète pour les examens théoriques et pratiques."
},
{
title:"Perfectionnement",
icon:"🎯",
description:"Cours destinés aux conducteurs souhaitant améliorer leur maîtrise de la conduite."
}
];

const steps = [
"Inscription à l'auto-école",
"Cours théoriques de code",
"Tests et préparation examen",
"Cours pratiques de conduite",
"Passage de l'examen final"
];

return(

<div className="services-page">

{/* HERO */}

<section className="services-hero d-flex align-items-center text-white text-center">

<div className="container">

<h1>Nos Services</h1>

<p>
Auto-École Narjiss vous propose des formations complètes pour réussir votre permis
de conduire dans les meilleures conditions.
</p>

</div>

</section>

{/* SERVICES */}

<section className="container services-section">

<h2 className="text-center mb-5">
Nos Formations et Services
</h2>

<div className="row">

{services.map((service,index)=>(

<div className="col-md-4 mb-4" key={index}>

<div className="card service-card shadow">

<div className="card-body text-center">

<div className="service-icon">
{service.icon}
</div>

<h5 className="card-title">
{service.title}
</h5>

<p className="card-text">
{service.description}
</p>

</div>

</div>

</div>

))}

</div>

</section>

{/* PROCESS */}

<section className="process-section text-center">

<div className="container">

<h2 className="mb-5">
Comment obtenir votre permis ?
</h2>

<div className="row">

{steps.map((step,index)=>(

<div className="col-md-2 col-6 mb-4" key={index}>

<div className="step-box">

<div className="step-number">
{index+1}
</div>

<p>{step}</p>

</div>

</div>

))}

</div>

</div>

</section>

{/* ADVANTAGES */}

<section className="container advantages-section">

<h2 className="text-center mb-5">
Pourquoi choisir Auto-École Narjiss ?
</h2>

<div className="row">

<div className="col-md-4">
<h5>Moniteurs expérimentés</h5>
<p>Une équipe qualifiée pour vous accompagner tout au long de votre formation.</p>
</div>

<div className="col-md-4">
<h5>Horaires flexibles</h5>
<p>Des séances adaptées aux étudiants et aux professionnels.</p>
</div>

<div className="col-md-4">
<h5>Taux de réussite élevé</h5>
<p>Plus de 95% de réussite grâce à une formation efficace.</p>
</div>

</div>

</section>

{/* CTA */}

<section className="cta-section text-center text-white">

<div className="container">

<h2>Prêt à commencer votre formation ?</h2>

<p>Inscrivez-vous dès maintenant et obtenez votre permis rapidement.</p>

<Link to="/reservation" className="btn btn-warning btn-lg btn-inscription">
S'inscrire maintenant
</Link>
</div>

</section>

</div>

);

}

export default Services;