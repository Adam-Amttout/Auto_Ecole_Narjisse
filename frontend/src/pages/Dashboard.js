import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API = "http://127.0.0.1:8000/api";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const TABS = [
  { key:"accueil",      icon:"📊", label:"Tableau de bord" },
  { key:"clients",      icon:"👤", label:"Clients"          },
  { key:"inscriptions", icon:"📋", label:"Inscriptions"     },
  { key:"cours",        icon:"📚", label:"Cours"            },
  { key:"moniteurs",    icon:"🧑‍🏫", label:"Moniteurs"      },
  { key:"vehicules",    icon:"🚗", label:"Véhicules"        },
  { key:"seances",      icon:"📅", label:"Séances"          },
];

const STATUT_SEANCE = {
  planifiee: { label:"Planifiée", bg:"#dbeafe", color:"#1d4ed8" },
  en_cours:  { label:"En cours",  bg:"#fef9c3", color:"#a16207" },
  terminee:  { label:"Terminée",  bg:"#dcfce7", color:"#15803d" },
  annulee:   { label:"Annulée",   bg:"#f1f5f9", color:"#64748b" },
};

/* Petit composant badge */
const Badge = ({ text, bg, color }) => (
  <span style={{ background: bg, color, padding:"2px 10px", borderRadius:20, fontSize:11.5, fontWeight:700, whiteSpace:"nowrap" }}>
    {text}
  </span>
);

/* Boutons d'action */
function ActionBtns({ onView, onEdit, onDelete, onAnnuler, confirmId, setConfirmId, id }) {
  return (
    <div className="db-actions">
      {onView    && <button className="db-btn view"  onClick={() => onView(id)}  title="Voir">👁</button>}
      {onEdit    && <button className="db-btn edit"  onClick={() => onEdit(id)}  title="Modifier">✏️</button>}
      {onAnnuler && <button className="db-btn warn"  onClick={() => onAnnuler(id)} title="Annuler">✕</button>}
      {confirmId === id ? (
        <>
          <button className="db-btn danger"   onClick={() => { onDelete(id); setConfirmId(null); }}>Oui</button>
          <button className="db-btn neutral"  onClick={() => setConfirmId(null)}>Non</button>
        </>
      ) : (
        onDelete && <button className="db-btn danger" onClick={() => setConfirmId(id)} title="Supprimer">🗑️</button>
      )}
    </div>
  );
}

/* Modal générique */
function Modal({ show, onClose, title, children, onSave, saveLabel = "Enregistrer", error }) {
  if (!show) return null;
  return (
    <div className="db-modal-overlay" onClick={onClose}>
      <div className="db-modal" onClick={e => e.stopPropagation()}>
        <div className="db-modal-head">
          <h5>{title}</h5>
          <button className="db-modal-x" onClick={onClose}>×</button>
        </div>
        <div className="db-modal-body">
          {error && <div className="db-alert err">⚠ {error}</div>}
          {children}
        </div>
        <div className="db-modal-foot">
          <button className="db-btn neutral lg" onClick={onClose}>Annuler</button>
          <button className="db-btn primary lg" onClick={onSave}>{saveLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const [tab, setTab]       = useState("accueil");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── données ── */
  const [clients,      setClients]      = useState([]);
  const [inscriptions, setInscriptions] = useState([]);
  const [cours,        setCours]        = useState([]);
  const [moniteurs,    setMoniteurs]    = useState([]);
  const [vehicules,    setVehicules]    = useState([]);
  const [seances,      setSeances]      = useState([]);

  /* ── modal ── */
  const [modal,      setModal]      = useState({ show:false, title:"", entity:"" });
  const [formData,   setFormData]   = useState({});
  const [editId,     setEditId]     = useState(null);
  const [modalErr,   setModalErr]   = useState("");
  const [confirmId,  setConfirmId]  = useState(null);
  const [toast,      setToast]      = useState({ show:false, msg:"", ok:true });

  const showToast = (msg, ok=true) => { setToast({show:true,msg,ok}); setTimeout(()=>setToast(t=>({...t,show:false})),3000); };

  /* ── chargement ── */
  const load = useCallback(async () => {
    try {
      const [cl,ins,co,mo,ve,se] = await Promise.allSettled([
        axios.get(`${API}/clients`),
        axios.get(`${API}/inscriptions`),
        axios.get(`${API}/cours`),
        axios.get(`${API}/moniteurs`),
        axios.get(`${API}/vehicules`),
        axios.get(`${API}/seances`),
      ]);
      if (cl.status==="fulfilled")  setClients(cl.value.data);
      if (ins.status==="fulfilled") setInscriptions(ins.value.data);
      if (co.status==="fulfilled")  setCours(co.value.data);
      if (mo.status==="fulfilled")  setMoniteurs(mo.value.data);
      if (ve.status==="fulfilled")  setVehicules(ve.value.data);
      if (se.status==="fulfilled")  setSeances(se.value.data);
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── ouvrir modal ── */
  const openModal = (entity, title, data={}, id=null) => {
    setModal({ show:true, title, entity });
    setFormData(data);
    setEditId(id);
    setModalErr("");
  };

  /* ── sauvegarder ── */
  const handleSave = async () => {
    setModalErr("");
    const { entity } = modal;
    const urls = {
      client:      { post: `${API}/clients`,                put: `${API}/clients/${editId}`         },
      inscription: { post: `${API}/inscription`,            put: `${API}/inscriptions/${editId}`     },
      cours:       { post: `${API}/cours`,                  put: `${API}/cours/${editId}`            },
      moniteur:    { post: `${API}/moniteurs`,              put: `${API}/moniteurs/${editId}`        },
      vehicule:    { post: `${API}/vehicules`,              put: `${API}/vehicules/${editId}`        },
      seance:      { post: `${API}/seances`,                put: `${API}/seances/${editId}`          },
    };
    try {
      if (editId) await axios.put(urls[entity].put, formData);
      else        await axios.post(urls[entity].post, formData);
      setModal(m=>({...m,show:false}));
      await load();
      showToast(editId ? "Mis à jour !" : "Créé avec succès !");
    } catch (e) {
      setModalErr(e.response?.data?.message || "Erreur lors de l'enregistrement.");
    }
  };

  /* ── supprimer ── */
  const handleDelete = async (entity, id) => {
    const urls = {
      client:      `${API}/clients/${id}`,
      inscription: `${API}/inscriptions/${id}`,
      cours:       `${API}/cours/${id}`,
      moniteur:    `${API}/moniteurs/${id}`,
      vehicule:    `${API}/vehicules/${id}`,
      seance:      `${API}/seances/${id}`,
    };
    try {
      await axios.delete(urls[entity]);
      await load();
      showToast("Supprimé.");
    } catch (e) {
      showToast(e.response?.data?.message || "Impossible de supprimer.", false);
    }
    setConfirmId(null);
  };

  const annulerSeance = async (id) => {
    try {
      await axios.patch(`${API}/seances/${id}/annuler`);
      await load();
      showToast("Séance annulée.");
    } catch (e) {
      showToast(e.response?.data?.message || "Erreur.", false);
    }
  };

  /* champ form helper */
  const F = (key, label, type="text", options=null) => (
    <div className="db-field" key={key}>
      <label>{label}</label>
      {options ? (
        <select className="db-input" value={formData[key]||""} onChange={e=>setFormData({...formData,[key]:e.target.value})}>
          {options.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea className="db-input" rows={3} value={formData[key]||""} onChange={e=>setFormData({...formData,[key]:e.target.value})}/>
      ) : (
        <input className="db-input" type={type} value={formData[key]||""} onChange={e=>setFormData({...formData,[key]:e.target.value})}/>
      )}
    </div>
  );

  const stats = [
    { icon:"👤", label:"Clients",      val: clients.length,      color:"#e63946" },
    { icon:"📋", label:"Inscriptions", val: inscriptions.length, color:"#2563eb" },
    { icon:"📚", label:"Cours",        val: cours.length,        color:"#7c3aed" },
    { icon:"🧑‍🏫", label:"Moniteurs",  val: moniteurs.length,    color:"#0891b2" },
    { icon:"🚗", label:"Véhicules",    val: vehicules.length,    color:"#059669" },
    { icon:"📅", label:"Séances",      val: seances.length,      color:"#d97706" },
  ];

  /* ─────────── RENDER ─────────── */
  return (
    <div className="db-layout">

      {/* ── SIDEBAR ── */}
      <aside className={`db-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="db-sidebar-brand">
          <span className="db-sidebar-logo">N</span>
          <span className="db-sidebar-title">Narjiss Admin</span>
        </div>

        <nav className="db-sidebar-nav">
          {TABS.map(t => (
            <button key={t.key}
              className={`db-sidebar-link ${tab === t.key ? "active" : ""}`}
              onClick={() => { setTab(t.key); setSidebarOpen(false); }}>
              <span className="db-sidebar-icon">{t.icon}</span>
              <span className="db-sidebar-label">{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="db-sidebar-footer">
          <button className="db-sidebar-link logout" onClick={() => { localStorage.removeItem("user"); localStorage.removeItem("role"); navigate("/connexion"); }}>
            <span className="db-sidebar-icon">🚪</span>
            <span className="db-sidebar-label">Déconnexion</span>
          </button>
          <button className="db-sidebar-link" onClick={() => navigate("/")}>
            <span className="db-sidebar-icon">🏠</span>
            <span className="db-sidebar-label">Accueil site</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="db-main">

        {/* Top bar mobile */}
        <div className="db-topbar">
          <button className="db-burger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="db-topbar-title">{TABS.find(t=>t.key===tab)?.label || "Dashboard"}</span>
        </div>

        {/* Toast */}
        {toast.show && (
          <div className={`db-toast ${toast.ok?"ok":"err"}`}>
            {toast.ok ? "✅" : "❌"} {toast.msg}
          </div>
        )}

        {/* ══════════ ACCUEIL ══════════ */}
        {tab === "accueil" && (
          <div className="db-section">
            <h4 className="db-title">Tableau de bord</h4>
            <div className="db-stats-grid">
              {stats.map((s,i) => (
                <div key={i} className="db-stat-card" style={{"--sc":s.color}}>
                  <div className="db-stat-icon">{s.icon}</div>
                  <div className="db-stat-val">{s.val}</div>
                  <div className="db-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="db-recent-grid">
              <div className="db-card">
                <div className="db-card-head"><span>👤 Derniers clients</span></div>
                <table className="db-table"><tbody>
                  {clients.slice(0,5).map(c=>(
                    <tr key={c.id}>
                      <td><b>{c.prenom} {c.nom}</b></td>
                      <td style={{color:"#94a3b8",fontSize:12}}>{c.email}</td>
                      <td><Badge text={c.role} bg={c.role==="admin"?"#fee2e2":"#dbeafe"} color={c.role==="admin"?"#b91c1c":"#1d4ed8"}/></td>
                    </tr>
                  ))}
                </tbody></table>
              </div>
              <div className="db-card">
                <div className="db-card-head"><span>📅 Dernières séances</span></div>
                <table className="db-table"><tbody>
                  {seances.slice(0,5).map(s=>(
                    <tr key={s.id}>
                      <td><b>{s.client?.nom} {s.client?.prenom}</b></td>
                      <td style={{fontSize:12,color:"#64748b"}}>{new Date(s.date).toLocaleDateString("fr-FR")}</td>
                      <td><Badge text={STATUT_SEANCE[s.statut]?.label||s.statut} bg={STATUT_SEANCE[s.statut]?.bg||"#f1f5f9"} color={STATUT_SEANCE[s.statut]?.color||"#64748b"}/></td>
                    </tr>
                  ))}
                </tbody></table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ CLIENTS ══════════ */}
        {tab === "clients" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">Clients ({clients.length})</h4>
              <button className="db-btn primary" onClick={() => openModal("client","➕ Ajouter un client",{role:"user"})}>
                + Ajouter
              </button>
            </div>
            <div className="db-card">
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead><tr><th>#</th><th>Nom complet</th><th>Email</th><th>Rôle</th><th>Inscrit le</th><th>Actions</th></tr></thead>
                  <tbody>
                    {clients.length===0 && <tr><td colSpan={6} className="db-empty">Aucun client</td></tr>}
                    {clients.map(c=>(
                      <tr key={c.id}>
                        <td className="db-id">{c.id}</td>
                        <td><b>{c.nom} {c.prenom}</b></td>
                        <td style={{color:"#64748b"}}>{c.email}</td>
                        <td><Badge text={c.role} bg={c.role==="admin"?"#fee2e2":"#dbeafe"} color={c.role==="admin"?"#b91c1c":"#1d4ed8"}/></td>
                        <td style={{fontSize:12,color:"#94a3b8"}}>{new Date(c.created_at).toLocaleDateString("fr-FR")}</td>
                        <td>
                          <ActionBtns
                            onView  ={() => window.open(`/profil/${c.id}`,"_blank")}
                            onEdit  ={() => openModal("client",`✏️ Modifier ${c.prenom}`,{nom:c.nom,prenom:c.prenom,email:c.email,password:"",role:c.role},c.id)}
                            onDelete={() => handleDelete("client",c.id)}
                            confirmId={confirmId} setConfirmId={setConfirmId} id={c.id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ INSCRIPTIONS ══════════ */}
        {tab === "inscriptions" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">Inscriptions ({inscriptions.length})</h4>
              <button className="db-btn primary" onClick={() => openModal("inscription","➕ Ajouter une inscription",{})}>
                + Ajouter
              </button>
            </div>
            <div className="db-card">
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead><tr><th>#</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Sujet</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {inscriptions.length===0 && <tr><td colSpan={7} className="db-empty">Aucune inscription</td></tr>}
                    {inscriptions.map(i=>(
                      <tr key={i.id}>
                        <td className="db-id">{i.id}</td>
                        <td><b>{i.nom} {i.prenom}</b></td>
                        <td style={{color:"#64748b"}}>{i.email}</td>
                        <td style={{fontSize:13}}>{i.telephone||"—"}</td>
                        <td><Badge text={i.sujet||"—"} bg="#f0f9ff" color="#0369a1"/></td>
                        <td style={{fontSize:12,color:"#94a3b8"}}>{new Date(i.created_at).toLocaleDateString("fr-FR")}</td>
                        <td>
                          <ActionBtns
                            onEdit  ={() => openModal("inscription","✏️ Modifier l'inscription",{nom:i.nom,prenom:i.prenom,email:i.email,telephone:i.telephone,sujet:i.sujet,message:i.message},i.id)}
                            onDelete={() => handleDelete("inscription",i.id)}
                            confirmId={confirmId} setConfirmId={setConfirmId} id={i.id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ COURS ══════════ */}
        {tab === "cours" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">Cours ({cours.length})</h4>
              <button className="db-btn primary" onClick={() => openModal("cours","➕ Ajouter un cours",{categorie:"danger",niveau:"debutant"})}>
                + Ajouter
              </button>
            </div>
            <div className="db-card">
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead><tr><th>#</th><th>Titre</th><th>Catégorie</th><th>Niveau</th><th>Statut</th><th>Actions</th></tr></thead>
                  <tbody>
                    {cours.length===0 && <tr><td colSpan={6} className="db-empty">Aucun cours</td></tr>}
                    {cours.map(c=>(
                      <tr key={c.id}>
                        <td className="db-id">{c.id}</td>
                        <td><b>{c.titre}</b><div style={{fontSize:11.5,color:"#94a3b8",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.description}</div></td>
                        <td><Badge text={c.categorie} bg={{danger:"#fee2e2",indication:"#dbeafe",interdiction:"#fff7ed",autre:"#f0fdf4"}[c.categorie]||"#f1f5f9"} color={{danger:"#b91c1c",indication:"#1d4ed8",interdiction:"#c2410c",autre:"#15803d"}[c.categorie]||"#64748b"}/></td>
                        <td><Badge text={c.niveau} bg={{debutant:"#dcfce7",intermediaire:"#fef9c3",avance:"#fee2e2"}[c.niveau]||"#f1f5f9"} color={{debutant:"#15803d",intermediaire:"#a16207",avance:"#b91c1c"}[c.niveau]||"#64748b"}/></td>
                        <td><Badge text={c.actif?"Actif":"Inactif"} bg={c.actif?"#dcfce7":"#f1f5f9"} color={c.actif?"#15803d":"#64748b"}/></td>
                        <td>
                          <ActionBtns
                            onEdit  ={() => openModal("cours","✏️ Modifier le cours",{titre:c.titre,description:c.description||"",categorie:c.categorie,image:c.image||"",niveau:c.niveau},c.id)}
                            onDelete={() => handleDelete("cours",c.id)}
                            confirmId={confirmId} setConfirmId={setConfirmId} id={c.id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ MONITEURS ══════════ */}
        {tab === "moniteurs" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">Moniteurs ({moniteurs.length})</h4>
              <button className="db-btn primary" onClick={() => openModal("moniteur","➕ Ajouter un moniteur",{actif:true})}>
                + Ajouter
              </button>
            </div>
            <div className="db-card">
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead><tr><th>#</th><th>Nom complet</th><th>Téléphone</th><th>Email</th><th>Statut</th><th>Actions</th></tr></thead>
                  <tbody>
                    {moniteurs.length===0 && <tr><td colSpan={6} className="db-empty">Aucun moniteur</td></tr>}
                    {moniteurs.map(m=>(
                      <tr key={m.id}>
                        <td className="db-id">{m.id}</td>
                        <td><b>{m.prenom} {m.nom}</b></td>
                        <td>{m.telephone}</td>
                        <td style={{color:"#64748b"}}>{m.email}</td>
                        <td><Badge text={m.actif?"Actif":"Inactif"} bg={m.actif?"#dcfce7":"#f1f5f9"} color={m.actif?"#15803d":"#64748b"}/></td>
                        <td>
                          <ActionBtns
                            onEdit  ={() => openModal("moniteur","✏️ Modifier le moniteur",{nom:m.nom,prenom:m.prenom,telephone:m.telephone,email:m.email,actif:m.actif},m.id)}
                            onDelete={() => handleDelete("moniteur",m.id)}
                            confirmId={confirmId} setConfirmId={setConfirmId} id={m.id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ VÉHICULES ══════════ */}
        {tab === "vehicules" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">Véhicules ({vehicules.length})</h4>
              <button className="db-btn primary" onClick={() => openModal("vehicule","➕ Ajouter un véhicule",{disponibilite:"disponible"})}>
                + Ajouter
              </button>
            </div>
            <div className="db-card">
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead><tr><th>#</th><th>Véhicule</th><th>Immatriculation</th><th>Disponibilité</th><th>Actions</th></tr></thead>
                  <tbody>
                    {vehicules.length===0 && <tr><td colSpan={5} className="db-empty">Aucun véhicule</td></tr>}
                    {vehicules.map(v=>(
                      <tr key={v.id}>
                        <td className="db-id">{v.id}</td>
                        <td><b>{v.marque} {v.modele}</b></td>
                        <td><code style={{background:"#f1f5f9",padding:"2px 7px",borderRadius:5,fontSize:12}}>{v.immatriculation}</code></td>
                        <td><Badge
                          text={{disponible:"Disponible",en_maintenance:"Maintenance",hors_service:"Hors service"}[v.disponibilite]||v.disponibilite}
                          bg={{disponible:"#dcfce7",en_maintenance:"#fef9c3",hors_service:"#fee2e2"}[v.disponibilite]||"#f1f5f9"}
                          color={{disponible:"#15803d",en_maintenance:"#a16207",hors_service:"#b91c1c"}[v.disponibilite]||"#64748b"}
                        /></td>
                        <td>
                          <ActionBtns
                            onEdit  ={() => openModal("vehicule","✏️ Modifier le véhicule",{marque:v.marque,modele:v.modele,immatriculation:v.immatriculation,disponibilite:v.disponibilite},v.id)}
                            onDelete={() => handleDelete("vehicule",v.id)}
                            confirmId={confirmId} setConfirmId={setConfirmId} id={v.id}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ SÉANCES ══════════ */}
        {tab === "seances" && (
          <div className="db-section">
            <div className="db-section-head">
              <h4 className="db-title">Séances de conduite ({seances.length})</h4>
              <button className="db-btn primary" onClick={() => openModal("seance","➕ Planifier une séance",{
                client_id:"", moniteur_id:"", vehicule_id:"",
                date:"", heure_debut:"", heure_fin:"", notes:""
              })}>
                + Planifier
              </button>
            </div>
            <div className="db-card">
              <div className="db-table-wrap">
                <table className="db-table">
                  <thead><tr><th>#</th><th>Élève</th><th>Moniteur</th><th>Véhicule</th><th>Date</th><th>Horaire</th><th>Statut</th><th>Actions</th></tr></thead>
                  <tbody>
                    {seances.length===0 && <tr><td colSpan={8} className="db-empty">Aucune séance</td></tr>}
                    {seances.map(s=>{
                      const st = STATUT_SEANCE[s.statut]||{label:s.statut,bg:"#f1f5f9",color:"#64748b"};
                      return (
                        <tr key={s.id}>
                          <td className="db-id">{s.id}</td>
                          <td><b>{s.client?.nom} {s.client?.prenom}</b></td>
                          <td>{s.moniteur?.prenom} {s.moniteur?.nom}</td>
                          <td style={{fontSize:12}}>{s.vehicule?.marque} {s.vehicule?.modele}</td>
                          <td style={{fontSize:12}}>{new Date(s.date).toLocaleDateString("fr-FR",{day:"2-digit",month:"short"})}</td>
                          <td style={{fontSize:12,whiteSpace:"nowrap"}}>{s.heure_debut} – {s.heure_fin}</td>
                          <td><Badge text={st.label} bg={st.bg} color={st.color}/></td>
                          <td>
                            <ActionBtns
                              onAnnuler={s.statut==="planifiee" ? annulerSeance : null}
                              onDelete ={() => handleDelete("seance",s.id)}
                              confirmId={confirmId} setConfirmId={setConfirmId} id={s.id}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ══════════ MODAL ══════════ */}
      <Modal show={modal.show} onClose={()=>setModal(m=>({...m,show:false}))}
        title={modal.title} onSave={handleSave} error={modalErr}>

        {modal.entity === "client" && <>
          <div className="db-form-row">
            {F("nom","Nom")}
            {F("prenom","Prénom")}
          </div>
          {F("email","Email","email")}
          {F("password","Mot de passe","password")}
          {F("role","Rôle","text",[{v:"user",l:"Utilisateur"},{v:"admin",l:"Admin"}])}
        </>}

        {modal.entity === "inscription" && <>
          <div className="db-form-row">
            {F("nom","Nom")}
            {F("prenom","Prénom")}
          </div>
          <div className="db-form-row">
            {F("email","Email","email")}
            {F("telephone","Téléphone")}
          </div>
          {F("sujet","Sujet","text",[
            {v:"",l:"-- Choisir --"},{v:"Inscription",l:"Inscription"},
            {v:"Information",l:"Information"},{v:"Tarifs",l:"Tarifs"},
            {v:"Cours de code",l:"Cours de code"},{v:"Cours de conduite",l:"Cours de conduite"}
          ])}
          {F("message","Message","textarea")}
        </>}

        {modal.entity === "cours" && <>
          {F("titre","Titre *")}
          {F("description","Description","textarea")}
          <div className="db-form-row">
            {F("categorie","Catégorie","text",[
              {v:"danger",l:"Danger"},{v:"indication",l:"Indication"},
              {v:"interdiction",l:"Interdiction"},{v:"autre",l:"Autre"}
            ])}
            {F("niveau","Niveau","text",[
              {v:"debutant",l:"Débutant"},{v:"intermediaire",l:"Intermédiaire"},{v:"avance",l:"Avancé"}
            ])}
          </div>
          {F("image","URL Image (optionnel)")}
        </>}

        {modal.entity === "moniteur" && <>
          <div className="db-form-row">
            {F("nom","Nom")}
            {F("prenom","Prénom")}
          </div>
          <div className="db-form-row">
            {F("telephone","Téléphone")}
            {F("email","Email","email")}
          </div>
          {F("actif","Statut","text",[{v:true,l:"Actif"},{v:false,l:"Inactif"}])}
        </>}

        {modal.entity === "vehicule" && <>
          <div className="db-form-row">
            {F("marque","Marque")}
            {F("modele","Modèle")}
          </div>
          {F("immatriculation","Immatriculation")}
          {F("disponibilite","Disponibilité","text",[
            {v:"disponible",l:"Disponible"},{v:"en_maintenance",l:"En maintenance"},{v:"hors_service",l:"Hors service"}
          ])}
        </>}

        {modal.entity === "seance" && <>
          {F("client_id","Élève","text",clients.map(c=>({v:c.id,l:`${c.prenom} ${c.nom}`})))}
          {F("moniteur_id","Moniteur","text",moniteurs.map(m=>({v:m.id,l:`${m.prenom} ${m.nom}`})))}
          {F("vehicule_id","Véhicule","text",vehicules.map(v=>({v:v.id,l:`${v.marque} ${v.modele} (${v.immatriculation})`})))}
          {F("date","Date","date")}
          <div className="db-form-row">
            {F("heure_debut","Heure début","time")}
            {F("heure_fin","Heure fin","time")}
          </div>
          {F("notes","Notes (optionnel)","textarea")}
        </>}

      </Modal>

      {/* Overlay mobile sidebar */}
      {sidebarOpen && <div className="db-overlay" onClick={()=>setSidebarOpen(false)}/>}
    </div>
  );
}